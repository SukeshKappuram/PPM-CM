import { RouterModule, Routes } from '@angular/router';

import { AccessRolesComponent } from './administration/masters/access-roles/access-roles.component';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { AssetsListComponent } from '../asset-register/assets-master/assets-list/assets-list.component';
import { CustomersComponent } from './administration/customers/customers.component';
import { MasterListComponent } from './administration/masters/master-list/master-list.component';
import { NgModule } from '@angular/core';
import { TabsMasterViewComponent } from './administration/masters/tabs-master-view/tabs-master-view.component';

const routes: Routes = [
  {
    path: 'masters/type',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/sub-type',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/category',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/fault-codes',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/service-types',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/mode-of-calls',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/channels',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/loc',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/priorities',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/financeCodes',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/costCenters',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/costCodes',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/disciplines',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'masters/onhold-reasons',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'administration/projects',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.COREAPI,
      routeEnabled: true,
      masterType: 'Projects'
    }
  },
  {
    path: 'administration/add/:masterType',
    component: TabsMasterViewComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'administration/edit/:masterType',
    component: TabsMasterViewComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'administration/locations',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.COREAPI,
      masterType: 'Locations'
    }
  },
  {
    path: 'administration/resources',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.COREAPI,
      masterType: 'Resources'
    }
  },
  {
    path: 'administration/clients',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.COREAPI,
      masterType: 'Clients'
    }
  },
  {
    path: 'administration/vendors',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.COREAPI,
      masterType: 'Vendors'
    }
  },
  {
    path: 'administration/customers',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.COREAPI,
      masterType: 'Customers'
    }
  },
  {
    path: 'administration/addcustomers',
    component: CustomersComponent,
    data: {
      apiEndpoints: ApiEndpoints.COREAPI
    }
  },
  {
    path: 'administration/editcustomers',
    component: CustomersComponent,
    data: {
      apiEndpoints: ApiEndpoints.COREAPI
    }
  },
  {
    path: 'administration/accounts',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.COREAPI,
      masterType: 'Accounts'
    }
  },
  {
    path: 'user-management/access-roles',
    component: MasterListComponent,
    data: {
      apiEndpoint: ApiEndpoints.COREAPI,
      masterType: 'Access Roles'
    }
  },
  {
    path: 'user-management/login-users',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  },
  {
    path: 'administration/access-roles',
    component: AccessRolesComponent,
    data: { apiEndpoint: ApiEndpoints.COREAPI }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
