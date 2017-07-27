import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplaceinformationComponent } from './workplaceinformation.component';

describe('WorkplaceinformationComponent', () => {
  let component: WorkplaceinformationComponent;
  let fixture: ComponentFixture<WorkplaceinformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplaceinformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplaceinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
