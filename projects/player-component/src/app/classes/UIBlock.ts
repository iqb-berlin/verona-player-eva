// eslint-disable-next-line max-classes-per-file
import { UIElement, UIElementOrBlock } from './UIElement';
import { PropertyKey } from './interfaces';

export class UIBlock implements UIElementOrBlock {
  id = '';
  value = '';
  elements: (UIElement | UIBlock)[] = [];

  constructor(id: string) {
    this.id = id;
  }

  getCopy(idSuffix = ''): UIBlock {
    const myReturn = new UIBlock(this.id);
    this.elements.forEach(e => {
      myReturn.elements.push(e.getCopy(idSuffix));
    });
    return myReturn;
  }

  check(values: Record<string, string>): void {
    this.elements.forEach(e => {
      if (e instanceof UIBlock) {
        e.check(values);
      }
    });
  }
}

export class RepeatBlock extends UIBlock {
  properties: Map<PropertyKey, string> = new Map();
  templateElements: (UIElement | UIBlock)[] = [];
  helpText = '';

  constructor(id: string, textBefore:string = '', textAfter:string = '', maxBlocks: string = '',
              helpText: string = '') {
    super(id);
    this.helpText = helpText;
    if (textBefore) this.properties.set(PropertyKey.TEXT, textBefore);
    if (textAfter) this.properties.set(PropertyKey.TEXT2, textAfter);
    if (maxBlocks) this.properties.set(PropertyKey.MAX_VALUE, maxBlocks);
  }

  getCopy(idSuffix = ''): RepeatBlock {
    const myReturn = new RepeatBlock(this.id + idSuffix, '', '', '', this.helpText);
    this.properties.forEach((value, key) => {
      myReturn.properties.set(key, value);
    });
    myReturn.helpText = this.helpText;
    this.templateElements.forEach(e => {
      myReturn.templateElements.push(e.getCopy());
    });
    myReturn.value = this.value;
    return myReturn;
  }

  setSubBlockNumber(n: number, oldResponses = {}): void {
    const newBlocks: (UIElement | UIBlock)[] = [];
    const oldSubBlockNumber = this.elements.length;
    for (let i = 0; i < n; i++) {
      if (i < oldSubBlockNumber) {
        newBlocks.push(this.elements[i]);
      } else {
        const newBlock = new UIBlock(this.id);
        this.templateElements.forEach(templateElement => {
          const newElement = templateElement.getCopy(`_${(i + 1).toString()}`);
          if (newElement instanceof UIElement) {
            if (oldResponses[newElement.id]) {
              newElement.value = oldResponses[newElement.id];
            }
          }
          newBlock.elements.push(newElement);
        });
        newBlocks.push(newBlock);
      }
    }
    this.elements = newBlocks;
  }
}

export class IfThenElseBlock extends UIBlock {
  conditionVariableName = '';
  conditionTrueValue = '';
  trueElements: (UIElement | UIBlock)[] = [];
  falseElements: (UIElement | UIBlock)[] = [];
  conditionVariableNameAffix: number = 0;

  constructor(id: string, conditionVariableName: string, conditionTrueValue: string) {
    super(id);
    this.conditionVariableName = conditionVariableName;
    this.conditionTrueValue = conditionTrueValue;
  }

  getCopy(idSuffix = ''): IfThenElseBlock {
    const myReturn = new IfThenElseBlock(this.id + idSuffix,
      this.conditionVariableName + idSuffix,
      this.conditionTrueValue);
    this.trueElements.forEach(e => {
      myReturn.trueElements.push(e.getCopy(idSuffix));
    });
    this.falseElements.forEach(e => {
      myReturn.falseElements.push(e.getCopy(idSuffix));
    });
    myReturn.value = this.value;
    return myReturn;
  }

  check(values: Record<string, string>): void {
    if (values[this.conditionVariableName]) {
      if (values[this.conditionVariableName] === this.conditionTrueValue) {
        this.value = 'true';
        this.trueElements.forEach(e => {
          if (e instanceof UIBlock) {
            e.check(values);
          }
        });
      } else {
        this.value = 'false';
        this.falseElements.forEach(e => {
          if (e instanceof UIBlock) {
            e.check(values);
          }
        });
      }
    } else {
      this.value = '';
      this.trueElements.forEach(e => {
        if (e instanceof UIBlock) {
          e.check({});
        }
      });
      this.falseElements.forEach(e => {
        if (e instanceof UIBlock) {
          e.check({});
        }
      });
    }
  }
}
