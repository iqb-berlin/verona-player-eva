import {Component, Inject, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { SourceInputDialogComponent } from './source-input-dialog/source-input-dialog.component';
import { UIElement } from './classes/UIElement';
import { FieldType, PropertyKey } from './classes/interfaces';
import {RepeatBlock, UIBlock} from './classes/UIBlock';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  rootBlock = new UIBlock();
  form = new FormGroup({});

  constructor(
    public dialog: MatDialog,
    @Inject('IS_PRODUCTION_MODE') readonly isProductionMode: boolean
  ) {}

  ngOnInit(): void {
    const playerMetadata = DataService.getPlayerMetadata();
    console.log('playerMetadata', playerMetadata);
    if (this.isProductionMode) {
      window.addEventListener('message', (event: MessageEvent) => {
        if ('data' in event) {
          if ('type' in event.data) {
            if (event.data.type === 'vopStartCommand') {
              if (event.data.unitDefinition) {
                console.log('player: got event.data.unitDefinition');
                this.rootBlock = DataService.parseScript(event.data.unitDefinition.split('\n'));
                if (this.rootBlock) {
                  console.log(`got ${this.rootBlock.elements.length}`);
                }
              }
            }
          }
        }
      });
      window.parent.postMessage({
        type: 'vopReadyNotification',
        apiVersion: playerMetadata.get('version')
      }, '*');
    } else {
      const myScript = `
html::And now <strong>this text here is bolded</strong>
html::And hyperlinks such as <a href=”https://www.iqb.hu-berlin.de”>this one to the IQB website</a>
header::Abschnitt 223
checkbox::soso::1::vorher nee aber doch::nachher hmpf
multiple-choice::mc433::0::label für MC::Apfel##Birne##Banane##Orange
multiple-choice::mc4337::1::::Möhre##Rübe##Kohl
drop-down::mc4344::1::label für Dropdown::Apfel##Birne##Banane##Orange
text::so was geht doch ü
hr

title::Titel
repeat-start::examineecount::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20??Sie können Angaben zu maximal 20 Prüflingen eintragen. Sollten sich im Kurs mehr als 20 Prüflinge befinden, ist eine Auswahl vorzunehmen. Diese Auswahl sollte so erfolgen, dass ein möglichst breites Leistungsspektrum abgebildet wird. Vermieden werden sollte eine selektive Berücksichtigung bzw. Nichtberücksichtigung bestimmter Gruppen (z. B. besonders leistungsschwache oder leistungsstarke Prüflinge, Schülerinnen und Schüler mit nichtdeutscher Herkunftssprache).
    input-number::task1::1::Teilaufgabe 1::::0::10
    input-number::task2::1::Teilaufgabe 2::::0::10
    input-number::task3::1::Teilaufgabe 3::::0::10
repeat-end
text::so was geht doch ö

input-number::task12ahmfA::1::Teilaufgabe 1.2a (Analysis)::::2::11
input-text::task12a::1::Teilaufgabe 1.3a (Geo)::Balksisi aoisdfj oaisjioadm aosicj aoisjaoisjad oasijd
input-text::note::0::Weitere Kommentare zu den Prüfungsaufgaben (optional)::::20??Abschließend haben Sie an dieser Stelle die Möglichkeit, zusätzliche Hinweise und Kommentare zu den Prüfungsaufgaben und Erwartungshorizonten festzuhalten.
`;
      this.rootBlock = DataService.parseScript(myScript.split('\n'));
    }
  }

  setNewScript(): void {
    const dialogRef = this.dialog.open(SourceInputDialogComponent, {
      height: '400px',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rootBlock = DataService.parseScript(result.split('\n'));
      } else {
        this.rootBlock = new UIBlock();
        this.rootBlock.elements.push(new UIElement('c1', FieldType.HEADER));
        const ed = new UIElement('cancelled', FieldType.SCRIPT_ERROR);
        ed.properties.set(PropertyKey.TEXT, 'Abgebrochen');
        this.rootBlock.elements.push(ed);
      }
    });
  }

  elementValueChanged(): void {
    if (!this.isProductionMode) {
      this.logBlock(this.rootBlock, 0);
    }
  }

  private logBlock(b: UIBlock, indent: number) {
    b.elements.forEach((elementOrBlock: UIBlock | UIElement) => {
      if (elementOrBlock instanceof UIElement) {
        if (elementOrBlock.value) {
          console.log(`${' '.repeat(indent)}${elementOrBlock.id}: ${elementOrBlock.value}`);
        }
      } else if (elementOrBlock instanceof RepeatBlock) {
        if (elementOrBlock.value) {
          console.log(`${' '.repeat(indent)}${elementOrBlock.id}: ${elementOrBlock.value}`);
        }
        this.logBlock(elementOrBlock, indent + 2);
      }
    });
  }
}
