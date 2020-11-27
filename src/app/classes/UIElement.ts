import { FieldType, PropertyKey } from './interfaces';

export class UIElement {
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

  static copyFrom(e: UIElement, idSuffix = ''): UIElement {
    const myReturn = new UIElement(e.id + idSuffix, e.fieldType);
    myReturn.required = e.required;
    e.properties.forEach((value, key) => {
      myReturn.properties.set(key, value);
    });
    myReturn.helpText = e.helpText;
    if (idSuffix.length === 0) {
      myReturn.value = e.value;
    }
    return myReturn;
  }
}
