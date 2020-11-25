import { Pipe, PipeTransform } from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Pipe({name: 'errorTransform'})
export class InputErrorPipe implements PipeTransform {
  private errorMessages = {
    max: 'Wert zu groß',
    min: 'Wert zu klein',
    pattern: 'unerlaubte Zeichen',
    required: 'Eingabe erforderlich',
    maxlength: 'zu lang'
  };

  public transform(errors: ValidationErrors | null): string {
    if (errors) {
      let returnMessage = '';
      Object.keys(this.errorMessages).forEach(msgKey => {
        if (errors.hasOwnProperty(msgKey)) {
          if (returnMessage) {
            returnMessage += '; ';
          } else {
            returnMessage += ': ';
          }
          returnMessage += this.errorMessages[msgKey];
        }
      });
      Object.keys(errors).forEach(errorKey => {
        if (!this.errorMessages.hasOwnProperty(errorKey)) {
          if (returnMessage) {
            returnMessage += '; ';
          } else {
            returnMessage += ': ';
          }
          returnMessage += errorKey;
        }
      });
      if (!returnMessage) {
        returnMessage = '!';
      }
      return 'Bitte korrigieren Sie die Eingabe' + returnMessage;
    } else {
      return '';
    }
  }
}
