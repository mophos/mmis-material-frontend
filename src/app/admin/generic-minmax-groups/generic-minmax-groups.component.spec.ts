import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMinmaxGroupsComponent } from './generic-minmax-groups.component';

describe('GenericMinmaxGroupsComponent', () => {
  let component: GenericMinmaxGroupsComponent;
  let fixture: ComponentFixture<GenericMinmaxGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericMinmaxGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMinmaxGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
