import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalAuditComponent } from './conditional-audit.component';

describe('ConditionalAuditComponent', () => {
  let component: ConditionalAuditComponent;
  let fixture: ComponentFixture<ConditionalAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConditionalAuditComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConditionalAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
