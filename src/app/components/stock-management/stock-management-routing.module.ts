import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { MasterListComponent } from '../core/administration/masters/master-list/master-list.component';
import { AssetsListComponent } from './../asset-register/assets-master/assets-list/assets-list.component';
import { NewStockComponent } from './new-stock/new-stock.component';
import { StockIssueComponent } from './stock-issue/stock-issue.component';

const routes: Routes = [
  {
    path: 'masters/groups',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'masters/subgroups',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'masters/classes',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'masters/additionalvariant',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'masters/mrstatus',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'masters/storelocation',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'Stock/newstockissue',
    component: StockIssueComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'Stock/editstockissue',
    component: StockIssueComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'Stock/newstockissuegrid',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI,
      masterType: 'Stock Issue'
    }
  },
  {
    path: 'Stock/newstock',
    component: NewStockComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'Stock/editstock',
    component: NewStockComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'masters/calculationmethods',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    }
  },
  {
    path: 'Stock/stockdetails',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI,
      masterType: 'Stock Details'
    },
  },
  {
    path: 'Masters/GetParameter',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    },
  },
  {
    path: 'Masters/GetParametersLink',
    component: AssetsListComponent,
    data: {
      apiEndpoint: ApiEndpoints.STOCKAPI
    },
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockManagementRoutingModule {}
