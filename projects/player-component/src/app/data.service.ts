import { Injectable } from '@angular/core';
import { IfThenElseBlock, RepeatBlock, UIBlock } from './classes/UIBlock';
import { FieldType, PropertyKey } from './classes/interfaces';
import {
  CheckboxElement, ErrorElement,
  MultiChoiceElement,
  NumberInputElement,
  TextElement,
  TextInputElement,
  UIElement
} from './classes/UIElement';
import { environment } from '../environments/environment';

type IfStackObjectKey = 'isTrueBranch' | 'uiBlock';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  rootBlock = new UIBlock();
  private scriptLines: string[] = [];
  private _idCounter = 0;

  private ifNestingStack: Record<IfStackObjectKey, UIBlock | boolean>[] = [];
  private repeatNestingStack: RepeatBlock[] = [];
  private isLatestElementIfBlock = false;

  get idCounter(): string {
    this._idCounter += 1;
    return this._idCounter.toString();
  }

  // TODO oldResponses
  setElements(scriptLines: string[], oldResponses: Record<string, string>): void {
    const errorMessage = DataService.checkScriptHeader(scriptLines[0]);
    if (errorMessage !== '') {
      this.rootBlock = new UIBlock();
      const errorElement = new UIElement('SCRIPT_ERROR', FieldType.SCRIPT_ERROR);
      errorElement.properties.set(PropertyKey.TEXT, errorMessage);
      this.rootBlock.elements.push(errorElement);
    } else {
      scriptLines.splice(0, 1);
      this.scriptLines = scriptLines;
      // const testBlock = DataService.parseScript(scriptLines, oldResponses, '', 0);
      // console.log('testBlock', testBlock);
      // this.rootBlock = testBlock;
      // TODO basic error check: same amount of start and ends for example
      this.parseScriptLines(oldResponses);
      console.log('rootBlock', this.rootBlock);
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

  private parseScriptLines(oldResponses: Record<string, string>): void {
    this.scriptLines.forEach(line => {
      let elementToAdd: UIElement | UIBlock = null;
      if (!line) {
        elementToAdd = new UIElement('0', FieldType.TEXT);
      } else if (DataService.getKeyword(line) === 'if-start') { // createIfBlock and add to stack
        this.isLatestElementIfBlock = true;
        const ifElseBlock = DataService.createIfElseBlock(line, this.idCounter);

        this.ifNestingStack.push({
          isTrueBranch: true,
          uiBlock: ifElseBlock
        });
      } else if (DataService.getKeyword(line) === 'if-else') { // switch to true branch of last object
        this.ifNestingStack[this.ifNestingStack.length - 1].isTrueBranch = false;
      } else if (DataService.getKeyword(line) === 'if-end') { // remove last object and mark for adding
        this.isLatestElementIfBlock = false;
        elementToAdd = this.ifNestingStack.pop().uiBlock as unknown as UIBlock;
      } else if (DataService.getKeyword(line) === 'repeat-start') {
        this.isLatestElementIfBlock = false;
        // TODO Fehlerbehandlung: fehlende Params
        const repeatBlockElement = DataService.createRepeatBlock(line); // TODO id?
        // TODO help text
        if (repeatBlockElement instanceof UIElement) {
          elementToAdd = repeatBlockElement;
        } else {
          this.repeatNestingStack.push(repeatBlockElement);
        }
      } else if (DataService.getKeyword(line) === 'repeat-end') {
        elementToAdd = this.repeatNestingStack.pop();
      } else {
        elementToAdd = DataService.parseElement(line, this.idCounter);
      }

      if (elementToAdd) {
        // console.log('adding: ', elementToAdd);
        // TODO repeat in if not working
        if (this.repeatNestingStack.length > 0 && !this.isLatestElementIfBlock) {
          const lastRepeatBlock = this.repeatNestingStack[this.repeatNestingStack.length - 1];
          lastRepeatBlock.templateElements.push(elementToAdd);
        } else if (this.ifNestingStack.length > 0 && this.isLatestElementIfBlock) {
          const ifStackCompoundObject = this.ifNestingStack[this.ifNestingStack.length - 1];
          if (ifStackCompoundObject.isTrueBranch) {
            (ifStackCompoundObject.uiBlock as IfThenElseBlock).trueElements.push(elementToAdd);
          } else {
            (ifStackCompoundObject.uiBlock as IfThenElseBlock).falseElements.push(elementToAdd);
          }
        } else {
          this.rootBlock.elements.push(elementToAdd);
        }
      }
    });
  }

  private static parseElement(line: string, id): UIElement {
    const keyword = DataService.getKeyword(line);
    switch (keyword) {
      case 'text': // falls through
      case 'header': // falls through
      case 'title': // falls through
      case 'html':
        return DataService.createTextElement(line, id);
      case 'hr':
        return new UIElement('0', FieldType.HR);
      case 'rem': // TODO keine Leerzeile
        return new UIElement('0', FieldType.TEXT);
      case 'input-text':
        return DataService.createTextInputElement(line, id);
      case 'input-number':
        return DataService.createNumberInputElement(line, id);
      case 'checkbox':
        return DataService.createCheckboxElement(line, id);
      case 'multiple-choice':
        return DataService.createMultiChoiceElement(line, id);
      default:
        return DataService.createErrorElement(`Scriptfehler - Schlüsselwort nicht erkannt: "${line}"`);
    }
  }

  private static createTextElement(line, id): UIElement {
    const textParam = this.getParameter(line, 1);
    if (!textParam) {
      return DataService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const capitalizedKeyword = this.getKeyword(line).toUpperCase().replace(/[-]/g, '_');
    const fieldType = FieldType[capitalizedKeyword];
    return new TextElement(id, fieldType, textParam, this.getHelpText(line));
  }

  private static createTextInputElement(line, id): UIElement {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return DataService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    const maxLines = this.getParameter(line, 5);
    const maxLength = this.getParameter(line, 6);
    return new TextInputElement(id, variableParam, required, textBefore, textAfter, maxLines, maxLength,
      this.getHelpText(line));
  }

  private static createNumberInputElement(line, id): UIElement {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return DataService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    const minValue = this.getParameter(line, 5);
    const maxValue = this.getParameter(line, 6);
    return new NumberInputElement(id, variableParam, required, textBefore, textAfter, minValue, maxValue,
      this.getHelpText(line));
  }

  private static createCheckboxElement(line: string, id: string) {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return DataService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    return new CheckboxElement(id, variableParam, required, textBefore, textAfter, this.getHelpText(line));
  }

  private static createMultiChoiceElement(line: string, id: string) {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return DataService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    return new MultiChoiceElement(id, variableParam, required, textBefore, textAfter, this.getHelpText(line));
  }

  private static createErrorElement(errorText: string): UIElement {
    return new ErrorElement('0', errorText);
  }

  private static createIfElseBlock(line, id): UIBlock {
    // TODO check params for errors
    return new IfThenElseBlock(id.toString(),
      DataService.getParameter(line, 1),
      DataService.getParameter(line, 2));
  }

  private static createRepeatBlock(line): UIElement | RepeatBlock {
    const variableParam = DataService.getParameter(line, 1);
    if (!variableParam) {
      return DataService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const repeatBlock = new RepeatBlock(variableParam); // TODO id?

    const textBefore = DataService.getParameter(line, 2);
    if (textBefore) {
      repeatBlock.properties.set(PropertyKey.TEXT, textBefore);
    }
    const blockHeading = DataService.getParameter(line, 3);
    if (blockHeading) {
      repeatBlock.properties.set(PropertyKey.TEXT2, blockHeading);
    }
    const maxBlocks = DataService.getParameter(line, 4);
    if (maxBlocks) {
      repeatBlock.properties.set(PropertyKey.MAX_VALUE, maxBlocks);
    }
    repeatBlock.helpText = DataService.getHelpText(line);

    return repeatBlock;
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
