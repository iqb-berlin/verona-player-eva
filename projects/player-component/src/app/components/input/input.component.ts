import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from '../element.component';
import { FieldType, PropertyKey } from '../../classes/interfaces';
import { InputElement } from '../../classes/UIElement';

@Component({
  selector: 'player-input',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxFill>
      <div fxFlex="50" *ngIf="preText">
        <p>{{preText}}</p>
      </div>
      <div fxFlex="50" fxLayout="row">
        <mat-form-field *ngIf="linesNumber > 1" appearance="fill" fxFlex="90" fxFlexAlign="start">
          <textarea matInput mat-autosize [formControl]="textInputControl" [matAutosizeMaxRows]="linesNumber" autocomplete="off"></textarea>
          <mat-error *ngIf="textInputControl.errors">
            {{textInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <mat-form-field *ngIf="linesNumber <= 1 && elementDataAsUIElement.fieldType === fieldType.INPUT_TEXT" fxFlexAlign="start" appearance="fill" fxFlex="50">
          <input matInput [formControl]="textInputControl" autocomplete="off"/>
          <mat-error *ngIf="textInputControl.errors">
            {{textInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <mat-form-field *ngIf="linesNumber <= 1 && elementDataAsUIElement.fieldType === fieldType.INPUT_NUMBER" appearance="fill" fxFlexAlign="start" fxFlex="50">
          <input type="number" matInput [formControl]="numberInputControl" autocomplete="off"/>
          <mat-error *ngIf="numberInputControl.errors">
            {{numberInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <p *ngIf="postText">{{postText}}</p>
      </div>
    </div>
  `
})

export class InputComponent extends ElementComponent implements OnInit, OnDestroy {
  preText = '';
  postText = '';
  linesNumber = 1;
  numberInputControl = new FormControl();
  textInputControl = new FormControl();
  valueChangeSubscription: Subscription = null;

  ngOnInit(): void {
    if (this.elementData instanceof InputElement) {
      this.preText = this.elementData.properties.get(PropertyKey.TEXT);
      this.postText = this.elementData.properties.get(PropertyKey.TEXT2);
      if (this.elementData.fieldType === FieldType.INPUT_TEXT) {
        const linesNumberStr = this.elementData.properties.get(PropertyKey.LINES_NUMBER);
        if (linesNumberStr) {
          const linesNumberTry = Number(linesNumberStr);
          if (!Number.isNaN(linesNumberTry)) {
            this.linesNumber = linesNumberTry;
          }
        }
        const myValidators = [];
        const maxLengthStr = this.elementData.properties.get(PropertyKey.MAX_LENGTH);
        if (maxLengthStr) {
          const maxLengthNumberTry = Number(maxLengthStr);
          if (!Number.isNaN(maxLengthNumberTry)) {
            myValidators.push(Validators.maxLength(maxLengthNumberTry));
          }
        }
        if (this.elementData.required) {
          myValidators.push(Validators.required);
        }
        if (myValidators.length > 0) {
          this.textInputControl.setValidators(myValidators);
        }
        if (this.value) {
          this.textInputControl.setValue(this.value);
        }
        this.parentForm.addControl(this.elementData.id, this.textInputControl);
        this.valueChangeSubscription = this.textInputControl.valueChanges.subscribe(() => {
          if (this.textInputControl.valid) {
            this.value = this.textInputControl.value;
          } else {
            this.value = '';
          }
        });
      } else if (this.elementData.fieldType === FieldType.INPUT_NUMBER) {
        const myValidators = [];
        myValidators.push(Validators.pattern(/^\d+$/));
        const maxValueStr = this.elementData.properties.get(PropertyKey.MAX_VALUE);
        if (maxValueStr) {
          const maxValueNumberTry = Number(maxValueStr);
          if (!Number.isNaN(maxValueNumberTry)) {
            myValidators.push(Validators.max(maxValueNumberTry));
          }
        }
        const minValueStr = this.elementData.properties.get(PropertyKey.MIN_VALUE);
        if (minValueStr) {
          const minValueNumberTry = Number(minValueStr);
          if (!Number.isNaN(minValueNumberTry)) {
            myValidators.push(Validators.min(minValueNumberTry));
          }
        }
        if (this.elementData.required) {
          myValidators.push(Validators.required);
        }
        if (this.value) {
          this.numberInputControl.setValue(this.value);
        }
        this.numberInputControl.setValidators(myValidators);
        this.parentForm.addControl(this.elementData.id, this.numberInputControl);
        this.valueChangeSubscription = this.numberInputControl.valueChanges.subscribe(() => {
          if (this.numberInputControl.valid) {
            this.value = this.numberInputControl.value;
          } else {
            this.value = '';
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.valueChangeSubscription !== null) {
      this.valueChangeSubscription.unsubscribe();
      this.parentForm.removeControl(this.elementData.id);
    }
  }
}
