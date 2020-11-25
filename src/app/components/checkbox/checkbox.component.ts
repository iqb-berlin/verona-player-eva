import { Component, OnInit } from '@angular/core';
import {ElementComponent} from '../element.component';
import {PropertyKey} from '../../classes/interfaces';

@Component({
  selector: 'app-checkbox',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxFill>
      <div fxFlex="50" *ngIf="preText">
        <p>{{preText}}</p>
      </div>
      <div fxFlex="50">
          <mat-checkbox class="chb" [(ngModel)]="valueBool">{{postText}}</mat-checkbox>
      </div>
    </div>
  `,
  styles: [
    '.chb {margin: 5px;}']
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
