import { Injectable } from '@angular/core';
import { FieldType, PropertyKey } from './classes/interfaces';
import { UIElement } from './classes/UIElement';
import { RepeatBlock, UIBlock } from './classes/UIBlock';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  rootBlock = new UIBlock();

  private static getParameter(line: string, pos: number): string {
    const lineSplits = line.split('??');
    const lineSplits2 = lineSplits[0].split('::');
    return lineSplits2[pos];
  }

  private static getHelpText(line: string): string {
    const lineSplits = line.split('??');
    if (lineSplits.length > 1) {
      return lineSplits[1];
    }
    return null;
  }

  private static readUIElement(keyword: string, line: string,
                               idSuffix: string, lineNumber: number,
                               scriptVersionMajor: number, scriptVersionMinor: number): UIElement {
    let ed: UIElement;
    const parameter1 = this.getParameter(line, 1);
    const parameter2 = this.getParameter(line, 2);
    const helpText = this.getHelpText(line);
    switch (keyword) {
      case 'header':
        ed = new UIElement(`id${idSuffix}`, FieldType.HEADER);
        if (parameter1) {
          ed.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          ed.helpText = helpText;
        }
        break;
      case 'text':
        ed = new UIElement(`id${idSuffix}`, FieldType.TEXT);
        if (parameter1) {
          ed.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          ed.helpText = helpText;
        }
        break;
      case 'title':
        ed = new UIElement(`id${idSuffix}`, FieldType.TITLE);
        if (parameter1) {
          ed.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          ed.helpText = helpText;
        }
        break;
      case 'html':
        ed = new UIElement(`id${idSuffix}`, FieldType.HTML);
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
          } else if (keyword === 'drop-down') {
            ed = new UIElement(parameter1, FieldType.DROP_DOWN);
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
          ed = new UIElement(`id${idSuffix}`, FieldType.SCRIPT_ERROR);
          ed.properties.set(PropertyKey.TEXT, `Scriptfehler Zeile ${lineNumber.toString()}: Variablenname fehlt`);
        }
        break;
      case 'hr':
        ed = new UIElement(`id${idSuffix}`, FieldType.HR);
        break;
      default:
        ed = new UIElement(`id${idSuffix}`, FieldType.SCRIPT_ERROR);
        ed.properties.set(PropertyKey.TEXT, `Scriptfehler Zeile ${lineNumber.toString()}: ungültiges Schlüsselwort ${keyword}`);
    }
    return ed;
  }

  static parseScript(scriptLines: string[], oldResponses: Record<string, string>, idSuffix = '', lineNumberOffset = 0): UIBlock {
    const elementKeys = ['text', 'header', 'title', 'hr', 'html', 'input-text', 'input-number', 'checkbox', 'multiple-choice', 'drop-down'];
    const myReturn = new UIBlock();
    let scriptVersionMajor = 0;
    let scriptVersionMinor = 0;
    if (scriptLines.length > 1) {
      const scriptKeywordList = scriptLines[0].match(/[a-z-]+/);
      if (scriptKeywordList && scriptKeywordList.length > 0) {
        const scriptKeyword = scriptKeywordList[0];
        if (scriptKeyword.toLowerCase() !== 'iqb-scripted') {
          const versionString = this.getParameter(scriptLines[0], 1);
          if (versionString) {
            const versionNumbers = versionString.match(/\d+/);
            let versionNumberTry = Number(versionNumbers[1]);
            if (!Number.isNaN(versionNumberTry)) {
              scriptVersionMinor = versionNumberTry;
              versionNumberTry = Number(versionNumbers[0]);
              if (!Number.isNaN(versionNumberTry)) {
                scriptVersionMajor = versionNumberTry;
              }
            }
          }
        }
      }
    }
    if (scriptVersionMajor === 0) {
      const ed = new UIElement('SCRIPT_ERROR', FieldType.SCRIPT_ERROR);
      ed.properties.set(PropertyKey.TEXT, 'Scriptfehler: Scripttyp oder -version nicht erkannt (erste Zeile)');
      myReturn.elements.push(ed);
    } else {
      let localLineNumber = 0;
      let localIdCounter = 1;
      while (localLineNumber < scriptLines.length) {
        let line = scriptLines[localLineNumber];
        localLineNumber += 1;
        if (line) {
          const notEmptyCheck = /\S+/g.exec(line);
          if (!notEmptyCheck) {
            line = '';
          }
        }
        if (line) {
          const keywordList = line.match(/[a-z-]+/);
          if (keywordList && keywordList.length > 0) {
            const keyword = keywordList[0];
            if (elementKeys.includes(keyword)) {
              const newElement = this.readUIElement(
                keyword, line, `${idSuffix}_${localIdCounter.toString()}`, lineNumberOffset + localLineNumber + 1,
                scriptVersionMajor, scriptVersionMinor
              );
              if (oldResponses[newElement.id]) {
                newElement.value = oldResponses[newElement.id];
              }
              myReturn.elements.push(newElement);
              localIdCounter += 1;
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
                const tmpBlock = this.parseScript(blockLines, {},
                  `${idSuffix}_${localIdCounter.toString()}`, localLineNumber + lineNumberOffset);
                localIdCounter += 1;
                b.templateElements = tmpBlock.elements;
                if (oldResponses[b.id]) {
                  const valueNumberTry = Number(oldResponses[b.id]);
                  if (!Number.isNaN(valueNumberTry)) {
                    b.value = oldResponses[b.id];
                    b.setSubBlockNumber(valueNumberTry, oldResponses);
                  }
                }
                myReturn.elements.push(b);
              }
            } else {
              const ed = new UIElement(`${idSuffix}_${localIdCounter.toString()}`, FieldType.SCRIPT_ERROR);
              localIdCounter += 1;
              ed.properties.set(PropertyKey.TEXT, `Scriptfehler Zeile ${(lineNumberOffset + localLineNumber).toString()}: Schlüssel nicht erkannt`);
              myReturn.elements.push(ed);
            }
          } else {
            const ed = new UIElement(`${idSuffix}_${localIdCounter.toString()}`, FieldType.SCRIPT_ERROR);
            localIdCounter += 1;
            ed.properties.set(PropertyKey.TEXT, `Scriptfehler Zeile ${(lineNumberOffset + localLineNumber).toString()}: Schlüssel nicht erkannt`);
            myReturn.elements.push(ed);
          }
        } else { // empty line in form
          myReturn.elements.push(new UIElement(`${idSuffix}_${localIdCounter.toString()}`, FieldType.TEXT));
          localIdCounter += 1;
        }
      }
    }
    return myReturn;
  }

  static getPlayerMetadata(): Map<string, string> {
    const myReturn: Map<string, string> = new Map();
    const metaAttributes = document.querySelector('meta[name="application-name"]').attributes;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < metaAttributes.length; i++) {
      if (metaAttributes[i].localName === 'content') {
        myReturn.set('name', metaAttributes[i].value);
      } else if (metaAttributes[i].localName.substr(0, 5) === 'data-') {
        myReturn.set(metaAttributes[i].localName.substr(5), metaAttributes[i].value);
      }
    }
    return myReturn;
  }

  private static getBlockValues(b: UIBlock): Record<string, string> {
    const myReturn = {};
    b.elements.forEach((elementOrBlock: UIBlock | UIElement) => {
      if (elementOrBlock instanceof UIElement) {
        if (elementOrBlock.value) {
          myReturn[elementOrBlock.id] = elementOrBlock.value;
        }
      } else if (elementOrBlock instanceof UIBlock) {
        if (elementOrBlock instanceof RepeatBlock && elementOrBlock.value) {
          myReturn[elementOrBlock.id] = elementOrBlock.value;
        }
        const subBlockValues = this.getBlockValues(elementOrBlock);
        Object.keys(subBlockValues).forEach((key) => {
          myReturn[key] = subBlockValues[key];
        });
      }
    });
    return myReturn;
  }

  getValues(): Record<string, string> {
    return DataService.getBlockValues(this.rootBlock);
  }
}
