import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from '../element.component';
import { PropertyKey } from '../../classes/interfaces';
import { InputElement } from '../../classes/UIElement';

@Component({
  selector: 'player-checkbox',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxFill>
      <div fxFlex="50" *ngIf="preText">
        <p>{{preText}}</p>
      </div>
      <div fxFlex="50">
        <mat-checkbox class="chb" [formControl]="checkboxControl">{{postText}}</mat-checkbox>
        <mat-error *ngIf="checkboxControl.errors && checkboxControl.touched">
          {{checkboxControl.errors | errorTransform: true}}
        </mat-error>
      </div>
    </div>
  `,
  styles: [
    '.chb {margin: 5px;}']
})
export class CheckboxComponent extends ElementComponent implements OnInit, OnDestroy {
  preText = '';
  postText = '';
  checkboxControl = new FormControl();
  valueChangeSubscription: Subscription = null;

  ngOnInit(): void {
    // if (this.elementData instanceof UIElement) {
    if (this.elementData instanceof InputElement) {
      this.preText = this.elementData.properties.get(PropertyKey.TEXT);
      this.postText = this.elementData.properties.get(PropertyKey.TEXT2);
      if (this.elementData.required) {
        this.checkboxControl.setValidators(Validators.requiredTrue);
      }
      if (this.value === 'true') {
        this.checkboxControl.setValue(true);
      }
      this.parentForm.addControl(this.elementData.id, this.checkboxControl);
      this.valueChangeSubscription = this.checkboxControl.valueChanges.subscribe(() => {
        if (this.checkboxControl.valid && this.checkboxControl.value === true) {
          this.value = 'true';
        } else {
          this.value = '';
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.valueChangeSubscription !== null) {
      this.valueChangeSubscription.unsubscribe();
      this.parentForm.removeControl(this.elementData.id);
    }
  }
}
