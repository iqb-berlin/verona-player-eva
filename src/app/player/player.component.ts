import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StartData } from './classes/interfaces';
import { ParserV1 } from './classes/ParserV1';
import { RepeatBlock, UIBlock } from './classes/UIBlock';
import { UIElement } from './classes/UIElement';

@Component({
  selector: 'player-form',
  template: `
    <form  [formGroup]="form">
      <div *ngFor="let e of rootBlock.elements">
        <player-sub-form [elementData]="e" (elementDataChange)="formValueChanged()" [parentForm]="form"></player-sub-form>
      </div>
    </form>
  `
})
export class PlayerComponent {
  @Output() valueChanged = new EventEmitter<string>();
  // @Output() ready = new EventEmitter();
  form = new FormGroup({});
  rootBlock = new UIBlock();

  private getBlockValues(b: UIBlock): Record<string, string> {
    const myReturn = {};
    b.elements.forEach((elementOrBlock: UIBlock | UIElement) => {
      if (elementOrBlock instanceof UIElement) {
        if (elementOrBlock.value) {
          myReturn[elementOrBlock.id] = elementOrBlock.value;
        }
      } else if (elementOrBlock instanceof UIBlock) {
        if (elementOrBlock instanceof RepeatBlock && elementOrBlock.value) {
          myReturn[elementOrBlock.id] = elementOrBlock.value;
        }
        const subBlockValues = this.getBlockValues(elementOrBlock);
        Object.keys(subBlockValues).forEach((key) => {
          myReturn[key] = subBlockValues[key];
        });
      }
    });
    return myReturn;
  }

  public setStartData(startData: StartData): void {
    if (startData.unitDefinition) {
      let storedResponses = {};
      if (startData.unitState && startData.unitState.dataParts) {
        console.log('unitState.dataParts', startData.unitState.dataParts);
        const storedResponsesRaw = startData.unitState.dataParts;
        if (storedResponsesRaw && storedResponsesRaw.allResponses) {
          storedResponses = JSON.parse(storedResponsesRaw.allResponses);
        }
      }
      this.rootBlock = ParserV1.parseScript(startData.unitDefinition.split('\n'), storedResponses);
    } else {
      console.error('player: (setStartData) no unitDefinition is given');
    }
  }

  public tryLeaveNotify(): void {
    this.form.markAllAsTouched();
  }

  formValueChanged(): void {
    const allValues = this.getBlockValues(this.rootBlock);
    this.valueChanged.emit(JSON.stringify(allValues));
  }
}
