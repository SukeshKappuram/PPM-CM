/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommonWfGridComponent } from './common-wf-grid.component';

describe('CommonWfGridComponent', () => {
  let component: CommonWfGridComponent;
  let fixture: ComponentFixture<CommonWfGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonWfGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonWfGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
