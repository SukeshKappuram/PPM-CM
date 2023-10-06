/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataMapperComponent } from './data-mapper.component';

describe('DataMapperComponent', () => {
  let component: DataMapperComponent;
  let fixture: ComponentFixture<DataMapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataMapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
