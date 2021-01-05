import { Component } from '@angular/core';
import { ElementComponent } from '../element.component';

@Component({
  selector: 'player-sub-form',
  template: `
    <ng-container *ngIf="elementIsUIElement()" [ngSwitch]="elementDataAsUIElement.fieldType">
      <player-text *ngSwitchCase="fieldType.TEXT" [elementData]="elementData"></player-text>
      <player-text *ngSwitchCase="fieldType.HEADER" [elementData]="elementData"></player-text>
      <player-text *ngSwitchCase="fieldType.HTML" [elementData]="elementData"></player-text>
      <player-text *ngSwitchCase="fieldType.HR" [elementData]="elementData"></player-text>
      <player-text *ngSwitchCase="fieldType.TITLE" [elementData]="elementData"></player-text>
      <player-text *ngSwitchCase="fieldType.SCRIPT_ERROR" [elementData]="elementData"></player-text>
      <player-input *ngSwitchCase="fieldType.INPUT_TEXT" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-input>
      <player-input *ngSwitchCase="fieldType.INPUT_NUMBER" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-input>
      <player-checkbox *ngSwitchCase="fieldType.CHECKBOX" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-checkbox>
      <player-select *ngSwitchCase="fieldType.MULTIPLE_CHOICE" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-select>
      <player-select *ngSwitchCase="fieldType.DROP_DOWN" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-select>
    </ng-container>
    <player-repeat *ngIf="elementIsRepeatBlock()" [elementData]="elementData" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-repeat>
    <div *ngIf="elementIsIfThenElseBlockTrue()">
      <div *ngFor="let e of elementData.trueElements">
        <player-sub-form [elementData]="e" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm">
        </player-sub-form>
      </div>
    </div>
    <div *ngIf="elementIsIfThenElseBlockFalse()">
      <div *ngFor="let e of elementData.falseElements">
        <player-sub-form [elementData]="e" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm">
        </player-sub-form>
      </div>
    </div>

  `
})
export class SubFormComponent extends ElementComponent {

}
