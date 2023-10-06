import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateSchedulerComponent } from './create-scheduler/create-scheduler.component';
import { UnitPmRoutingModule } from './unit-pm.routing.module';

@NgModule({
  declarations: [
    CreateSchedulerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    UnitPmRoutingModule
  ]
})
export class UnitPmModule { }

