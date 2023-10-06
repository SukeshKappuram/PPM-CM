import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccessRolesComponent } from './administration/masters/access-roles/access-roles.component';
import { AddMasterPopupComponent } from './administration/masters/add-master-popup/add-master-popup.component';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { CustomersComponent } from './administration/customers/customers.component';
import { DataMapperComponent } from './administration/masters/project-privileges/data-mapper/data-mapper.component';
import { GeoLocationsComponent } from './administration/masters/tabs-master-view/geo-locations/geo-locations.component';
import { MasterListComponent } from './administration/masters/master-list/master-list.component';
import { NgModule } from '@angular/core';
import { ProjectPrivilegesComponent } from './administration/masters/project-privileges/project-privileges.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabsMasterViewComponent } from './administration/masters/tabs-master-view/tabs-master-view.component';

@NgModule({
  declarations: [
    MasterListComponent,
    AddMasterPopupComponent,
    TabsMasterViewComponent,
    AccessRolesComponent,
    GeoLocationsComponent,
    CustomersComponent,
    ProjectPrivilegesComponent,
    DataMapperComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CoreModule { }
