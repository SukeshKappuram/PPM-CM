import { RouterModule, Routes } from '@angular/router';

import { ApiEndpoints } from './../../models/enums/api-endpoints.enum';
import { AssetsListComponent } from '../asset-register/assets-master/assets-list/assets-list.component';
import { CommonWfGridComponent } from './common-wf-grid/common-wf-grid.component';
import { CreateCallsComponent } from '../corrective-calls/create-calls/create-calls.component';
import { CreateHseqComponent } from './questions/create-hseq/create-hseq.component';
import { CreateIssuerComponent } from './create-issuer/create-issuer.component';
import { CreatePlannerComponent } from './create-planner/create-planner.component';
import { CreateSchedulerComponent } from './create-scheduler/create-scheduler.component';
import { CreateTaskInstructionComponent } from './task-instructions/create-task-instruction/create-task-instruction.component';
import { DetailsComponent } from './reports/details/details.component';
import { EventReportComponent } from './reports/event-report/event-report.component';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { LogsComponent } from './logs/logs.component';
import { NgModule } from '@angular/core';
import { QuestionsComponent } from './questions/questions.component';
import { ReportsComponent } from './reports/reports.component';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { ServiceType } from 'src/app/models/enums/ServiceType.enum';
import { SlaReportComponent } from './reports/sla-report/sla-report.component';
import { TaskInstructionsComponent } from './task-instructions/task-instructions.component';

const routes: Routes = [
  {
    path: 'task-instructions/create',
    component: CreateTaskInstructionComponent
  },
  {
    path: 'task-instructions/edit',
    component: CreateTaskInstructionComponent
  },
  {
    path: 'task-instructions/instructions',
    component: TaskInstructionsComponent
  },
  {
    path: 'task-instructions/groups',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.PPMAPI }
  },
  {
    path: 'task-instructions/standards',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.PPMAPI }
  },
  {
    path: 'ppm-issuer/create',
    component: CreateIssuerComponent,
    data: {
      api: ApiEndpoints.PPMAPI,
      url: 'Issuer/GetIssuerReportingData',
      title: 'PM Issuer',
      items: ['PPM'],
      filter: FilterType.Issuer,
      isFrequencyProjected: true,
      isFrequencySelected: true
    }
  },
  {
    path: 'ppm-log/create',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Planned Calls'],
      serviceType: ServiceType.PM,
      statusId: ServiceStatus.OPEN,
      pageTitle: 'Create New PM Log'
    }
  },
  {
    path: 'ppm-log/create/:status',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Planned Calls'],
      serviceType: ServiceType.PM,
      statusId: ServiceStatus.OPEN,
      pageTitle: 'Create New PM Log'
    }
  },
  {
    path: 'ppm-log/edit/:statusId',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Planned Calls'],
      serviceType: ServiceType.PM,
      pageTitle: 'Edit PM Log'
    }
  },
  {
    path: 'ppm-log/open',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.PM,
      pageLinks: ['PM Log'],
      pageTitle: 'Open PM'
    }
  },
  {
    path: 'ppm-log/closed',
    component: LogsComponent,
    data: {
      statusId: ServiceStatus.CLOSED,
      serviceType: ServiceType.PM,
      pageLinks: ['PM Log'],
      pageTitle: 'Completed PM'
    }
  },
  {
    path: 'ppm-log/archived',
    component: LogsComponent,
    data: {
      statusId: ServiceStatus.ARCHIVED,
      serviceType: ServiceType.PM,
      pageLinks: ['PM Log'],
      pageTitle: 'Archived PM'
    }
  },
  {
    path: 'ppm-log/transfer',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.PM,
      filterType: FilterType.Transfer,
      url: 'TaskLog/GetTaskLogTransferGridData',
      isProjectMandatory: true,
      isTransferable: true,
      pageLinks: ['PM Log'],
      pageTitle: 'Transfer PM'
    }
  },
  {
    path: 'ppm-log/bulkclose',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.PM,
      filterType: FilterType.BlukClose,
      url: 'TaskLog/GetTaskLogBulkCloseGridData',
      isProjectMandatory: true,
      isCloseable: true,
      pageLinks: ['PM Log'],
      pageTitle: 'Bulk Close PM'
    }
  },
  {
    path: 'ppm-reports/details',
    component: DetailsComponent
  },
  {
    path: 'ppm-planner/create',
    component: CreatePlannerComponent
  },
  {
    path: 'ppm-planner/planner',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.PPMAPI,
      url: 'Planner/GetPlannerGridData',
      title: 'PPM Planner Grid',
      showStartEndDates: true,
      items: ['PPM'],
      filter: FilterType.Planner
    }
  },
  {
    path: 'ppm-reports/planned',
    component: EventReportComponent
  },
  {
    path: 'ppm-reports/sla',
    component: SlaReportComponent
  },
  {
    path: 'ppm-reports/reports',
    component: ReportsComponent
  },
  {
    path: 'ppm-scheduler/create',
    component: CreateSchedulerComponent
  },
  {
    path: 'ppm-scheduler/view',
    component: CreateSchedulerComponent
  },
  {
    path: 'ppm-scheduler/scheduler',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.PPMAPI,
      url: 'Scheduler/GetSchedulerGridData',
      title: 'PPM Scheduler Grid',
      items: ['PPM'],
      filter: FilterType.Scheduler
    }
  },
  {
    path: 'ppm-issuer/issuer',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.PPMAPI,
      url: 'Issuer/GetIssuerGridData',
      title: 'PPM Issuer Grid',
      items: ['PPM'],
      filter: FilterType.Issuer
    }
  },
  {
    path: 'ppm-hseq/create',
    component: CreateHseqComponent
  },
  {
    path: 'ppm-hseq/edit',
    component: CreateHseqComponent
  },
  {
    path: 'ppm-hseq/grid',
    component: QuestionsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PpmRoutingModule { }
