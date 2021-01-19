import { Injectable } from '@angular/core';
import { IfThenElseBlock, RepeatBlock, UIBlock } from './classes/UIBlock';
import { FieldType, PropertyKey } from './classes/interfaces';
import { UIElement } from './classes/UIElement';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  rootBlock = new UIBlock();

  setElements(scriptLines: string[], oldResponses: Record<string, string>): void {
    const errorMessage = DataService.checkScriptHeader(scriptLines[0]);
    if (errorMessage !== '') {
      this.rootBlock = new UIBlock();
      const errorElement = new UIElement('SCRIPT_ERROR', FieldType.SCRIPT_ERROR);
      errorElement.properties.set(PropertyKey.TEXT, errorMessage);
      this.rootBlock.elements.push(errorElement);
    } else {
      scriptLines.splice(0, 1);
      this.rootBlock = DataService.parseScript(scriptLines, oldResponses, '', 0);
      this.rootBlock.check(oldResponses);
    }
  }

  private static checkScriptHeader(headerLine: string): string {
    const scriptKeyword = DataService.getKeyword(headerLine);
    if (scriptKeyword === '') {
      return 'Scriptfehler: Kein Keyword gefunden!';
    }
    const versionString = DataService.getParameter(headerLine, 1);
    if (!versionString) {
      return 'Scriptfehler: Kein Version-Parameter gefunden!';
    }
    const versionNumbers = versionString.match(/\d+/g);
    if (!versionNumbers || versionNumbers.length < 2) {
      return 'Scriptfehler: Version-Parameter Fehlerhaft!';
    }
    return DataService.checkVersion(Number(versionNumbers[0]), Number(versionNumbers[1]));
  }

  private static checkVersion(majorVersion: number, minorVersion: number): string {
    const supportedMajorVersions = environment.supportedScriptMajorVersions;
    if (!supportedMajorVersions.includes(majorVersion)) {
      return `Scriptfehler: Scriptversion nicht unterstützt (erste Zeile)!\
Unterstützte Versionen: ${supportedMajorVersions}`;
    }
    return '';
  }

  /**
   * Return first word of the line or empty string.
   * @param line to check
   */
  private static getKeyword(line: string): string {
    const keywordList = line.match(/[a-z-]+/);
    return keywordList ? keywordList[0] : '';
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
    }
    return null;
  }

  private static readUIElement(keyword: string, line: string,
                               idSuffix: string, lineNumber: number): UIElement {
    let uiElement: UIElement;
    const parameter1 = this.getParameter(line, 1);
    const parameter2 = this.getParameter(line, 2);
    const helpText = this.getHelpText(line);
    switch (keyword) {
      case 'header':
        uiElement = new UIElement(`id${idSuffix}`, FieldType.HEADER);
        if (parameter1) {
          uiElement.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          uiElement.helpText = helpText;
        }
        break;
      case 'text':
        uiElement = new UIElement(`id${idSuffix}`, FieldType.TEXT);
        if (parameter1) {
          uiElement.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          uiElement.helpText = helpText;
        }
        break;
      case 'title':
        uiElement = new UIElement(`id${idSuffix}`, FieldType.TITLE);
        if (parameter1) {
          uiElement.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          uiElement.helpText = helpText;
        }
        break;
      case 'html':
        uiElement = new UIElement(`id${idSuffix}`, FieldType.HTML);
        if (parameter1) {
          uiElement.properties.set(PropertyKey.TEXT, parameter1);
        }
        if (helpText) {
          uiElement.helpText = helpText;
        }
        break;
      case 'input-text':
      case 'input-number':
      case 'checkbox':
      case 'multiple-choice':
      case 'drop-down':
        if (parameter1) {
          if (keyword === 'input-text') {
            uiElement = new UIElement(parameter1, FieldType.INPUT_TEXT);
          } else if (keyword === 'input-number') {
            uiElement = new UIElement(parameter1, FieldType.INPUT_NUMBER);
          } else if (keyword === 'checkbox') {
            uiElement = new UIElement(parameter1, FieldType.CHECKBOX);
          } else if (keyword === 'multiple-choice') {
            uiElement = new UIElement(parameter1, FieldType.MULTIPLE_CHOICE);
          } else if (keyword === 'drop-down') {
            uiElement = new UIElement(parameter1, FieldType.DROP_DOWN);
          }
          if (parameter2) {
            (uiElement as UIElement).required = parameter2 === '1';
          }
          const parameter3 = this.getParameter(line, 3);
          if (parameter3) {
            (uiElement as UIElement).properties.set(PropertyKey.TEXT, parameter3);
          }
          const parameter4 = this.getParameter(line, 4);
          if (parameter4) {
            (uiElement as UIElement).properties.set(PropertyKey.TEXT2, parameter4);
          }
          if (keyword === 'input-number' || keyword === 'input-text') {
            const parameter5 = this.getParameter(line, 5);
            if (parameter5) {
              if (keyword === 'input-text') {
                (uiElement as UIElement).properties.set(PropertyKey.LINES_NUMBER, parameter5);
              } else {
                (uiElement as UIElement).properties.set(PropertyKey.MIN_VALUE, parameter5);
              }
            }
            const parameter6 = this.getParameter(line, 6);
            if (parameter6) {
              if (keyword === 'input-text') {
                (uiElement as UIElement).properties.set(PropertyKey.MAX_LENGTH, parameter6);
              } else {
                (uiElement as UIElement).properties.set(PropertyKey.MAX_VALUE, parameter6);
              }
            }
          }
          if (helpText) {
            (uiElement as UIElement).helpText = helpText;
          }
        } else {
          uiElement = new UIElement(`id${idSuffix}`, FieldType.SCRIPT_ERROR);
          uiElement.properties.set(PropertyKey.TEXT,
            `Scriptfehler Zeile ${lineNumber.toString()}: Variablenname fehlt`);
        }
        break;
      case 'hr':
        uiElement = new UIElement(`id${idSuffix}`, FieldType.HR);
        break;
      default:
        uiElement = new UIElement(`id${idSuffix}`, FieldType.SCRIPT_ERROR);
        uiElement.properties.set(PropertyKey.TEXT,
          `Scriptfehler Zeile ${lineNumber.toString()}: ungültiges Schlüsselwort ${keyword}`);
    }
    return uiElement;
  }

  private static parseScript(scriptLines: string[], oldResponses: Record<string, string>,
                             idSuffix: string, lineNumberOffset: number): UIBlock {
    const elementKeys = ['text', 'header', 'title', 'hr', 'html',
      'input-text', 'input-number', 'checkbox', 'multiple-choice', 'drop-down'];
    const newUIBlock = new UIBlock();
    let localLineNumber = 0;
    let localIdCounter = 1;
    while (localLineNumber < scriptLines.length) {
      let line = scriptLines[localLineNumber];
      localLineNumber += 1;
      line = line.trim();
      if (line) {
        const keyword = this.getKeyword(line);
        if (keyword) {
          if (elementKeys.includes(keyword)) {
            this.addUIElement(newUIBlock, `${idSuffix}_${localIdCounter.toString()}`, keyword,
              line, lineNumberOffset + localLineNumber + 1, oldResponses);
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
              const subKeyword = this.getKeyword(subLine);
              if (subKeyword === 'repeat-end') {
                break;
              } else {
                blockLines.push(subLine);
              }
            }
            if (blockLines.length > 0) {
              const tmpBlock = this.parseScript(blockLines, {},
                `${idSuffix}_${localIdCounter.toString()}`,
                localLineNumber + lineNumberOffset);
              localIdCounter += 1;
              b.templateElements = tmpBlock.elements;
              if (oldResponses[b.id]) {
                const valueNumberTry = Number(oldResponses[b.id]);
                if (!Number.isNaN(valueNumberTry)) {
                  b.value = oldResponses[b.id];
                  b.setSubBlockNumber(valueNumberTry, oldResponses);
                }
              }
              newUIBlock.elements.push(b);
            }
          } else if (keyword === 'if-start') {
            const ifThenElseBlock = new IfThenElseBlock(`${idSuffix}_${localIdCounter.toString()}`,
              this.getParameter(line, 1),
              this.getParameter(line, 2));
            localIdCounter += 1;
            let nesting = 0;
            let isElseBlock = false;
            const trueBlockLines: string[] = [];
            const falseBlockLines: string[] = [];
            while (localLineNumber < scriptLines.length) {
              const subLine = scriptLines[localLineNumber];
              localLineNumber += 1;
              const subKeyword = this.getKeyword(subLine);
              if (subKeyword === 'if-start') {
                nesting += 1;
                if (isElseBlock) {
                  falseBlockLines.push(subLine);
                } else {
                  trueBlockLines.push(subLine);
                }
              } else if (subKeyword === 'if-else') {
                if (nesting === 0) {
                  isElseBlock = true;
                } else if (isElseBlock) {
                  falseBlockLines.push(subLine);
                } else {
                  trueBlockLines.push(subLine);
                }
              } else if (subKeyword === 'if-end') {
                if (nesting === 0) {
                  break;
                } else {
                  nesting -= 1;
                  if (isElseBlock) {
                    falseBlockLines.push(subLine);
                  } else {
                    trueBlockLines.push(subLine);
                  }
                }
              } else if (isElseBlock) {
                falseBlockLines.push(subLine);
              } else {
                trueBlockLines.push(subLine);
              }
            }
            if (trueBlockLines.length > 0) {
              let tmpBlock = this.parseScript(trueBlockLines, {},
                `${idSuffix}_${localIdCounter.toString()}`, localLineNumber + lineNumberOffset);
              localIdCounter += 1;
              ifThenElseBlock.trueElements = tmpBlock.elements;
              if (falseBlockLines.length > 0) {
                tmpBlock = this.parseScript(falseBlockLines, {},
                  `${idSuffix}_${localIdCounter.toString()}`, localLineNumber + lineNumberOffset);
                localIdCounter += 1;
                ifThenElseBlock.falseElements = tmpBlock.elements;
              }
              // todo oldResponses
              newUIBlock.elements.push(ifThenElseBlock);
            }
          } else {
            this.addErrorElement(newUIBlock, `${idSuffix}_${localIdCounter.toString()}`,
              (lineNumberOffset + localLineNumber).toString());
            localIdCounter += 1;
          }
        } else {
          this.addErrorElement(newUIBlock, `${idSuffix}_${localIdCounter.toString()}`,
            (lineNumberOffset + localLineNumber).toString());
          localIdCounter += 1;
        }
      } else {
        this.addEmptyLineElement(newUIBlock, `${idSuffix}_${localIdCounter.toString()}`);
        localIdCounter += 1;
      }
    }
    return newUIBlock;
  }

  private static addUIElement(newUIBlock, id, keyword, line, lineNumber, oldResponses) {
    const newElement = this.readUIElement(keyword, line, id, lineNumber);
    if (oldResponses[newElement.id]) {
      newElement.value = oldResponses[newElement.id];
    }
    newUIBlock.elements.push(newElement);
  }

  private static addErrorElement(newUIBlock, id, lineNumber) {
    const errorElement = new UIElement(id, FieldType.SCRIPT_ERROR);
    errorElement.properties.set(PropertyKey.TEXT, `Scriptfehler Zeile ${lineNumber}: Schlüssel nicht erkannt`);
    newUIBlock.elements.push(errorElement);
  }

  private static addEmptyLineElement(newUIBlock, id) {
    newUIBlock.elements.push(new UIElement(id, FieldType.TEXT));
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
        Object.keys(subBlockValues).forEach(key => {
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
