import { Injectable } from '@angular/core';
import { FieldType, PropertyKey } from './classes/interfaces';
import { UIElement } from './classes/UIElement';
import { RepeatBlock, UIBlock } from './classes/UIBlock';

@Injectable({
  providedIn: 'root'
})
export class DataService {
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

  static parseScript(scriptLines: string[], idSuffix = '', lineNumberOffset = 0): UIBlock {
    const elementKeys = ['text', 'header', 'title', 'hr', 'html', 'input-text', 'input-number', 'checkbox', 'multiple-choice', 'drop-down'];
    const myReturn = new UIBlock();
    let localLineNumber = 0;
    let localIdCounter = 1;
    while (localLineNumber < scriptLines.length) {
      const line = scriptLines[localLineNumber];
      localLineNumber += 1;
      if (line) {
        const keywordList = line.match(/[a-z-]+/);
        if (keywordList && keywordList.length > 0) {
          const keyword = keywordList[0];
          if (elementKeys.includes(keyword)) {
            myReturn.elements.push(this.readUIElement(
              keyword, line, `${idSuffix}_${localIdCounter.toString()}`, lineNumberOffset + localLineNumber + 1
            ));
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
              const tmpBlock = this.parseScript(blockLines, `${idSuffix}_${localIdCounter.toString()}`, localLineNumber + lineNumberOffset);
              localIdCounter += 1;
              b.templateElements = tmpBlock.elements;
              myReturn.elements.push(b);
            }
          }
        } else {
          const ed = new UIElement(`${idSuffix}_${localIdCounter.toString()}`, FieldType.SCRIPT_ERROR);
          localIdCounter += 1;
          ed.properties.set(PropertyKey.TEXT, `Scriptfehler Zeile ${(lineNumberOffset + localLineNumber + 1).toString()}: Schlüssel nicht erkannt`);
          myReturn.elements.push(ed);
        }
      } else { // empty line in form
        myReturn.elements.push(new UIElement(`${idSuffix}_${localIdCounter.toString()}`, FieldType.TEXT));
        localIdCounter += 1;
      }
    }
    return myReturn;
  }
}
