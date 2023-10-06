/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ToastMsgComponent } from './toastMsg.component';

describe('ToastMsgComponent', () => {
  let component: ToastMsgComponent;
  let fixture: ComponentFixture<ToastMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToastMsgComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
