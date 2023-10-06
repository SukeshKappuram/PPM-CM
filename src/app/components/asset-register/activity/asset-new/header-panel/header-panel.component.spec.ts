/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HeaderPanelComponent } from './header-panel.component';

describe('HeaderPanelComponent', () => {
  let component: HeaderPanelComponent;
  let fixture: ComponentFixture<HeaderPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderPanelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
