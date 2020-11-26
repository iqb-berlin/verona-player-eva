import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SourceInputDialogComponent} from './source-input-dialog/source-input-dialog.component';
import {ElementData} from './classes/element.data';
import {FieldType, PropertyKey} from './classes/interfaces';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  elements: ElementData[] = [];
  fieldType = FieldType;
  form = new FormGroup({});

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
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
text::so was geht doch ö

input-number::task12ahmfA::1::Teilaufgabe 1.2a (Analysis)::::2::11
input-text::task12a::1::Teilaufgabe 1.3a (Geo)::Balksisi aoisdfj oaisjioadm aosicj aoisjaoisjad oasijd
input-text::note::0::Weitere Kommentare zu den Prüfungsaufgaben (optional)::::20??Abschließend haben Sie an dieser Stelle die Möglichkeit, zusätzliche Hinweise und Kommentare zu den Prüfungsaufgaben und Erwartungshorizonten festzuhalten.
    `;
    this.elements = ElementData.parseScript(myScript.split('\n'));
  }

  setNewScript() {
    const dialogRef = this.dialog.open(SourceInputDialogComponent, {
      height: '400px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.elements = ElementData.parseScript(result.split('\n'));
      } else {
        this.elements = [];
        this.elements.push(new ElementData('c1', FieldType.HEADER));
        const ed = new ElementData('cancelled', FieldType.TEXT);
        ed.setPropertyValue(PropertyKey.TEXT, 'Abgebrochen');
        this.elements.push(ed);
      }
    });
  }

  elementValueChanged() {
    this.elements.forEach(e => {
      if (e.value) {
        console.log(e.id + ': ' + e.value);
      }
    });
  }
}
