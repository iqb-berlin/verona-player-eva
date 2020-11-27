import {UIElement} from './UIElement';
import {FieldType, PropertyKey} from './interfaces';

export class UIBlock {
  elements: (UIElement | UIBlock)[] = [];


  static parseScript(scriptLines: string[], idCounter = 1, lineNumberOffset = 0): UIBlock {
    const elementKeys = ['text', 'header', 'title', 'hr', 'html', 'input-text', 'input-number', 'checkbox', 'multiple-choice', 'drop-down'];
    const myReturn = new UIBlock();
    let localLineNumber = 0;
    while (localLineNumber < scriptLines.length) {
      const line = scriptLines[localLineNumber];
      localLineNumber += 1;
      if (line) {
        const keywordList = line.match(/[a-z\-]+/);
        if (keywordList && keywordList.length > 0) {
          const keyword = keywordList[0];
          if (elementKeys.includes(keyword)) {
            myReturn.elements.push(UIBlock.readUIElement(keyword, line, idCounter, lineNumberOffset + localLineNumber + 1));
            idCounter += 1;
          } else if (keyword === 'repeat-start') {
            const parameter1 = this.getParameter(line, 1);
            const b = new RepeatBlock(parameter1);
            b.properties.set(PropertyKey.TEXT, this.getParameter(line, 2));
            b.properties.set(PropertyKey.TEXT2, this.getParameter(line, 3));
            b.helpText = this.getHelpText(line);
            const parameter4 = this.getParameter(line, 4);
            if (parameter4) {
              b.properties.set(PropertyKey.MAX_VALUE, parameter4);
            }
            const blockLines: string[] = [];
            while (localLineNumber < scriptLines.length) {
              const subLine = scriptLines[localLineNumber];
              localLineNumber += 1;
              const subKeywordList = subLine.match(/^\s*repeat-end\s*$/);
              if (subKeywordList && subKeywordList.length > 0) {
                break;
              } else {
                blockLines.push(subLine);
              }
            }
            if (blockLines.length > 0) {
              const tmpBlock = this.parseScript(blockLines, idCounter, localLineNumber + lineNumberOffset);
              b.templateElements = tmpBlock.elements;
              myReturn.elements.push(b);
            }
          }
        } else {
          const ed = new UIElement('id' + idCounter.toString(), FieldType.SCRIPT_ERROR);
          idCounter += 1;
          ed.properties.set(PropertyKey.TEXT, 'Scriptfehler Zeile ' + (lineNumberOffset + localLineNumber + 1).toString() + ': Schlüssel nicht erkannt');
          myReturn.elements.push(ed);
        }
      } else { // empty line in form
        myReturn.elements.push(new UIElement('id' + idCounter.toString(), FieldType.TEXT));
        idCounter += 1;
      }
    }
    return myReturn;
  }

  static copyFrom(eb: UIElement | UIBlock): UIElement | UIBlock {
    if (eb instanceof UIElement) {
      return UIElement.copyFrom(eb);
    } else {
      const myReturn = new UIBlock();
      eb.elements.forEach(e => {
        if (e instanceof UIElement) {
          myReturn.elements.push(UIElement.copyFrom(e));
        } else {
          // todo nested blocks when copying from template (idSuffix, RepeatBlock etc.)
          myReturn.elements.push(UIBlock.copyFrom(e));
        }
      });
      return myReturn;
    }
  }

  private static readUIElement(keyword: string, line: string, idCounter: number, lineNumber: number): UIElement {
    let ed: UIElement;
    const parameter1 = this.getParameter(line, 1);
    const parameter2 = this.getParameter(line, 2);
    const helpText = this.getHelpText(line);
    switch (keyword) {
      case 'header':
        ed = new UIElement('id' + idCounter.toString(), FieldType.HEADER);
        if (parameter1) {
          ed.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          ed.helpText = helpText;
        }
        break;
      case 'text':
        ed = new UIElement('id' + idCounter.toString(), FieldType.TEXT);
        if (parameter1) {
          ed.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          ed.helpText = helpText;
        }
        break;
      case 'title':
        ed = new UIElement('id' + idCounter.toString(), FieldType.TITLE);
        if (parameter1) {
          ed.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          ed.helpText = helpText;
        }
        break;
      case 'html':
        ed = new UIElement('id' + idCounter.toString(), FieldType.HTML);
        if (parameter1) {
          ed.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          ed.helpText = helpText;
        }
        break;
      case 'input-text':
      case 'input-number':
      case 'checkbox':
      case 'multiple-choice':
      case 'drop-down':
        if (parameter1) {
          if (keyword === 'input-text') {
            ed = new UIElement(parameter1, FieldType.INPUT_TEXT);
          } else if (keyword === 'input-number') {
            ed = new UIElement(parameter1, FieldType.INPUT_NUMBER);
          } else if (keyword === 'checkbox') {
            ed = new UIElement(parameter1, FieldType.CHECKBOX);
          } else if (keyword === 'multiple-choice') {
            ed = new UIElement(parameter1, FieldType.MULTIPLE_CHOICE);
            ed.value = '2';
          } else if (keyword === 'drop-down') {
            ed = new UIElement(parameter1, FieldType.DROP_DOWN);
            ed.value = '1';
          }
          if (parameter2) {
            (ed as UIElement).required = parameter2 === '1';
          }
          const parameter3 = this.getParameter(line, 3);
          if (parameter3) {
            (ed as UIElement).properties.set(PropertyKey.TEXT, parameter3);
          }
          const parameter4 = this.getParameter(line, 4);
          if (parameter4) {
            (ed as UIElement).properties.set(PropertyKey.TEXT2, parameter4);
          }
          if (keyword === 'input-number' || keyword === 'input-text') {
            const parameter5 = this.getParameter(line, 5);
            if (parameter5) {
              if (keyword === 'input-text') {
                (ed as UIElement).properties.set(PropertyKey.LINES_NUMBER, parameter5);
              } else {
                (ed as UIElement).properties.set(PropertyKey.MIN_VALUE, parameter5);
              }
            }
            const parameter6 = this.getParameter(line, 6);
            if (parameter6) {
              if (keyword === 'input-text') {
                (ed as UIElement).properties.set(PropertyKey.MAX_LENGTH, parameter6);
              } else {
                (ed as UIElement).properties.set(PropertyKey.MAX_VALUE, parameter6);
              }
            }
          }
          if (helpText) {
            (ed as UIElement).helpText = helpText;
          }
        } else {
          ed = new UIElement('id' + idCounter.toString(), FieldType.SCRIPT_ERROR);
          ed.properties.set(PropertyKey.TEXT, 'Scriptfehler Zeile ' + lineNumber.toString() + ': Variablenname fehlt');
        }
        break;
      case 'hr':
        ed = new UIElement('id' + idCounter.toString(), FieldType.HR);
        break;
    }
    return ed;
  }
  private static getParameter(line: string, pos: number): string {
    const lineSplits = line.split('??');
    const lineSplits2 = lineSplits[0].split('::');
    return lineSplits2[pos];
  }
  private static getHelpText(line: string): string {
    const lineSplits = line.split('??');
    if (lineSplits.length > 1) {
      return lineSplits[1];
    } else {
      return null;
    }
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

  set subBlockNumber(n: number) {
    const newBlocks: (UIElement | UIBlock)[] = [];
    const oldSubBlockNumber = this.elements.length;
    for (let i = 0; i < n; i++) {
      if (i < oldSubBlockNumber) {
        newBlocks.push(this.elements[i]);
      } else {
        const newBlock = new UIBlock();
        this.templateElements.forEach(e => {
          if (e instanceof UIElement) {
            newBlock.elements.push(UIElement.copyFrom(e, '_' + (i + 1).toString()));
          } else {
            newBlock.elements.push(UIBlock.copyFrom(e));
          }
        });
        newBlocks.push(newBlock);
      }
    }
    this.elements = newBlocks;
  }
}

