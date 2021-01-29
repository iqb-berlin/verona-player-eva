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
  // required = false;
  value = '';
  properties: Map<PropertyKey, string> = new Map();
  helpText = '';

  constructor(id: string, fieldType: FieldType, helpText: string = '') {
    this.id = id; // TODO weg
    this.fieldType = fieldType;
    this.helpText = helpText;
  }

  getCopy(idSuffix = ''): UIElement {
    const myReturn = new UIElement(this.id + idSuffix, this.fieldType, this.helpText);
    // myReturn.required = this.required;
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

export class InputElement extends UIElement {
  required = false;
  constructor(id: string, fieldType, required, helpText) {
    super(id, fieldType, helpText);
    this.required = required;
  }

  getCopy(idSuffix = ''): InputElement {
    const copyElement = super.getCopy(idSuffix) as InputElement;
    copyElement.required = this.required;
    return copyElement;
  }
}

export class TextElement extends UIElement {
  constructor(id: string, fieldType = FieldType.TEXT, text: string, helpText: string) {
    super(id, fieldType, helpText);
    this.properties.set(PropertyKey.TEXT, text);
  }
}

export class TextInputElement extends InputElement {
  constructor(id: string, variableParam, required, textBefore: string, textAfter: string,
              maxLines, maxLength, helpText: string) {
    super(id, FieldType.INPUT_TEXT, required, helpText);
    this.properties.set(PropertyKey.TEXT, textBefore);
    this.properties.set(PropertyKey.TEXT2, textAfter);
    this.properties.set(PropertyKey.LINES_NUMBER, maxLines);
    this.properties.set(PropertyKey.MAX_LENGTH, maxLength);
  }
}

export class NumberInputElement extends InputElement {
  constructor(id: string, variableParam, required, textBefore: string, textAfter: string,
              minValue, maxValue, helpText: string) {
    super(id, FieldType.INPUT_NUMBER, required, helpText);
    this.properties.set(PropertyKey.TEXT, textBefore);
    this.properties.set(PropertyKey.TEXT2, textAfter);
    this.properties.set(PropertyKey.MIN_VALUE, minValue);
    this.properties.set(PropertyKey.MAX_VALUE, maxValue);
  }
}

export class CheckboxElement extends InputElement {
  constructor(id: string, variableParam, required, textBefore: string, textAfter: string,
              helpText: string) {
    super(id, FieldType.CHECKBOX, required, helpText);
    this.properties.set(PropertyKey.TEXT, textBefore);
    this.properties.set(PropertyKey.TEXT2, textAfter);
  }
}

export class MultiChoiceElement extends InputElement {
  constructor(id: string, variableParam, required, textBefore: string, textAfter: string,
              helpText: string) {
    super(id, FieldType.MULTIPLE_CHOICE, required, helpText);
    this.properties.set(PropertyKey.TEXT, textBefore);
    this.properties.set(PropertyKey.TEXT2, textAfter);
  }
}

export class ErrorElement extends UIElement {
  constructor(id: string, errorText: string) {
    super(id, FieldType.SCRIPT_ERROR);
    this.properties.set(PropertyKey.TEXT, errorText);
  }
}
