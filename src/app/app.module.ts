import { BrowserModule } from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import './player-component/player-component.js';
import { SourceInputDialogComponent } from './source-input-dialog/source-input-dialog.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    SourceInputDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    FlexLayoutModule
  ],
  entryComponents: [
    SourceInputDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
