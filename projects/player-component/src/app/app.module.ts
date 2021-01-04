import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { createCustomElement } from '@angular/elements';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SubFormComponent } from './components/sub-form/sub-form.component';
import { RepeatComponent } from './components/repeat/repeat.component';
import { InputErrorPipe } from './components/input-error.pipe';
import { SelectComponent } from './components/select/select.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { InputComponent } from './components/input/input.component';
import { TextComponent } from './components/text/text.component';
import { PlayerComponent } from './player.component';

@NgModule({
  declarations: [
    TextComponent,
    InputComponent,
    CheckboxComponent,
    SelectComponent,
    InputErrorPipe,
    RepeatComponent,
    SubFormComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatInputModule,
    FlexLayoutModule,
    MatTooltipModule,
    FormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  entryComponents: [
    PlayerComponent
  ]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap(): void {
    const playerElement = createCustomElement(PlayerComponent, { injector: this.injector });
    console.log('defining player-component');
    customElements.define('player-component', playerElement);
  }
}
