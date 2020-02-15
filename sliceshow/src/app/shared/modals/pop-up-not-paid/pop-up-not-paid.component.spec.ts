import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpNotPaidComponent } from './pop-up-not-paid.component';

describe('PopUpNotPaidComponent', () => {
  let component: PopUpNotPaidComponent;
  let fixture: ComponentFixture<PopUpNotPaidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpNotPaidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpNotPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
