/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateIssuerComponent } from './create-issuer.component';

describe('CreateIssuerComponent', () => {
  let component: CreateIssuerComponent;
  let fixture: ComponentFixture<CreateIssuerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateIssuerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIssuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
