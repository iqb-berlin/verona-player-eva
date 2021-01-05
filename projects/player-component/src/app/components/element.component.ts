import {
  Directive, Input, EventEmitter, Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UIElement } from '../classes/UIElement';
import { IfThenElseBlock, RepeatBlock } from '../classes/UIBlock';
import { FieldType } from '../classes/interfaces';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ElementComponent {
  @Input() elementData: UIElement | RepeatBlock | IfThenElseBlock;
  @Input() parentForm: FormGroup;
  @Output() elementDataChange = new EventEmitter<UIElement | RepeatBlock | IfThenElseBlock>();
  @Output() valueChange = new EventEmitter<string>();
  fieldType = FieldType;

  set value(value: string) {
    if (this.elementData) {
      this.elementData.value = value;
      this.elementDataChange.emit(this.elementData);
      this.valueChange.emit(value);
    }
  }

  get value(): string {
    if (this.elementData) {
      return this.elementData.value;
    }
    return '';
  }

  get elementDataAsUIElement(): UIElement {
    if (this.elementIsUIElement) {
      return this.elementData as UIElement;
    }
    return null;
  }

  get elementDataAsRepeatBlock(): RepeatBlock {
    if (this.elementIsRepeatBlock) {
      return this.elementData as RepeatBlock;
    }
    return null;
  }

  get elementDataAsIfThenElseBlock(): IfThenElseBlock {
    if (this.elementData && this.elementData instanceof IfThenElseBlock) {
      return this.elementData as IfThenElseBlock;
    }
    return null;
  }

  elementIsUIElement(): boolean {
    return this.elementData && this.elementData instanceof UIElement;
  }

  elementIsRepeatBlock(): boolean {
    return this.elementData && this.elementData instanceof RepeatBlock;
  }

  elementIsIfThenElseBlockTrue(): boolean {
    return this.elementData && this.elementData instanceof IfThenElseBlock && this.elementData.value === 'true';
  }

  elementIsIfThenElseBlockFalse(): boolean {
    return this.elementData && this.elementData instanceof IfThenElseBlock && this.elementData.value === 'false';
  }
}
