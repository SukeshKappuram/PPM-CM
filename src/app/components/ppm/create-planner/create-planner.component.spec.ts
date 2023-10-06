/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreatePlannerComponent } from './create-planner.component';

describe('CreatePlannerComponent', () => {
  let component: CreatePlannerComponent;
  let fixture: ComponentFixture<CreatePlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePlannerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
