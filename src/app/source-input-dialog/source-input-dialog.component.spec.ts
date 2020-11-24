import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceInputDialogComponent } from './source-input-dialog.component';

describe('SourceInputDialogComponent', () => {
  let component: SourceInputDialogComponent;
  let fixture: ComponentFixture<SourceInputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceInputDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
