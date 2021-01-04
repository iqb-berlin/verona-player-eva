import {
  AfterViewInit, Component, Inject
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SourceInputDialogComponent } from './source-input-dialog/source-input-dialog.component';

@Component({
  selector: 'app-root',
  template: `
    <mat-card fxLayout="column" class="page">
      <mat-card-content>
        <player-component [startData]="playerStartData" (valueChanged)="elementValueChanged($event)"></player-component>
      </mat-card-content>
      <mat-card-actions *ngIf="!isProductionMode">
        <button mat-raised-button (click)="setNewScript()" matTooltip="Script eingeben">load</button>
        <!--<button mat-raised-button (click)="player.tryLeaveNotify()" matTooltip="Zeige Korrekturbedarf">validate</button>-->
        <button mat-raised-button (click)="responsesSave()" matTooltip="Speichere die aktuellen Antworten">save</button>
        <button mat-raised-button (click)="responsesRestore()" matTooltip="Stelle alle gespeicherten Antworten wieder her">restore</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    '.page {background-color: white; max-width: 900px; margin-left: auto; margin-right: auto;}'
  ]
})
export class AppComponent implements AfterViewInit {
  @Inject('IS_PRODUCTION_MODE') readonly isProductionMode: boolean;
  playerStartData = {
    unitDefinition: '',
    unitState: {
      dataParts: { allResponses: {} }
    }
  };

  playerMetadata = new Map<string, string>();
  storedResponses = '{}';
  tempResponses = '{}';
  sessionId = '';
  myScript = `iqb-scripted::1.0
html::And now <strong>this text here is bolded</strong>
html::And hyperlinks such as <a href=”https://www.iqb.hu-berlin.de”>this one to the IQB website</a>
header::Abschnitt 223
checkbox::soso::1::vorher nee aber doch::nachher hmpf
multiple-choice::mc433::0::label für MC::Apfel##Birne##Banane##Orange
multiple-choice::mc4337::1::::Möhre##Rübe##Kohl
drop-down::mc4344::1::label für Dropdown::Apfel##Birne##Banane##Orange
if-start::mc4344::1
  text::Du hast "Apfel" gewählt.
  if-start::mc4337::1
    text::Du hast auch noch "Möhre" gewählt.
  if-end
if-else
  text::Du hast NICHT "Apfel" gewählt.
if-end
hr

title::Titel
repeat-start::examineecount::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20??Sie können Angaben zu maximal 20 Prüflingen eintragen. Sollten sich im Kurs mehr als 20 Prüflinge befinden, ist eine Auswahl vorzunehmen. Diese Auswahl sollte so erfolgen, dass ein möglichst breites Leistungsspektrum abgebildet wird. Vermieden werden sollte eine selektive Berücksichtigung bzw. Nichtberücksichtigung bestimmter Gruppen (z. B. besonders leistungsschwache oder leistungsstarke Prüflinge, Schülerinnen und Schüler mit nichtdeutscher Herkunftssprache).
    input-number::task1::1::Teilaufgabe 1::::0::10
    if-start::mc4337::1
      input-number::task2::1::Teilaufgabe Möhre::::0::10
    if-else
      input-number::task3::1::Teilaufgabe nicht Möhre::::0::10
    if-end
repeat-end
text::so was geht doch ö

input-number::task12ahmfA::1::Teilaufgabe 1.2a (Analysis)::::2::11
input-text::task12a::1::Teilaufgabe 1.3a (Geo)::Balksisi aoisdfj oaisjioadm aosicj aoisjaoisjad oasijd
input-text::note::0::Weitere Kommentare zu den Prüfungsaufgaben (optional)::::20??Abschließend haben Sie an dieser Stelle die Möglichkeit, zusätzliche Hinweise und Kommentare zu den Prüfungsaufgaben und Erwartungshorizonten festzuhalten.
`;

  constructor(
    public dialog: MatDialog
  ) {}

  static getPlayerMetadata(): Map<string, string> {
    const myReturn: Map<string, string> = new Map();
    const metaAttributes = document.querySelector('meta[name="application-name"]').attributes;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < metaAttributes.length; i++) {
      if (metaAttributes[i].localName === 'content') {
        myReturn.set('name', metaAttributes[i].value);
      } else if (metaAttributes[i].localName.substr(0, 5) === 'data-') {
        myReturn.set(metaAttributes[i].localName.substr(5), metaAttributes[i].value);
      }
    }
    return myReturn;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.playerMetadata = AppComponent.getPlayerMetadata();
      if (this.isProductionMode) {
        window.addEventListener('message', (event: MessageEvent) => {
          if ('data' in event) {
            if ('type' in event.data) {
              switch (event.data.type) {
                case 'vopStartCommand':
                  if (event.data.sessionId) {
                    this.sessionId = event.data.sessionId;
                    this.playerStartData = event.data;
                  } else {
                    console.error('player: (vopStartCommand) no sessionId is given');
                  }
                  break;
                case 'vopPageNavigationCommand':
                case 'vopGetStateRequest':
                case 'vopStopCommand':
                case 'vopContinueCommand':
                  console.warn(`player: message of type ${event.data.type} not processed yet`);
                  break;
                default:
                  console.warn(`player: got message of unknown type ${event.data.type}`);
              }
            }
          }
        });
        window.addEventListener('blur', () => {
          window.parent.postMessage({
            type: 'vopWindowFocusChangedNotification',
            sessionId: this.sessionId,
            hasFocus: document.hasFocus()
          }, '*');
        });
        window.addEventListener('focus', () => {
          window.parent.postMessage({
            type: 'vopWindowFocusChangedNotification',
            sessionId: this.sessionId,
            hasFocus: document.hasFocus()
          }, '*');
        });
        window.parent.postMessage({
          type: 'vopReadyNotification',
          apiVersion: this.playerMetadata.get('version'),
          notSupportedApiFeatures: this.playerMetadata.get('not-supported-api-features'),
          supportedUnitDefinitionTypes: this.playerMetadata.get('supported-unit-definition-types'),
          supportedUnitStateDataTypes: this.playerMetadata.get('supported-unit-state-data-types')
        }, '*');
      } else {
        this.playerStartData = {
          unitDefinition: this.myScript,
          unitState: {
            dataParts: { allResponses: this.storedResponses }
          }
        };
      }
    });
  }

  setNewScript(): void {
    const dialogRef = this.dialog.open(SourceInputDialogComponent, {
      height: '400px',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.storedResponses = '{}';
        this.myScript = result;
        this.playerStartData = {
          unitDefinition: this.myScript,
          unitState: {
            dataParts: { allResponses: this.storedResponses }
          }
        };
      }
    });
  }

  elementValueChanged(event: CustomEvent): void {
    if (this.isProductionMode) {
      window.parent.postMessage({
        type: 'vopStateChangedNotification',
        sessionId: this.sessionId,
        timeStamp: Date.now(),
        unitState: {
          dataParts: {
            allResponses: event.detail
          },
          unitStateType: this.playerMetadata.get('supported-unit-state-data-types')
        }
      }, '*');
    } else {
      this.tempResponses = event.detail;
      console.log('player sends data', event.detail);
      // ;
    }
  }

  responsesSave(): void {
    this.storedResponses = this.tempResponses;
  }

  responsesRestore(): void {
    this.playerStartData = {
      unitDefinition: this.myScript,
      unitState: {
        dataParts: { allResponses: this.storedResponses }
      }
    };
    console.log('restored', this.storedResponses);
  }
}
