import {
  Component, EventEmitter, Input, Output, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StartData } from './classes/interfaces';
import { DataService } from './data.service';

@Component({
  template: `
    <p>player-component alive!</p>
    <form  [formGroup]="form">
      <div *ngFor="let e of ds.rootBlock.elements">
        <player-sub-form [elementData]="e" (elementDataChange)="formValueChanged()" [parentForm]="form"></player-sub-form>
      </div>
    </form>
  `,
  encapsulation: ViewEncapsulation.None
})
export class PlayerComponent {
  @Output() valueChanged = new EventEmitter<string>();
  private localStartData: StartData = {
    unitDefinition: '',
    unitState: {
      dataParts: {}
    }
  };

  get startData(): StartData {
    return this.localStartData;
  }

  @Input()
  set startData(val: StartData) {
    this.setStartData(val);
  }

  // @Output() ready = new EventEmitter();
  form = new FormGroup({});

  constructor(
    public ds: DataService
  ) {}

  private setStartData(startData: StartData): void {
    this.localStartData = startData;
    if (startData.unitDefinition) {
      let storedResponses = {};
      if (startData.unitState && startData.unitState.dataParts) {
        console.log('unitState.dataParts', startData.unitState.dataParts);
        const storedResponsesRaw = startData.unitState.dataParts;
        if (storedResponsesRaw && storedResponsesRaw.allResponses) {
          storedResponses = JSON.parse(storedResponsesRaw.allResponses);
        }
      }
      this.ds.setElements(startData.unitDefinition.split('\n'), storedResponses);
    } else {
      console.error('player: (setStartData) no unitDefinition is given');
    }
  }

  public tryLeaveNotify(): void {
    this.form.markAllAsTouched();
  }

  formValueChanged(): void {
    const allValues = this.ds.getValues();
    this.valueChanged.emit(JSON.stringify(allValues));
  }
}
