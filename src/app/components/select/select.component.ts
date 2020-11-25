import {Component, OnInit} from '@angular/core';
import {FieldType, PropertyKey} from '../../classes/interfaces';
import {ElementComponent} from '../element.component';

@Component({
  selector: 'app-select',
  styles: [
    '.r-group {display: flex; flex-direction: column; margin: 15px 0;}',
    '.r-option {margin: 5px;}'],
  template: `
    <div fxLayout="row">
      <label *ngIf="label">{{label}}</label>
      <mat-radio-group class="r-group" [(ngModel)]="value" fxLayout="column" *ngIf="elementData.fieldType === fieldType.MULTIPLE_CHOICE">
        <mat-radio-button class="r-option" *ngFor="let option of options; let i = index" [value]="(i + 1).toString()">
          {{option}}
        </mat-radio-button>
      </mat-radio-group>
      <mat-form-field appearance="fill" fxLayout="column" *ngIf="elementData.fieldType === fieldType.DROP_DOWN">
        <mat-select [(ngModel)]="value" placeholder="Bitte wählen">
          <mat-option *ngFor="let option of options; let i = index" [value]="(i + 1).toString()">
            {{option}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `
})
export class SelectComponent extends ElementComponent implements OnInit {
  label = '';
  options: string[] = [];
  fieldType = FieldType;

  ngOnInit(): void {
    this.label = this.elementData.getPropertyValue(PropertyKey.TEXT);
    const optionsStr = this.elementData.getPropertyValue(PropertyKey.TEXT2);
    if (optionsStr) {
      this.options = optionsStr.split('##');
    }
  }
}
