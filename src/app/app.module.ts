import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { SourceInputDialogComponent } from './source-input-dialog/source-input-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TextComponent } from './components/text/text.component';

@NgModule({
  declarations: [
    AppComponent,
    SourceInputDialogComponent,
    TextComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FlexLayoutModule,
    MatTooltipModule
  ],
  providers: [],
  entryComponents: [
    SourceInputDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
