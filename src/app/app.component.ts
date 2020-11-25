import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SourceInputDialogComponent} from './source-input-dialog/source-input-dialog.component';
import {ElementData} from './classes/element.data';
import {FieldType, PropertyKey} from './classes/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  elements: ElementData[] = [];
  fieldType = FieldType;

  constructor(public dialog: MatDialog) {}

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
      console.log(e.id + ': ' + e.value$.getValue());
    });
  }
}
