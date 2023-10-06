import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { CommonModule } from '@angular/common';
import { CreateGrnComponent } from './create-grn/create-grn.component';
import { CreateMrComponent } from './create-mr/create-mr.component';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { GrnReturnComponent } from './grn-return/grn-return.component';
import { IconsModule } from "@progress/kendo-angular-icons";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from "@progress/kendo-angular-label";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { NgModule } from '@angular/core';
import { ProcurementRoutingModule } from './procurement-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProcurementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    InputsModule,
    LabelModule,
    ButtonsModule,
    IconsModule,
    LayoutModule,
    DropDownsModule
  ],
  declarations: [
    CreateMrComponent,
    CreateGrnComponent,
    GrnReturnComponent
  ]
})
export class ProcurementModule { }
