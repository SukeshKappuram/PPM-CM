import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddTaskComponent } from './create-calls/sub-task/popup/popup.component';
import { AttachmentsComponent } from './create-calls/attachments/attachments.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChecklistComponent } from './create-calls/checklist/checklist.component';
import { CommonModule } from '@angular/common';
import { CorrectiveCallsRoutingModule } from './corrective-calls-routing.module';
import { CreateCallsComponent } from './create-calls/create-calls.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EmailsComponent } from './create-calls/emails/emails.component';
import { FeedbackComponent } from './create-calls/feedback/feedback.component';
import { GeneralComponent } from './create-calls/general/general.component';
import { IconsModule } from '@progress/kendo-angular-icons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { InstructionsComponent } from './create-calls/instructions/instructions.component';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LeftLayoutComponent } from './create-calls/left-layout/left-layout.component';
import { MrTabComponent } from './create-calls/mr-tab/mr-tab.component';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { OnHoldComponent } from './create-calls/on-hold/on-hold.component';
import { PmsComponent } from './create-calls/pms/pms.component';
import { PopupComponent } from './create-calls/popup/popup.component';
import { ResourceComponent } from './create-calls/resource/resource.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StocksComponent } from './create-calls/stocks/stocks.component';
import { SubTaskComponent } from './create-calls/sub-task/sub-task.component';

@NgModule({
  declarations: [
    CreateCallsComponent,
    LeftLayoutComponent,
    GeneralComponent,
    InstructionsComponent,
    ResourceComponent,
    AttachmentsComponent,
    EmailsComponent,
    SubTaskComponent,
    ChecklistComponent,
    PmsComponent,
    FeedbackComponent,
    PopupComponent,
    AddTaskComponent,
    OnHoldComponent,
    StocksComponent,
    MrTabComponent,
    PopupComponent
  ],
  exports: [
    CreateCallsComponent,
    LeftLayoutComponent,
    GeneralComponent,
    InstructionsComponent,
    ResourceComponent,
    AttachmentsComponent,
    EmailsComponent,
    SubTaskComponent,
    ChecklistComponent,
    PmsComponent,
    FeedbackComponent,
    AddTaskComponent,
    MrTabComponent
  ],
  imports: [
    CommonModule,
    CorrectiveCallsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxDropzoneModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    IconsModule,
    LayoutModule,
    DropDownsModule
  ]
})
export class CorrectiveCallsModule {}
