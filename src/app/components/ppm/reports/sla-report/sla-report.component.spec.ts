/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SlaReportComponent } from './sla-report.component';

describe('SlaReportComponent', () => {
  let component: SlaReportComponent;
  let fixture: ComponentFixture<SlaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlaReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
