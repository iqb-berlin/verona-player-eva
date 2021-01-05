// eslint-disable-next-line max-classes-per-file
import { FieldType, PropertyKey } from './interfaces';

export class UIElementOrBlock {
  getCopy(): UIElementOrBlock {
    console.error(`${typeof this}: Missing overload for getCopy()!`);
    return null;
  }
}

export class UIElement implements UIElementOrBlock {
  id = '';
  fieldType: FieldType;
  required = false;
  value = '';
  properties: Map<PropertyKey, string> = new Map();
  helpText = '';

  constructor(id: string, fieldType: FieldType) {
    this.id = id;
    this.fieldType = fieldType;
  }

  getCopy(idSuffix = ''): UIElement {
    const myReturn = new UIElement(this.id + idSuffix, this.fieldType);
    myReturn.required = this.required;
    this.properties.forEach((value, key) => {
      myReturn.properties.set(key, value);
    });
    myReturn.helpText = this.helpText;
    if (idSuffix.length === 0) {
      myReturn.value = this.value;
    }
    return myReturn;
  }
}
