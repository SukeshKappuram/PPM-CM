import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContractPerformanceDashboardComponent } from './contract-performance-dashboard/contract-performance-dashboard.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, ReportsRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [MonthlyReportComponent, ContractPerformanceDashboardComponent]
})
export class ReportsModule {}
