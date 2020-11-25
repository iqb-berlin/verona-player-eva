import { Component, OnInit } from '@angular/core';
import {ElementComponent} from '../element.component';
import {PropertyKey} from '../../classes/interfaces';

@Component({
  selector: 'app-checkbox',
  template: `
    <div fxLayout="row">
      <label *ngIf="preText">{{preText}}</label>
      <mat-checkbox [(ngModel)]="valueBool">{{postText}}</mat-checkbox>
    </div>
  `,
  styleUrls: ['./checkbox.component.sass']
})
export class CheckboxComponent extends ElementComponent implements OnInit {
  preText = '';
  postText = '';

  set valueBool(value: boolean) {
    this.value = value ? 'true' : '';
  }
  get valueBool(): boolean {
    return this.value === 'true';
  }

  ngOnInit(): void {
    this.preText = this.elementData.getPropertyValue(PropertyKey.TEXT);
    this.postText = this.elementData.getPropertyValue(PropertyKey.TEXT2);
  }
}
