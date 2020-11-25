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
import { InputComponent } from './components/input/input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SelectComponent } from './components/select/select.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {InputErrorPipe} from './components/input-error.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SourceInputDialogComponent,
    TextComponent,
    InputComponent,
    CheckboxComponent,
    SelectComponent,
    InputErrorPipe
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FlexLayoutModule,
    MatTooltipModule,
    FormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  providers: [],
  entryComponents: [
    SourceInputDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
