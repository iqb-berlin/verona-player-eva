import {Component, OnDestroy, OnInit} from '@angular/core';
import {FieldType, PropertyKey} from '../../classes/interfaces';
import {ElementComponent} from '../element.component';
import {FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-select',
  styles: [
    '.r-group {display: flex; flex-direction: column; margin: 15px 0;}',
    '.r-option {margin: 5px;}'],
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between start" fxFill>
      <div fxFlex="50" *ngIf="label">
        <p>{{label}}</p>
      </div>
      <div fxFlex="50" fxLayout="row">
          <mat-radio-group class="r-group" [formControl]="selectInputControl" fxLayout="column" *ngIf="elementData.fieldType === fieldType.MULTIPLE_CHOICE">
            <mat-radio-button class="r-option" *ngFor="let option of options; let i = index" [value]="(i + 1).toString()">
              {{option}}
            </mat-radio-button>
            <mat-error *ngIf="selectInputControl.touched && selectInputControl.errors">
              {{selectInputControl.errors | errorTransform}}
            </mat-error>
          </mat-radio-group>
        <mat-form-field appearance="fill" *ngIf="elementData.fieldType === fieldType.DROP_DOWN">
          <mat-select [formControl]="selectInputControl" placeholder="Bitte wählen">
            <mat-option *ngFor="let option of options; let i = index" [value]="(i + 1).toString()">
              {{option}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="selectInputControl.errors">
            {{selectInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
      </div>
    </div>
  `
})
export class SelectComponent extends ElementComponent implements OnInit, OnDestroy {
  label = '';
  options: string[] = [];
  fieldType = FieldType;
  selectInputControl = new FormControl();
  valueChangeSubscription: Subscription = null;

  ngOnInit(): void {
    this.label = this.elementData.getPropertyValue(PropertyKey.TEXT);
    const optionsStr = this.elementData.getPropertyValue(PropertyKey.TEXT2);
    if (optionsStr) {
      this.options = optionsStr.split('##');
    }
    if (this.elementData.required) {
      this.selectInputControl.setValidators(Validators.required);
    }
    if (this.value) {
      this.selectInputControl.setValue(this.value);
    }
    this.parentForm.addControl(this.elementData.id, this.selectInputControl);
    this.valueChangeSubscription = this.selectInputControl.valueChanges.subscribe(() => {
      if (this.selectInputControl.valid) {
        this.value = this.selectInputControl.value;
      } else {
        this.value = '';
      }
    });
  }

  ngOnDestroy() {
    if (this.valueChangeSubscription !== null) {
      this.valueChangeSubscription.unsubscribe();
    }
  }
}
