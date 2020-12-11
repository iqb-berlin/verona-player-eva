import { Component } from '@angular/core';
import { ElementComponent } from '../element.component';

@Component({
  selector: 'app-sub-form',
  template: `
    <ng-container *ngIf="elementIsUIElement()" [ngSwitch]="elementDataAsUIElement.fieldType">
      <app-text *ngSwitchCase="fieldType.TEXT" [elementData]="elementData"></app-text>
      <app-text *ngSwitchCase="fieldType.HEADER" [elementData]="elementData"></app-text>
      <app-text *ngSwitchCase="fieldType.HTML" [elementData]="elementData"></app-text>
      <app-text *ngSwitchCase="fieldType.HR" [elementData]="elementData"></app-text>
      <app-text *ngSwitchCase="fieldType.TITLE" [elementData]="elementData"></app-text>
      <app-text *ngSwitchCase="fieldType.SCRIPT_ERROR" [elementData]="elementData"></app-text>
      <app-input *ngSwitchCase="fieldType.INPUT_TEXT" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-input>
      <app-input *ngSwitchCase="fieldType.INPUT_NUMBER" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-input>
      <app-checkbox *ngSwitchCase="fieldType.CHECKBOX" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-checkbox>
      <app-select *ngSwitchCase="fieldType.MULTIPLE_CHOICE" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-select>
      <app-select *ngSwitchCase="fieldType.DROP_DOWN" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-select>
    </ng-container>
    <app-repeat *ngIf="elementIsRepeatBlock()" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-repeat>
    <div *ngIf="elementIsIfThenElseBlockTrue()">
      <div *ngFor="let e of elementDataAsIfThenElseBlock.trueElements">
        <app-sub-form [elementData]="e" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-sub-form>
      </div>
    </div>
    <div *ngIf="elementIsIfThenElseBlockFalse()">
      <div *ngFor="let e of elementDataAsIfThenElseBlock.falseElements">
        <app-sub-form [elementData]="e" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-sub-form>
      </div>
    </div>
  `
})
export class SubFormComponent extends ElementComponent {

}
