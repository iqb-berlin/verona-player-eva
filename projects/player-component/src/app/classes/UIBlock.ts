// eslint-disable-next-line max-classes-per-file
import { UIElement } from './UIElement';
import { PropertyKey } from './interfaces';

export class UIBlock {
  elements: (UIElement | UIBlock)[] = [];

  static copyFrom(eb: UIElement | UIBlock): UIElement | UIBlock {
    if (eb instanceof UIElement) {
      return UIElement.copyFrom(eb);
    }
    const myReturn = new UIBlock();
    eb.elements.forEach((e) => {
      if (e instanceof UIElement) {
        myReturn.elements.push(UIElement.copyFrom(e));
      } else {
        // todo nested blocks when copying from template (idSuffix, RepeatBlock etc.)
        myReturn.elements.push(UIBlock.copyFrom(e));
      }
    });
    return myReturn;
  }

  check(values: Record<string, string>): void {
    this.elements.forEach((e) => {
      if (e instanceof UIBlock) {
        e.check(values);
      }
    });
  }
}

export class RepeatBlock extends UIBlock {
  id = '';
  properties: Map<PropertyKey, string> = new Map();
  templateElements: (UIElement | UIBlock)[];
  value = '';
  helpText = '';

  constructor(id: string) {
    super();
    this.id = id;
  }

  setSubBlockNumber(n: number, oldResponses = {}): void {
    const newBlocks: (UIElement | UIBlock)[] = [];
    const oldSubBlockNumber = this.elements.length;
    for (let i = 0; i < n; i++) {
      if (i < oldSubBlockNumber) {
        newBlocks.push(this.elements[i]);
      } else {
        const newBlock = new UIBlock();
        this.templateElements.forEach((templateElement) => {
          if (templateElement instanceof UIElement) {
            const newElement = UIElement.copyFrom(templateElement, `_${(i + 1).toString()}`);
            if (oldResponses[newElement.id]) {
              newElement.value = oldResponses[newElement.id];
            }
            newBlock.elements.push(newElement);
          } else {
            // newBlock.elements.push(UIBlock.copyFrom(templateElement));
            // todo new block with ids and old responses!
          }
        });
        newBlocks.push(newBlock);
      }
    }
    this.elements = newBlocks;
  }
}

export class IfThenElseBlock extends UIBlock {
  id = '';
  value = '';
  conditionVariableName = '';
  conditionTrueValue = '';
  trueElements: (UIElement | UIBlock)[] = [];
  falseElements: (UIElement | UIBlock)[] = [];

  constructor(id: string, conditionVariableName: string, conditionTrueValue: string) {
    super();
    this.id = id;
    this.conditionVariableName = conditionVariableName;
    this.conditionTrueValue = conditionTrueValue;
  }

  check(values: Record<string, string>): void {
    if (values[this.conditionVariableName]) {
      if (values[this.conditionVariableName] === this.conditionTrueValue) {
        this.value = 'true';
        this.trueElements.forEach((e) => {
          if (e instanceof UIBlock) {
            e.check(values);
          }
        });
      } else {
        this.value = 'false';
        this.falseElements.forEach((e) => {
          if (e instanceof UIBlock) {
            e.check(values);
          }
        });
      }
    } else {
      this.value = '';
      this.trueElements.forEach((e) => {
        if (e instanceof UIBlock) {
          e.check({});
        }
      });
      this.falseElements.forEach((e) => {
        if (e instanceof UIBlock) {
          e.check({});
        }
      });
    }
    console.log('check', this.id);
  }
}
