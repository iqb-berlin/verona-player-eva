import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PlayerModule } from './player/player.module';
import { SourceInputDialogComponent } from './source-input-dialog/source-input-dialog.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    SourceInputDialogComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatDialogModule,
    PlayerModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    FlexLayoutModule
  ],
  providers: [],
  entryComponents: [
    SourceInputDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
