import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalErrorRenderComponent } from './modal-error-render.component';

describe('ModalErrorRenderComponent', () => {
  let component: ModalErrorRenderComponent;
  let fixture: ComponentFixture<ModalErrorRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalErrorRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalErrorRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
