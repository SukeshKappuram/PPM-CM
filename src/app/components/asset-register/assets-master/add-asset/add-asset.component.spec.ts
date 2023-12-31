/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddAssetComponent } from './add-asset.component';

describe('AddAssetComponent', () => {
  let component: AddAssetComponent;
  let fixture: ComponentFixture<AddAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAssetComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
