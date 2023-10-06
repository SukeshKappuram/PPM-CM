import { RouterModule, Routes } from '@angular/router';

import { CreateCallsComponent } from '../corrective-calls/create-calls/create-calls.component';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { LogsComponent } from '../ppm/logs/logs.component';
import { NgModule } from '@angular/core';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { ServiceType } from 'src/app/models/enums/ServiceType.enum';

const routes: Routes = [
  {
    path: 'create',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Reactive W/O'],
      serviceType: ServiceType.REACTIVE,
      statusId: ServiceStatus.OPEN,
      pageTitle: 'Create New Reactive W/O'
    }
  },
  {
    path: 'create/:status',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Reactive W/O'],
      serviceType: ServiceType.REACTIVE,
      pageTitle: 'Create New Reactive W/O'
    }
  },
  {
    path: 'edit/:statusId',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Reactive W/O'],
      serviceType: ServiceType.REACTIVE,
      pageTitle: 'Edit Reactive W/O'
    }
  },
  {
    path: 'open',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.REACTIVE,
      pageLinks: ['Reactive W/O'],
      pageTitle: 'Open W/O'
    }
  },
  {
    path: 'closed',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.REACTIVE,
      statusId: ServiceStatus.CLOSED,
      pageLinks: ['Reactive W/O'],
      pageTitle: 'Completed W/O'
    }
  },
  {
    path: 'archived',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.REACTIVE,
      statusId: ServiceStatus.ARCHIVED,
      pageLinks: ['Reactive W/O'],
      pageTitle: 'Archived W/O'
    }
  },
  {
    path: 'transfer',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.REACTIVE,
      filterType: FilterType.Transfer,
      url: 'TaskLog/GetTaskLogTransferGridData',
      isProjectMandatory: true,
      isTransferable: true,
      pageLinks: ['Reactive W/O'],
      pageTitle: 'Transfer W/O'
    }
  },
  {
    path: 'bulkclose',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.REACTIVE,
      filterType: FilterType.BlukClose,
      url: 'TaskLog/GetTaskLogBulkCloseGridData',
      isCloseable: true,
      pageLinks: ['Reactive W/O'],
      pageTitle: 'Bulk Close W/O'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReactiveCallsRoutingModule { }
