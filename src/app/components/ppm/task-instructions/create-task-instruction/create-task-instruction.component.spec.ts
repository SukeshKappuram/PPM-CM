/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CreateTaskInstructionComponent } from './create-task-instruction.component';

describe('CreateTaskInstructionComponent', () => {
  let component: CreateTaskInstructionComponent;
  let fixture: ComponentFixture<CreateTaskInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTaskInstructionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaskInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
