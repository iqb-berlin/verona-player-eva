import {
  Component, EventEmitter, Input, Output, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StartData } from './classes/interfaces';
import { DataService } from './data.service';

@Component({
  template: `
    <p>player-component alive!</p>
    <form [formGroup]="form">
      <div *ngFor="let element of dataService.rootBlock.elements">
        <player-sub-form [elementData]="element" (elementDataChange)="formValueChanged()"
                         [parentForm]="form">
        </player-sub-form>
      </div>
    </form>
  `,
  encapsulation: ViewEncapsulation.None
})
export class PlayerComponent {
  @Output() valueChanged = new EventEmitter<string>();
  // @Output() ready = new EventEmitter();

  form = new FormGroup({});

  constructor(public dataService: DataService) {}

  @Input()
  set startData(startData: StartData) {
    if (startData.unitDefinition) {
      let storedResponses = {};
      if (startData.unitState && startData.unitState.dataParts) {
        const storedResponsesRaw = startData.unitState.dataParts;
        if (storedResponsesRaw && storedResponsesRaw.allResponses) {
          storedResponses = JSON.parse(storedResponsesRaw.allResponses);
        }
      }
      this.dataService.setElements(startData.unitDefinition.split('\n'), storedResponses);
    } else {
      console.warn('player: (setStartData) no unitDefinition is given');
    }
  }

  public tryLeaveNotify(): void {
    this.form.markAllAsTouched();
  }

  formValueChanged(): void {
    const allValues = this.dataService.getValues();
    this.dataService.rootBlock.check(allValues);
    this.valueChanged.emit(JSON.stringify(allValues));
  }
}
