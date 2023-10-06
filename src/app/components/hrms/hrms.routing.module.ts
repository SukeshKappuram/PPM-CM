import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { AssetsListComponent } from '../asset-register/assets-master/assets-list/assets-list.component';
import { CreateAnnouncementComponent } from './announcement/create-announcement/create-announcement.component';
import { AssignedUsersComponent } from './assigned-users/assigned-users.component';
import { HrmsComponent } from './hrms.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: HrmsComponent
  },
  {
    path: 'master/classified-groups',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.HRMSAPI,title: 'ClassifiedGroups' }   
  } ,
  {
    path: 'master/hr-groups',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.HRMSAPI,title: 'HRGroups' }   
  } ,
  {
    path: 'master/designation',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.HRMSAPI,title: 'HRMSDesignation' }   
  },
  {
    path: 'master/holiday-list',
    component: AssetsListComponent,
    data: { apiEndpoint: ApiEndpoints.HRMSAPI,title: 'HolidayList' }   
  },
  {
    path: 'master/assigned-users',
    component: AssignedUsersComponent,
    data: { apiEndpoint: ApiEndpoints.HRMSAPI,title: 'Assigned Users' }   
    },
    {
        path: 'NewAnnouncement',
        component: CreateAnnouncementComponent
    },
    {
      path: 'master/hr-shifts',
      component: AssetsListComponent,
      data: { apiEndpoint: ApiEndpoints.HRMSAPI,title: 'Shifts' }   
      },
      {
        path: 'master/departments',
        component: AssetsListComponent,
        data: { apiEndpoint: ApiEndpoints.HRMSAPI,title: 'Department' }   
        },
        {
          path: 'master/vehicles',
          component: AssetsListComponent,
          data: { 
                apiEndpoint: ApiEndpoints.HRMSAPI,
                title: 'Vehicle',
                serviceCallEnabled: true,
                addOrEditEndpoint:"Vehicles/GetVehicleDetailsById"
              } ,
          },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsRoutingModule { }
