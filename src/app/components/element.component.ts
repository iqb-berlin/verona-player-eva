import { Directive, Input, EventEmitter, Output} from '@angular/core';
import {UIElement} from '../classes/UIElement';
import {FormGroup} from '@angular/forms';
import {RepeatBlock} from '../classes/UIBlock';
import {FieldType} from '../classes/interfaces';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ElementComponent {
  @Input() elementData: UIElement | RepeatBlock;
  @Input() parentForm: FormGroup;
  @Output() elementDataChange = new EventEmitter<UIElement | RepeatBlock>();
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
    } else {
      return '';
    }
  }

  get elementDataAsUIElement(): UIElement {
    if (this.elementIsUIElement) {
      return this.elementData as UIElement;
    } else {
      return null;
    }
  }

  get elementDataAsRepeatBlock(): RepeatBlock {
    if (this.elementIsRepeatBlock) {
      return this.elementData as RepeatBlock;
    } else {
      return null;
    }
  }

  elementIsUIElement(): boolean {
    return this.elementData && this.elementData instanceof UIElement;
  }
  elementIsRepeatBlock(): boolean {
    return this.elementData && this.elementData instanceof RepeatBlock;
  }
}
