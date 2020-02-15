import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenPreviewComponent } from './screen-preview.component';

describe('ScreenPreviewComponent', () => {
  let component: ScreenPreviewComponent;
  let fixture: ComponentFixture<ScreenPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
