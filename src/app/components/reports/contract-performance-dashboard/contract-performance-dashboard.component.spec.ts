import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPerformanceDashboardComponent } from './contract-performance-dashboard.component';

describe('ContractPerformanceDashboardComponent', () => {
  let component: ContractPerformanceDashboardComponent;
  let fixture: ComponentFixture<ContractPerformanceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractPerformanceDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContractPerformanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
