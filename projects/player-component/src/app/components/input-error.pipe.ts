import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({ name: 'errorTransform' })
export class InputErrorPipe implements PipeTransform {
  private errorMessages = {
    max: 'Wert zu groß',
    min: 'Wert zu klein',
    pattern: 'unerlaubte Zeichen',
    required: 'Eingabe erforderlich',
    requiredCheckbox: 'Ankreuzen erforderlich',
    maxlength: 'zu lang'
  };

  public transform(errors?: ValidationErrors, isCheckbox?: boolean): string {
    if (errors) {
      let returnMessage = '';
      Object.keys(errors).forEach((errKey) => {
        if (returnMessage) {
          returnMessage += '; ';
        } else {
          returnMessage += ': ';
        }
        const msgKey = isCheckbox ? `${errKey}Checkbox` : errKey;
        if (this.errorMessages[msgKey]) {
          returnMessage += this.errorMessages[msgKey];
        } else {
          returnMessage += msgKey;
        }
      });
      if (!returnMessage) {
        returnMessage = '!';
      }
      return `Bitte korrigieren${returnMessage}`;
    }
    return '';
  }
}
