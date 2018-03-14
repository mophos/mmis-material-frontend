import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTypeProductComponent } from './generic-type-product.component';

describe('GenericTypeProductComponent', () => {
  let component: GenericTypeProductComponent;
  let fixture: ComponentFixture<GenericTypeProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericTypeProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTypeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
