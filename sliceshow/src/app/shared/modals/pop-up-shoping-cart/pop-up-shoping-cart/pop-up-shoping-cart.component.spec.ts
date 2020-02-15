import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpShopingCartComponent } from './pop-up-shoping-cart.component';

describe('PopUpShopingCartComponent', () => {
  let component: PopUpShopingCartComponent;
  let fixture: ComponentFixture<PopUpShopingCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpShopingCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpShopingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
