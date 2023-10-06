import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { AssetsListComponent } from '../asset-register/assets-master/assets-list/assets-list.component';
import { MasterListComponent } from '../core/administration/masters/master-list/master-list.component';
import { CommonWfGridComponent } from '../ppm/common-wf-grid/common-wf-grid.component';
import { CreateGrnComponent } from './create-grn/create-grn.component';
import { CreateMrComponent } from './create-mr/create-mr.component';
import { GrnReturnComponent } from './grn-return/grn-return.component';

const routes: Routes = [
  {
    path: 'create-mr',
    component: CreateMrComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'edit-mr',
    component: CreateMrComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'mr-grid',
    component: CommonWfGridComponent,
    data: {
      api: ApiEndpoints.STOCKAPI,
      url: 'MaterialRequest/GetMRGridDetails',
      title: 'MR Grid',
      items: ['MR'],
      filter: FilterType.MR,
      showStartEndDates: false,
      isFrequencyMandatory: false,
      isFrequencyMultiSelect: false
    }
  },
  {
    path: 'awaiting-approvals',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'partially-issued-mr',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'closed-mr-grid',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'mr-summary',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'grn/new-grn',
    component: CreateGrnComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'grn/edit-grn',
    component: CreateGrnComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'grn/grn-details-grid',
    component: MasterListComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI, masterType: 'GRN' }
  },
  {
    path: 'grn/grn-return',
    component: GrnReturnComponent,
    data: { apiEndpoint: ApiEndpoints.STOCKAPI }
  },
  {
    path: 'grn/grn-return-grid',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI,
      masterType: 'GRN Return'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcurementRoutingModule {}
