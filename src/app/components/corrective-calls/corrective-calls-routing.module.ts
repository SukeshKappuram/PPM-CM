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
      pageLinks: ['Corrective W/O'],
      serviceType: ServiceType.CORRECTIVE,
      statusId: ServiceStatus.OPEN,
      pageTitle: 'Create New Corrective W/O'
    }
  },
  {
    path: 'create/:status',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Corrective W/O'],
      serviceType: ServiceType.CORRECTIVE,
      pageTitle: 'Create New Corrective W/O'
    }
  },
  {
    path: 'edit/:statusId',
    component: CreateCallsComponent,
    data: {
      pageLinks: ['Corrective W/O'],
      serviceType: ServiceType.CORRECTIVE,
      pageTitle: 'Edit Corrective W/O'
    }
  },
  {
    path: 'open',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.CORRECTIVE,
      pageLinks: ['Corrective W/O'],
      pageTitle: 'Open W/O'
    }
  },
  {
    path: 'closed',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.CORRECTIVE,
      statusId: ServiceStatus.CLOSED,
      pageLinks: ['Corrective W/O'],
      pageTitle: 'Completed W/O'
    }
  },
  {
    path: 'archived',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.CORRECTIVE,
      statusId: ServiceStatus.ARCHIVED,
      pageLinks: ['Corrective W/O'],
      pageTitle: 'Archived W/O'
    }
  },
  {
    path: 'transfer',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.CORRECTIVE,
      filterType: FilterType.Transfer,
      url: 'TaskLog/GetTaskLogTransferGridData',
      isProjectMandatory: true,
      isTransferable: true,
      pageLinks: ['Corrective W/O'],
      pageTitle: 'Transfer W/O'
    }
  },
  {
    path: 'bulkclose',
    component: LogsComponent,
    data: {
      serviceType: ServiceType.CORRECTIVE,
      filterType: FilterType.BlukClose,
      url: 'TaskLog/GetTaskLogBulkCloseGridData',
      isProjectMandatory: true,
      isCloseable: true,
      pageLinks: ['Corrective W/O'],
      pageTitle: 'Bulk Close W/O'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrectiveCallsRoutingModule { }
