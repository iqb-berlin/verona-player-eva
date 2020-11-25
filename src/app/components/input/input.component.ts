import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElementComponent} from '../element.component';
import {FieldType, PropertyKey} from '../../classes/interfaces';
import {FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-input',
  template: `
    <div fxLayout="row">
      <p *ngIf="preText">{{preText}}</p>
      <mat-form-field *ngIf="linesNumber > 1" appearance="fill">
        <textarea matInput mat-autosize [formControl]="textInputControl" [matAutosizeMaxRows]="linesNumber" autocomplete="off"></textarea>
        <mat-error *ngIf="textInputControl.errors">
          {{textInputControl.errors | errorTransform}}
        </mat-error>
      </mat-form-field>
      <mat-form-field *ngIf="linesNumber <= 1 && elementData.fieldType === fieldType.INPUT_TEXT" appearance="fill">
        <input matInput [formControl]="textInputControl" autocomplete="off"/>
        <mat-error *ngIf="textInputControl.errors">
          {{textInputControl.errors | errorTransform}}
        </mat-error>
      </mat-form-field>
      <mat-form-field *ngIf="linesNumber <= 1 && elementData.fieldType === fieldType.INPUT_NUMBER" appearance="fill">
        <input matInput [formControl]="numberInputControl" autocomplete="off"/>
        <mat-error *ngIf="numberInputControl.errors">
          {{numberInputControl.errors | errorTransform}}
        </mat-error>
      </mat-form-field>
      <p *ngIf="postText">{{postText}}</p>
    </div>
  `
})

export class InputComponent extends ElementComponent implements OnInit, OnDestroy {
  preText = '';
  postText = '';
  linesNumber = 1;
  fieldType = FieldType;
  numberInputControl = new FormControl();
  textInputControl = new FormControl();
  valueChangeSubscription: Subscription = null;

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
      const myValidators = [];
      const maxLengthStr = this.elementData.getPropertyValue(PropertyKey.MAX_LENGTH);
      if (maxLengthStr) {
        const maxLengthNumberTry = Number(maxLengthStr);
        if (!isNaN(maxLengthNumberTry)) {
          myValidators.push(Validators.maxLength(maxLengthNumberTry));
        }
      }
      if (this.elementData.required) {
        myValidators.push(Validators.required);
      }
      if (myValidators.length > 0) {
        this.textInputControl.setValidators(myValidators);
      }
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
      const maxValueStr = this.elementData.getPropertyValue(PropertyKey.MAX_VALUE);
      if (maxValueStr) {
        const maxValueNumberTry = Number(maxValueStr);
        if (!isNaN(maxValueNumberTry)) {
          myValidators.push(Validators.max(maxValueNumberTry));
        }
      }
      const minValueStr = this.elementData.getPropertyValue(PropertyKey.MIN_VALUE);
      if (minValueStr) {
        const minValueNumberTry = Number(minValueStr);
        if (!isNaN(minValueNumberTry)) {
          myValidators.push(Validators.min(minValueNumberTry));
        }
      }
      if (this.elementData.required) {
        myValidators.push(Validators.required);
      }
      this.numberInputControl.setValidators(myValidators);
      this.valueChangeSubscription = this.numberInputControl.valueChanges.subscribe(() => {
        if (this.numberInputControl.valid) {
          this.value = this.numberInputControl.value;
        } else {
          this.value = '';
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.valueChangeSubscription !== null) {
      this.valueChangeSubscription.unsubscribe();
    }
  }
}