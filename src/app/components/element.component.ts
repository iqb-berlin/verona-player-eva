import { Directive, Input, EventEmitter, Output} from '@angular/core';
import {ElementData} from '../classes/element.data';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ElementComponent {
  @Input() elementData: ElementData;
  @Output() elementDataChange = new EventEmitter<ElementData>();
  @Output() valueChange = new EventEmitter<string>();

  set value(value: string) {
    if (this.elementData) {
      this.elementData.value$.next(value);
      console.log(value);
      this.elementDataChange.emit(this.elementData);
      this.valueChange.emit(value);
    }
  }
  get value(): string {
    if (this.elementData) {
      return this.elementData.value$.getValue();
    } else {
      return '';
    }
  }
}
