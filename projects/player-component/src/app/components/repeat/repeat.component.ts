import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from '../element.component';
import { PropertyKey } from '../../classes/interfaces';
import { RepeatBlock } from '../../classes/UIBlock';

@Component({
  selector: 'player-repeat',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxFill>
      <div fxFlex="50" *ngIf="prompt">
        <p>{{prompt}}</p>
      </div>
      <div fxFlex="50" *ngIf="prompt" fxLayout="row" fxLayoutAlign="start center">
        <mat-form-field fxFlex="30">
          <input matInput type="number" [formControl]="numberInputControl" autocomplete="off"/>
          <mat-error *ngIf="numberInputControl.errors">
            {{numberInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <button type="button" mat-raised-button (click)="applyRepeatNumber()" matTooltip="Neue Anzahl anwenden" [disabled]="numberInputControl.invalid || value === newValue">Anwenden</button>
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
            <player-sub-form [elementData]="e" (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-sub-form>
          </div>
        </ng-template>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: ['mat-panel-title {font-size: larger}', 'button {margin: 10px}']
})

export class RepeatComponent extends ElementComponent implements OnInit, OnDestroy {
  prompt = '';
  subTitle = '';
  numberInputControl = new FormControl();
  valueChangeSubscription: Subscription = null;
  newValue = '';

  ngOnInit(): void {
    if (this.elementData instanceof RepeatBlock) {
      this.prompt = this.elementData.properties.get(PropertyKey.TEXT);
      this.subTitle = this.elementData.properties.get(PropertyKey.TEXT2);
      const myValidators = [];
      myValidators.push(Validators.min(1));
      const maxValueStr = this.elementData.properties.get(PropertyKey.MAX_VALUE);
      if (maxValueStr) {
        const maxValueNumberTry = Number(maxValueStr);
        if (!Number.isNaN(maxValueNumberTry)) {
          myValidators.push(Validators.max(maxValueNumberTry));
        }
      }
      this.numberInputControl.setValidators(myValidators);
      if (this.value) {
        this.numberInputControl.setValue(this.value);
      }
      this.parentForm.addControl(this.elementData.id, this.numberInputControl);
      this.valueChangeSubscription = this.numberInputControl.valueChanges.subscribe(() => {
        this.numberInputControl.markAsTouched();
        if (this.numberInputControl.valid) {
          this.newValue = this.numberInputControl.value;
        }
      });
    }
  }

  applyRepeatNumber(): void {
    const valueNumberTry = Number(this.newValue);
    if (!Number.isNaN(valueNumberTry)) {
      this.value = this.newValue;
      (this.elementData as RepeatBlock).setSubBlockNumber(valueNumberTry);
    }
  }

  ngOnDestroy(): void {
    if (this.valueChangeSubscription !== null) {
      this.valueChangeSubscription.unsubscribe();
      this.parentForm.removeControl(this.elementData.id);
    }
  }
}
