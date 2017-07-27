import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalinformationComponent } from './personalinformation.component';

describe('PersonalinformationComponent', () => {
  let component: PersonalinformationComponent;
  let fixture: ComponentFixture<PersonalinformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalinformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
