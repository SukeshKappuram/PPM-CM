import { RouterModule, Routes } from '@angular/router';

import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { CommonWfGridComponent } from '../ppm/common-wf-grid/common-wf-grid.component';
import { ContractPerformanceDashboardComponent } from './contract-performance-dashboard/contract-performance-dashboard.component';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'ContractPerformanceDashboard',
    component: ContractPerformanceDashboardComponent
  },
  {
    path: 'MonthlyReport',
    component: MonthlyReportComponent,
    data: {
      isProjectMandatory: true
    }
  },
  {
    path: 'masters/exportexcel',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.REPORTAPI,
      url: 'Common/GetGridFilterEntities',
      title: 'Export Report',
      items: ['Reports'],
      filter: FilterType.Export,
      showStartEndDates : true,
      isExportable: true,
      setBackFrequency: 0,
      useSearchButton: false,
      isFrequencyMultiSelect: true
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
