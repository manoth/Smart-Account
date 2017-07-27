import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogininformationComponent } from './logininformation.component';

describe('LogininformationComponent', () => {
  let component: LogininformationComponent;
  let fixture: ComponentFixture<LogininformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogininformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogininformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
