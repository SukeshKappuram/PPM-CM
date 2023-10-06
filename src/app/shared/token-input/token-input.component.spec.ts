/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TokenInputComponent } from './token-input.component';

describe('TokenInputComponent', () => {
  let component: TokenInputComponent;
  let fixture: ComponentFixture<TokenInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TokenInputComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
