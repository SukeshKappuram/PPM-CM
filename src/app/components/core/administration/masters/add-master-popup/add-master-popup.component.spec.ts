/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddMasterPopupComponent } from './add-master-popup.component';

describe('AddAssetComponent', () => {
  let component: AddMasterPopupComponent;
  let fixture: ComponentFixture<AddMasterPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddMasterPopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMasterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
