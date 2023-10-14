import { RouterModule, Routes } from '@angular/router';

import { CreateCallsComponent } from './create-calls/create-calls.component';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { LogsComponent } from '../ppm/logs/logs.component';
import { NgModule } from '@angular/core';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { ServiceType } from './../../models/enums/ServiceType.enum';

const routes: Routes = [
  {
    path: 'create',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Feedback'],
      serviceType: ServiceType.FEEDBACK,
      statusId: ServiceStatus.OPEN,
      pageTitle: 'Create New Feedback'
    }
  },
  {
    path: 'create/:status',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Feedback'],
      serviceType: ServiceType.FEEDBACK,
      pageTitle: 'Create New Feedback'
    }
  },
  {
    path: 'edit/:statusId',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Feedback'],
      serviceType: ServiceType.FEEDBACK,
      pageTitle: 'Edit Feedback'
    }
  },
  {
    path: 'open',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.FEEDBACK,
      pageLinks: ['Feedback'],
      pageTitle: 'Open W/O'
    }
  },
  {
    path: 'closed',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.FEEDBACK,
      statusId: ServiceStatus.CLOSED,
      pageLinks: ['Feedback'],
      pageTitle: 'Completed W/O'
    }
  },
  {
    path: 'archived',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.FEEDBACK,
      statusId: ServiceStatus.ARCHIVED,
      pageLinks: ['Feedback'],
      pageTitle: 'Archived W/O'
    }
  },
  {
    path: 'transfer',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.FEEDBACK,
      filterType: FilterType.Transfer,
      url: 'TaskLog/GetTaskLogTransferGridData',
      isProjectMandatory: true,
      isTransferable: true,
      pageLinks: ['Feedback'],
      pageTitle: 'Transfer W/O'
    }
  },
  {
    path: 'bulkclose',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.FEEDBACK,
      filterType: FilterType.BlukClose,
      url: 'TaskLog/GetTaskLogBulkCloseGridData',
      isProjectMandatory: true,
      isCloseable: true,
      pageLinks: ['Feedback'],
      pageTitle: 'Bulk Close W/O'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrectiveCallsRoutingModule { }
