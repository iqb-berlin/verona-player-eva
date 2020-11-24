import {Directive, Input} from '@angular/core';
import {ElementData} from '../classes/element.data';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ElementComponent {
  @Input() elementData: ElementData;
}
