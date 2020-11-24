import {FieldType, PropertyKey} from './interfaces';

export class ElementData {

  constructor(id: string, fieldType: FieldType) {
    this.id = id;
    this.fieldType = fieldType;
  }
  id = '';
  alias = '';
  fieldType: FieldType;
  mandatory = false;
  hide = false;
  properties: Map<PropertyKey, string> = new Map();
  children: ElementData[] = [];

  static parseScript(scriptLines: string[]): ElementData[] {
    const myReturn: ElementData[] = [];
    let idCounter = 1;
    let lineCounter = 0;
    scriptLines.forEach(line => {
      lineCounter += 1;
      if (line) {
        const keywordList = line.match(/[a-z\-]+/);
        if (keywordList && keywordList.length > 0) {
          const keyword = keywordList[0];
          const parameter1 = this.getParameter(line, 1);
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
      } else {
        myReturn.push(new ElementData('id' + idCounter.toString(), FieldType.TEXT));
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
    console.log(value);
    this.properties.set(key, value);
  }
}

