/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MrTabComponent } from './mr-tab.component';

describe('MrTabComponent', () => {
  let component: MrTabComponent;
  let fixture: ComponentFixture<MrTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
