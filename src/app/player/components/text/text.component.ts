import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ElementComponent } from '../element.component';
import { FieldType, PropertyKey } from '../../classes/interfaces';
import { UIElement } from '../../classes/UIElement';

@Component({
  selector: 'player-text',
  template: `
    <ng-container *ngIf="content" [ngSwitch]="elementDataAsUIElement.fieldType">
      <p *ngSwitchCase="fieldType.TEXT">{{content}}</p>
      <p *ngSwitchCase="fieldType.SCRIPT_ERROR" class="script-error">{{content}}</p>
      <h1 *ngSwitchCase="fieldType.TITLE">{{content}}</h1>
      <h2 *ngSwitchCase="fieldType.HEADER">{{content}}</h2>
      <div *ngSwitchCase="fieldType.HTML" [innerHTML]="content"></div>
    </ng-container>

    <ng-container *ngIf="!content" [ngSwitch]="elementDataAsUIElement.fieldType">
      <p *ngSwitchCase="fieldType.TEXT">&nbsp;</p>
      <h1 *ngSwitchCase="fieldType.TITLE">&nbsp;</h1>
      <h2 *ngSwitchCase="fieldType.HEADER">&nbsp;</h2>
      <hr *ngSwitchCase="fieldType.HR"/>
    </ng-container>
  `,
  styles: ['.script-error {font-size: large; color: red; font-weight: bold}']
})
export class TextComponent extends ElementComponent implements OnInit {
  content: string | SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    if (this.elementData && this.elementData instanceof UIElement) {
      if (this.elementData.fieldType === FieldType.HTML) {
        this.content = this.sanitizer.bypassSecurityTrustHtml(
          this.elementData.properties.get(PropertyKey.TEXT)
        );
        // todo how to keep urls?
      } else {
        this.content = this.elementData.properties.get(PropertyKey.TEXT);
      }
    }
  }
}
