import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { CommonModule } from '@angular/common';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IconsModule } from "@progress/kendo-angular-icons";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { NewStockComponent } from './new-stock/new-stock.component';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PopoverModule } from '@progress/kendo-angular-tooltip';
import { PopupComponent } from './stock-issue/popup/popup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StockIssueComponent } from './stock-issue/stock-issue.component';
import { StockManagementRoutingModule } from './stock-management-routing.module';

@NgModule({
  declarations: [
    StockIssueComponent,
    NewStockComponent,
    PopupComponent
  ],
  exports: [
    PopupComponent
  ],
  imports: [
    CommonModule,
    StockManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    DropDownsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    IconsModule,
    LayoutModule,
    PopoverModule
  ]
})
export class StockManagementModule { }

