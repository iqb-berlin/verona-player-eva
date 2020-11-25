import {FieldType, PropertyKey} from './interfaces';

export class ElementData {

  constructor(id: string, fieldType: FieldType) {
    this.id = id;
    this.fieldType = fieldType;
  }
  id = '';
  alias = '';
  fieldType: FieldType;
  required = false;
  hide = false;
  value = '';
  properties: Map<PropertyKey, string> = new Map();
  children: ElementData[] = [];

  static parseScript(scriptLines: string[]): ElementData[] {
    const myReturn: ElementData[] = [];
    let idCounter = 1;
    let lineCounter = 0;
    scriptLines.forEach(line => {
      lineCounter += 1;
      if (!line) {
        myReturn.push(new ElementData('id' + idCounter.toString(), FieldType.TEXT));
      } else {
        const keywordList = line.match(/[a-z\-]+/);
        if (keywordList && keywordList.length > 0) {
          const keyword = keywordList[0];
          const parameter1 = this.getParameter(line, 1);
          const parameter2 = this.getParameter(line, 2);
          const helpText = this.getHelpText(line);
          let ed: ElementData;
          switch (keyword) {
            case 'header':
              ed = new ElementData('id' + idCounter.toString(), FieldType.HEADER);
              if (parameter1) {
                ed.setPropertyValue(PropertyKey.TEXT, parameter1);
              }
              if (helpText) {
                ed.setPropertyValue(PropertyKey.HELP_TEXT, helpText);
              }
              break;
            case 'text':
              ed = new ElementData('id' + idCounter.toString(), FieldType.TEXT);
              if (parameter1) {
                ed.setPropertyValue(PropertyKey.TEXT, parameter1);
              }
              if (helpText) {
                ed.setPropertyValue(PropertyKey.HELP_TEXT, helpText);
              }
              break;
            case 'title':
              ed = new ElementData('id' + idCounter.toString(), FieldType.TITLE);
              if (parameter1) {
                ed.setPropertyValue(PropertyKey.TEXT, parameter1);
              }
              if (helpText) {
                ed.setPropertyValue(PropertyKey.HELP_TEXT, helpText);
              }
              break;
            case 'html':
              ed = new ElementData('id' + idCounter.toString(), FieldType.HTML);
              if (parameter1) {
                ed.setPropertyValue(PropertyKey.TEXT, parameter1);
              }
              if (helpText) {
                ed.setPropertyValue(PropertyKey.HELP_TEXT, helpText);
              }
              break;
            case 'input-text':
            case 'input-number':
            case 'checkbox':
            case 'multiple-choice':
            case 'drop-down':
              if (parameter1) {
                if (keyword === 'input-text') {
                  ed = new ElementData(parameter1, FieldType.INPUT_TEXT);
                } else if (keyword === 'input-number') {
                  ed = new ElementData(parameter1, FieldType.INPUT_NUMBER);
                } else if (keyword === 'checkbox') {
                  ed = new ElementData(parameter1, FieldType.CHECKBOX);
                } else if (keyword === 'multiple-choice') {
                  ed = new ElementData(parameter1, FieldType.MULTIPLE_CHOICE);
                } else if (keyword === 'drop-down') {
                  ed = new ElementData(parameter1, FieldType.DROP_DOWN);
                }
                if (parameter2) {
                  ed.required = parameter2 === '1';
                }
                const parameter3 = this.getParameter(line, 3);
                if (parameter3) {
                  ed.setPropertyValue(PropertyKey.TEXT, parameter3);
                }
                const parameter4 = this.getParameter(line, 4);
                if (parameter4) {
                  ed.setPropertyValue(PropertyKey.TEXT2, parameter4);
                }
                if (keyword === 'input-number' || keyword === 'input-text') {
                  const parameter5 = this.getParameter(line, 5);
                  if (parameter5) {
                    if (keyword === 'input-text') {
                      ed.setPropertyValue(PropertyKey.LINES_NUMBER, parameter5);
                    } else {
                      ed.setPropertyValue(PropertyKey.MIN_VALUE, parameter5);
                    }
                  }
                  const parameter6 = this.getParameter(line, 6);
                  if (parameter6) {
                    if (keyword === 'input-text') {
                      ed.setPropertyValue(PropertyKey.MAX_LENGTH, parameter6);
                    } else {
                      ed.setPropertyValue(PropertyKey.MAX_VALUE, parameter6);
                    }
                  }
                }
                if (helpText) {
                  ed.setPropertyValue(PropertyKey.HELP_TEXT, helpText);
                }
              } else {
                ed = new ElementData('id' + idCounter.toString(), FieldType.SCRIPT_ERROR);
                ed.setPropertyValue(PropertyKey.TEXT, 'Scriptfehler Zeile ' + lineCounter.toString() + ': Variablenname fehlt');
              }
              break;
            case 'hr':
              ed = new ElementData('id' + idCounter.toString(), FieldType.HR);
              break;
            default:
              ed = new ElementData('id' + idCounter.toString(), FieldType.SCRIPT_ERROR);
              ed.setPropertyValue(PropertyKey.TEXT, 'Scriptfehler Zeile ' + lineCounter.toString() + ': unbekannter Schlüssel');
          }
          if (ed) {
            myReturn.push(ed);
          }
        }
      }

      idCounter += 1;
    });
    return myReturn;
  }

  static getParameter(line: string, pos: number): string {
    const lineSplits = line.split('??');
    const lineSplits2 = lineSplits[0].split('::');
    return lineSplits2[pos];
  }
  static getHelpText(line: string): string {
    const lineSplits = line.split('??');
    if (lineSplits.length > 1) {
      return lineSplits[1];
    } else {
      return null;
    }
  }
  getPropertyValue(key: PropertyKey): string{
    return this.properties.get(key);
  }
  setPropertyValue(key: PropertyKey, value: string) {
    this.properties.set(key, value);
  }
}

