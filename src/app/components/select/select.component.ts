import {Component, OnInit} from '@angular/core';
import {FieldType, PropertyKey} from '../../classes/interfaces';
import {ElementComponent} from '../element.component';

@Component({
  selector: 'app-select',
  template: `
    <div fxLayout="row">
      <label *ngIf="label">{{label}}</label>
      <mat-radio-group [(ngModel)]="value" fxLayout="column" *ngIf="elementData.fieldType === fieldType.MULTIPLE_CHOICE">
        <mat-radio-button *ngFor="let option of options; let i = index" [value]="(i + 1).toString()">
          {{option}}
        </mat-radio-button>
      </mat-radio-group>
      <mat-select [(ngModel)]="value" fxLayout="column" *ngIf="elementData.fieldType === fieldType.DROP_DOWN">
        <mat-option *ngFor="let option of options; let i = index" [value]="(i + 1).toString()">
          {{option}}
        </mat-option>
      </mat-select>
    </div>
  `,
  styleUrls: ['./select.component.sass']
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
