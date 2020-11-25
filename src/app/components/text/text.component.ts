import {Component, OnInit} from '@angular/core';
import {ElementComponent} from '../element.component';
import {FieldType, PropertyKey} from '../../classes/interfaces';

@Component({
  selector: 'app-text',
  template: `
    <ng-container *ngIf="content" [ngSwitch]="elementData.fieldType">
      <p *ngSwitchCase="fieldType.TEXT">{{content}}</p>
      <p *ngSwitchCase="fieldType.SCRIPT_ERROR" class="script-error">{{content}}</p>
      <h1 *ngSwitchCase="fieldType.TITLE">{{content}}</h1>
      <h2 *ngSwitchCase="fieldType.HEADER">{{content}}</h2>
      <span *ngSwitchCase="fieldType.HTML" [outerHTML]="content"></span>
    </ng-container>

    <ng-container *ngIf="!content" [ngSwitch]="elementData.fieldType">
      <p *ngSwitchCase="fieldType.TEXT">&nbsp;</p>
      <h1 *ngSwitchCase="fieldType.TITLE">&nbsp;</h1>
      <h2 *ngSwitchCase="fieldType.HEADER">&nbsp;</h2>
      <hr *ngSwitchCase="fieldType.HR"/>
    </ng-container>
  `,
  styleUrls: ['./text.component.sass']
})
export class TextComponent extends ElementComponent implements OnInit {
  content: string;
  fieldType = FieldType;

  ngOnInit(): void {
    this.content = this.elementData.getPropertyValue(PropertyKey.TEXT);
    // todo add validator
    // todo sanitize html
  }
}
