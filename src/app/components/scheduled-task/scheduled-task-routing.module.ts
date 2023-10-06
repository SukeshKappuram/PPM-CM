import { RouterModule, Routes } from '@angular/router';

import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { CommonWfGridComponent } from '../ppm/common-wf-grid/common-wf-grid.component';
import { CreateIssuerComponent } from '../ppm/create-issuer/create-issuer.component';
import { CreatePlannerComponent } from './create-planner/create-planner.component';
import { CreateSchedulerComponent } from './create-scheduler/create-scheduler.component';
import { CreateWorkorderComponent } from './create-workorder/create-workorder.component';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { LogsComponent } from '../ppm/logs/logs.component';
import { NgModule } from '@angular/core';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { ServiceType } from 'src/app/models/enums/ServiceType.enum';

const routes: Routes = [
  {
    path: 'scheduler/create',
    component: CreateSchedulerComponent
  },
  {
    path: 'scheduler/view',
    component: CreateSchedulerComponent
  },
  {
    path: 'scheduler',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'ScheduledTask/GetScheduledTasks',
      title: 'ST Scheduler Grid',
      items: ['Scheduled Task'],
      filter: FilterType.Scheduler,
      showStartEndDates: false,
      isFrequencyMandatory: false,
      isFrequencyMultiSelect: true
    }
  },
  {
    path: 'scheduler-task-planner/create',
    component: CreatePlannerComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'Planner/GetPlannerGridData',
      title: 'ST Planner Grid',
      items: ['Scheduled Task'],
      filter: FilterType.Planner,
      isFrequencyMandatory: true,
      isFrequencyMultiSelect: true,
      showStartEndDates: true
    }
  },
  {
    path: 'scheduler-task-planner/planner',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'Planner/GetPlannerGridData',
      title: 'ST Planner Grid',
      items: ['Scheduled Task'],
      filter: FilterType.Planner,
      isFrequencyMandatory: true,
      isFrequencyMultiSelect: true,
      showStartEndDates: true
    }
  },
  {
    path: 'scheduler-task-issuer/create',
    component: CreateIssuerComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'Issuer/GetIssuerReportingData',
      title: 'ST Issuer',
      items: ['Scheduled Task'],
      filter: FilterType.Issuer,
      isFrequencyMandatory: true
    }
  },
  {
    path: 'scheduler-task-issuer/issuer',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'Issuer/GetIssuerGridData',
      title: 'ST Issuer Grid',
      items: ['Scheduled Task'],
      filter: FilterType.Issuer,
      isFrequencyMandatory: true,
      isFrequencyMultiSelect: true,
      showStartEndDates: true
    }
  },
  {
    path:'st-log/open',
    component: LogsComponent,
    data: {
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'TaskLog/GetScheduledTaskLogGridData',
      isProjectMandatory: true,
      isFrequencyMultiSelect: true,
      isFrequencyMandatory: false,
      serviceType: ServiceType.SCHEDULED_TASK,
      pageLinks: ['Scheduled Task','ST Log'],
      pageTitle: 'Open ST W/O'
    }
  },
  {
    path: 'st-log/closed',
    component: LogsComponent,
    data: {
      statusId: ServiceStatus.CLOSED,
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'TaskLog/GetScheduledTaskLogGridData',
      isProjectMandatory: true,
      isFrequencyMultiSelect: true,
      isFrequencyMandatory: false,
      serviceType: ServiceType.SCHEDULED_TASK,
      pageLinks: ['Scheduled Task','ST Log'],
      pageTitle: 'Closed ST W/O'
    }
  },
  {
    path:'st-log/archive',
    component: LogsComponent,
    data: {
      statusId: ServiceStatus.ARCHIVED,
      api: ApiEndpoints.SCHEDULERAPI,
      url: 'TaskLog/GetScheduledTaskLogGridData',
      isProjectMandatory: true,
      isFrequencyMultiSelect: true,
      isFrequencyMandatory: false,
      serviceType: ServiceType.SCHEDULED_TASK,
      pageLinks: ['Scheduled Task','ST Log'],
      pageTitle: 'Archived ST W/O'
    }
  },
  {
    path:'scheduler-task/create',
    component: CreateWorkorderComponent,
    data: {
      url: 'TaskLog',
      pageTitle: 'Create New ST W/O'
    }
  },
  {
    path:'task/edit/:statusId',
    component: CreateWorkorderComponent,
    data: {
      url: 'TaskLog',
      pageTitle: 'Edit ST W/O'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduledTaskRoutingModule {}
