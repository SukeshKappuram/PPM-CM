/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateCallsComponent } from './create-calls.component';

describe('CreateCallsComponent', () => {
  let component: CreateCallsComponent;
  let fixture: ComponentFixture<CreateCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCallsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
