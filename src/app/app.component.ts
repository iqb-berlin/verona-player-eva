import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { SourceInputDialogComponent } from './source-input-dialog/source-input-dialog.component';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form = new FormGroup({});
  playerMetadata = new Map<string, string>();
  sessionId = '';
  storedResponses = '{}';
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
    public dialog: MatDialog,
    @Inject('IS_PRODUCTION_MODE') readonly isProductionMode: boolean,
    public ds: DataService
  ) {}

  ngOnInit(): void {
    this.playerMetadata = DataService.getPlayerMetadata();
    console.log('playerMetadata', this.playerMetadata);
    if (this.isProductionMode) {
      window.addEventListener('message', (event: MessageEvent) => {
        if ('data' in event) {
          if ('type' in event.data) {
            switch (event.data.type) {
              case 'vopStartCommand':
                if (event.data.sessionId) {
                  this.sessionId = event.data.sessionId;
                  if (event.data.unitDefinition) {
                    let storedResponses = {};
                    if (event.data.unitState && event.data.unitState.dataParts) {
                      console.log('event.data.unitState.dataParts', event.data.unitState.dataParts);
                      const storedResponsesRaw = event.data.unitState.dataParts;
                      if (storedResponsesRaw && storedResponsesRaw.allResponses) {
                        storedResponses = JSON.parse(storedResponsesRaw.allResponses);
                      }
                    }
                    this.ds.setElements(event.data.unitDefinition.split('\n'), storedResponses);
                  } else {
                    console.error('player: (vopStartCommand) no unitDefinition is given');
                  }
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
      this.setScript();
    }
  }

  setScript(): void {
    this.ds.setElements(this.myScript.split('\n'), JSON.parse(this.storedResponses));
    console.log('this.ds.rootBlock', this.ds.rootBlock);
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
        this.setScript();
      }
    });
  }

  elementValueChanged(): void {
    const myNewValues = this.ds.getValues();
    this.ds.rootBlock.check(myNewValues);
    if (this.isProductionMode) {
      window.parent.postMessage({
        type: 'vopStateChangedNotification',
        sessionId: this.sessionId,
        timeStamp: Date.now(),
        unitState: {
          dataParts: {
            allResponses: JSON.stringify(myNewValues)
          },
          unitStateType: this.playerMetadata.get('supported-unit-state-data-types')
        }
      }, '*');
    } else {
      console.log(myNewValues);
      // ;
    }
  }

  responsesSave(): void {
    this.storedResponses = JSON.stringify(this.ds.getValues());
  }

  responsesRestore(): void {
    this.setScript();
    console.log(this.ds.getValues());
  }
}
