import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { CommonWfGridComponent } from './common-wf-grid/common-wf-grid.component';
import { CreateHseqComponent } from './questions/create-hseq/create-hseq.component';
import { CreateIssuerComponent } from './create-issuer/create-issuer.component';
import { CreatePlannerComponent } from './create-planner/create-planner.component';
import { CreateSchedulerComponent } from './create-scheduler/create-scheduler.component';
import { CreateTaskInstructionComponent } from './task-instructions/create-task-instruction/create-task-instruction.component';
import { DetailsComponent } from './reports/details/details.component';
import { EventReportComponent } from './reports/event-report/event-report.component';
import { LocationsPopupComponent } from './common-wf-grid/locations-popup/locations-popup.component';
import { LogsComponent } from './logs/logs.component';
import { NgModule } from '@angular/core';
import { PpmRoutingModule } from './ppm-routing.module';
import { QuestionsComponent } from './questions/questions.component';
import { ReportsComponent } from './reports/reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SlaReportComponent } from './reports/sla-report/sla-report.component';
import { SortPipe } from './../../pipes/Sort.pipe';
import { TaskInstructionsComponent } from './task-instructions/task-instructions.component';

@NgModule({
  declarations: [
    CreateIssuerComponent,
    LogsComponent,
    TaskInstructionsComponent,
    ReportsComponent,
    DetailsComponent,
    CreatePlannerComponent,
    CreateTaskInstructionComponent,
    EventReportComponent,
    SlaReportComponent,
    CreateSchedulerComponent,
    QuestionsComponent,
    CreateHseqComponent,
    CommonWfGridComponent,
    LocationsPopupComponent
  ],
  imports: [
    CommonModule,
    PpmRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    LogsComponent,
    CommonWfGridComponent,
    CreateIssuerComponent
  ],
  providers: [
    SortPipe
  ]
})
export class PpmModule {}
