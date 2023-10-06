import { RouterModule, Routes } from '@angular/router';

import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { CommonWfGridComponent } from '../ppm/common-wf-grid/common-wf-grid.component';
import { CreateIssuerComponent } from '../ppm/create-issuer/create-issuer.component';
import { CreatePlannerComponent } from '../scheduled-task/create-planner/create-planner.component';
import { CreateSchedulerComponent } from './create-scheduler/create-scheduler.component';
import { CreateWorkorderComponent } from '../scheduled-task/create-workorder/create-workorder.component';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { LogsComponent } from '../ppm/logs/logs.component';
import { NgModule } from '@angular/core';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';

const routes: Routes = [
  {
    path: 'um-scheduler/create',
    component: CreateSchedulerComponent
  },
  {
    path: 'um-scheduler/view',
    component: CreateSchedulerComponent
  },
  {
    path: 'um/scheduler',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'ScheduledTask/GetScheduledTasks',
      title: 'Unit PM Scheduler Grid',
      items: ['Unit PM'],
      filter: FilterType.Scheduler,
      showStartEndDates: false,
      isFrequencyMandatory: true,
      isFrequencyMultiSelect: true
    }
  },
  {
    path: 'um-planner/create',
    component: CreatePlannerComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'Planner/GetPlannerGridData',
      title: 'Unit PM Planner Grid',
      items: ['Unit PM'],
      filter: FilterType.Planner,
      isFrequencyMandatory: true,
      isFrequencyMultiSelect: true
    }
  },
  {
    path: 'um/planner',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'Planner/GetPlannerGridData',
      title: 'Unit PM Planner Grid',
      items: ['Unit PM'],
      filter: FilterType.Planner,
      isFrequencyMandatory: true,
      isFrequencyMultiSelect: true
    }
  },
  {
    path: 'um-issuer/create',
    component: CreateIssuerComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'Issuer/GetIssuerReportingData',
      title: 'Unit PM',
      items: ['Scheduled Task'],
      filter: FilterType.Issuer
    }
  },
  {
    path: 'um/issuer',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'Issuer/GetIssuerGridData',
      title: 'Unit PM Issuer Grid',
      items: ['Unit PM'],
      filter: FilterType.Issuer,
      isFrequencyMandatory: true,
      isFrequencyMultiSelect: true
    }
  },
  {
    path:'um/OpenWo',
    component: LogsComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'UnitPMTaskLog/GetTaskLogGridData'
    }
  },
  {
    path: 'um/ClosedWo',
    component: LogsComponent,
    data: {
      statusId: ServiceStatus.CLOSED,
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'TaskLog/GetScheduledTaskLogGridData'
    }
  },
  {
    path:'um/ArchiveWo',
    component: LogsComponent,
    data: {
      statusId: ServiceStatus.ARCHIVED,
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'TaskLog/GetScheduledTaskLogGridData'
    }
  },
  {
    path:'um/create',
    component: CreateWorkorderComponent,
    data: {
      url: 'UnitPMTaskLog'
    }
  },
  {
    path:'um/edit/:statusId',
    component: CreateWorkorderComponent,
    data: {
      url: 'UnitPMTaskLog'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitPmRoutingModule {}
