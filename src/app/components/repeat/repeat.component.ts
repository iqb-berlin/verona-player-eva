import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElementComponent} from '../element.component';
import {PropertyKey} from '../../classes/interfaces';
import {FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {RepeatBlock} from '../../classes/UIBlock';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-repeat',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxFill>
      <div fxFlex="50" *ngIf="prompt">
        <p>{{prompt}}</p>
      </div>
      <div fxFlex="50">
        <mat-form-field>
          <input type="number" matInput [formControl]="numberInputControl" autocomplete="off"/>
          <mat-error *ngIf="numberInputControl.errors">
            {{numberInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
      </div>
    </div>
    <mat-accordion fxLayout="column" multi="false" *ngIf="elementDataAsRepeatBlock.elements.length > 0">
      <mat-expansion-panel *ngFor="let elementList of elementDataAsRepeatBlock.elements; let i = index;">
        <mat-expansion-panel-header fxLayout="row" fxLayoutAlign="space-between center">
          <mat-panel-title>
            {{ subTitle }} {{i + 1}}
          </mat-panel-title>
        </mat-expansion-panel-header>
        <ng-template matExpansionPanelContent>
          <div *ngFor="let e of elementList.elements">
            <app-sub-form [elementData]="e" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></app-sub-form>
          </div>
        </ng-template>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: ['mat-panel-title {font-size: larger}']
})

export class RepeatComponent extends ElementComponent implements OnInit, OnDestroy {
  prompt = '';
  subTitle = '';
  numberInputControl = new FormControl();
  valueChangeSubscription: Subscription = null;

  ngOnInit(): void {
    if (this.elementData instanceof RepeatBlock) {
      this.prompt = this.elementData.properties.get(PropertyKey.TEXT);
      this.subTitle = this.elementData.properties.get(PropertyKey.TEXT2);
      const myValidators = [];
      myValidators.push(Validators.min(1));
      const maxValueStr = this.elementData.properties.get(PropertyKey.MAX_VALUE);
      if (maxValueStr) {
        const maxValueNumberTry = Number(maxValueStr);
        if (!isNaN(maxValueNumberTry)) {
          myValidators.push(Validators.max(maxValueNumberTry));
        }
      }
      this.numberInputControl.setValidators(myValidators);
      this.parentForm.addControl(this.elementData.id, this.numberInputControl);
      this.valueChangeSubscription = this.numberInputControl.valueChanges.pipe(
        debounceTime(500)).subscribe(() => {
        if (this.numberInputControl.valid) {
          this.value = this.numberInputControl.value;
        } else {
          this.value = '0';
        }
        const valueNumberTry = Number(this.value);
        if (!isNaN(valueNumberTry)) {
          (this.elementData as RepeatBlock).subBlockNumber = valueNumberTry;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.valueChangeSubscription !== null) {
      this.valueChangeSubscription.unsubscribe();
      this.parentForm.removeControl(this.elementData.id);
    }
  }
}
