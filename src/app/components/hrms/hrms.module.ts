import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { EditorModule } from "@progress/kendo-angular-editor";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateAnnouncementComponent } from './announcement/create-announcement/create-announcement.component';
import { AssignedUsersComponent } from './assigned-users/assigned-users.component';
import { HrmsComponent } from './hrms.component';
import { HrmsRoutingModule } from './hrms.routing.module';
import { PopupHrmsComponent } from './popup-hrms/popup-hrms.component';

@NgModule({
  imports: [
    CommonModule,
    HrmsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    EditorModule,
    LabelModule,
    InputsModule,
    ButtonsModule,
    ToolBarModule
  ],
    declarations: [HrmsComponent, CreateAnnouncementComponent, AssignedUsersComponent,PopupHrmsComponent]
})

export class HrmsModule {}
