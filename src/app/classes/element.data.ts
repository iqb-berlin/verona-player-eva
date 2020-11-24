import {FieldType, PropertyKey} from './interfaces';

export class ElementData {
  id = '';
  alias = '';
  fieldType: FieldType;
  mandatory = false;
  hide = false;
  properties: Map<PropertyKey, string> = new Map();
  children: ElementData[] = [];

  constructor(id: string, fieldType: FieldType) {
    this.id = id;
    this.fieldType = fieldType;
  }
  getPropertyValue(key: PropertyKey): string{
    return this.properties.get(key);
  }
  setPropertyValue(key: PropertyKey, value: string) {
    console.log(value);
    this.properties.set(key, value);
  }
}

