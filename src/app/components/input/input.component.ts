import {Component, OnInit} from '@angular/core';
import {ElementComponent} from '../element.component';
import {FieldType, PropertyKey} from '../../classes/interfaces';

@Component({
  selector: 'app-input',
  template: `
    <div fxLayout="row">
      <p *ngIf="preText">{{preText}}</p>
      <mat-form-field *ngIf="linesNumber > 1">
        <textarea matInput [value]="elementData.value" [rows]="linesNumber"></textarea>
      </mat-form-field>
      <mat-form-field *ngIf="linesNumber === 1">
        <input matInput [id]="elementData.id"/>
      </mat-form-field>
      <p *ngIf="postText">{{postText}}</p>
    </div>
  `,
  styleUrls: ['./input.component.sass']
})
export class InputComponent extends ElementComponent implements OnInit {
  preText = '';
  postText = '';
  linesNumber = 1;

  ngOnInit(): void {
    this.preText = this.elementData.getPropertyValue(PropertyKey.TEXT);
    this.postText = this.elementData.getPropertyValue(PropertyKey.TEXT2);
    if (this.elementData.fieldType === FieldType.INPUT_TEXT) {
      const linesNumberStr = this.elementData.getPropertyValue(PropertyKey.LINES_NUMBER);
      if (linesNumberStr) {
        const linesNumberTry = Number(linesNumberStr);
        if (!isNaN(linesNumberTry)) {
          this.linesNumber = linesNumberTry;
        }
      }
    }
  }
}
