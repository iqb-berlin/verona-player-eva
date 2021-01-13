import { Component } from '@angular/core';

@Component({
  template: `
    <h1 mat-dialog-title>Eingabe Script</h1>
    <div mat-dialog-content fxLayout="column">
      <mat-form-field>
        <textarea matInput #sourceData placeholder="Script Text" rows="10"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button [mat-dialog-close]="sourceData.value">OK</button>
      <button mat-button [mat-dialog-close]="false">Abbrechen</button>
    </div>
  `
})
export class SourceInputDialogComponent {

}
