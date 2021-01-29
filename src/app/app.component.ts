import {
  AfterViewInit, Component, Inject
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SourceInputDialogComponent } from './source-input-dialog/source-input-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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

  playerMetadata = {};
  storedResponses = '{}'; // TODO string? may refactor
  tempResponses = '{}';
  sessionId = '';
  // TODO fehlende params, nicht matchende ifs checken
  myScript = `iqb-scripted::1.0
title::Testscript Title
header::Abschnitt 1 Basic Elements
header
text::Standard Text Element
html::HTML Ele with <strong>strong</strong> text and hyperlink: <a href=”https://www.iqb.hu-berlin.de”>IQB website</a>
hr
rem::Kommentar. Soll nicht erscheinen!
header::Abschnitt 2 Eingabeelemente
input-text::text_var1::1::Text eingeben::Text nach Feld::0::10
input-number::num_var1::1::Nummer eingeben::Text nach Feld::0::10
header::Abschnitt 3 Auswahlelemente
checkbox::check_var1::0::Bitte ankreuzen
if-start::check_var1::true
  text::Checked
if-end
multiple-choice::mc_var1::1::Multiple Choice Feld: ::Choice1##Choice2##Choice3
if-start::mc_var1::1
  text::Choice 1 chosen
  if-start::check_var1::true
    text::and Checked
  if-end
if-else
  text::NOT Choice1
if-end
repeat-start::examineecount::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20
  text::Repeat Inhalt
  if-start::check_var1::true
    text::Checked
  if-end
repeat-end
repeat-start::examineecount::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20
  text::Repeat Inhalt
  repeat-start::examineecount::Wie viele Prüflinge gibt es2?::Angaben zu Prüfling::20
    text::Repeat Inhalt2
  repeat-end
repeat-end
`;

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.playerMetadata = AppComponent.getPlayerMetadata();
      if (this.isProductionMode) {
        window.addEventListener('message', (event: MessageEvent) => {
          if ('data' in event && 'type' in event.data) {
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
          apiVersion: this.playerMetadata['version'],
          notSupportedApiFeatures: this.playerMetadata['not-supported-api-features'],
          supportedUnitDefinitionTypes: this.playerMetadata['supported-unit-definition-types'],
          supportedUnitStateDataTypes: this.playerMetadata['supported-unit-state-data-types']
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

  static getPlayerMetadata(): object {
    const playerMetadata: object = {};
    const metaAttributes = document.querySelector('meta[name="application-name"]').attributes;
    for (let i = 0; i < metaAttributes.length; i++) {
      if (metaAttributes[i].localName === 'content') {
        playerMetadata['name'] = metaAttributes[i].value;
      } else if (metaAttributes[i].localName.substr(0, 5) === 'data-') {
        playerMetadata[metaAttributes[i].localName.substr(5)] = metaAttributes[i].value;
      }
    }
    return playerMetadata;
  }

  loadNewScript(): void {
    const dialogRef = this.dialog.open(SourceInputDialogComponent, {
      height: '400px',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
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
          unitStateType: this.playerMetadata['supported-unit-state-data-types']
        }
      }, '*');
    } else {
      this.tempResponses = event.detail;
      console.log('player sends data', event.detail);
    }
  }

  saveResponses(): void {
    this.storedResponses = this.tempResponses;
  }

  restoreResponses(): void {
    this.playerStartData = {
      unitDefinition: this.myScript,
      unitState: {
        dataParts: { allResponses: this.storedResponses }
      }
    };
    console.log('restored', this.storedResponses);
  }
}
