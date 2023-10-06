import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PDFModule, SchedulerModule } from '@progress/kendo-angular-scheduler';

import { CommonModule } from '@angular/common';
import { CorrectiveCallsModule } from '../corrective-calls/corrective-calls.module';
import { CreatePlannerComponent } from './create-planner/create-planner.component';
import { CreateSchedulerComponent } from './create-scheduler/create-scheduler.component';
import { CreateWorkorderComponent } from './create-workorder/create-workorder.component';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PpmModule } from '../ppm/ppm.module';
import { ScheduledTaskRoutingModule } from './scheduled-task-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CreateSchedulerComponent,
    CreateWorkorderComponent,
    CreatePlannerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PpmModule,
    CorrectiveCallsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    ScheduledTaskRoutingModule,
    SchedulerModule,
    PDFModule
  ]
})
export class ScheduledTaskModule { }

