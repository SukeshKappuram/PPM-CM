import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { ExpansionPanelComponent, ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertComponent } from './alert/alert.component';
import { AreaGraphComponent } from './area-graph/area-graph.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ButtonDropdownComponent } from './button-dropdown/button-dropdown.component';
import { CharCasePipe } from '../pipes/char-case.pipe';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { ColorPickerModule } from '@progress/kendo-angular-inputs';
import { ColumnGraphComponent } from './column-graph/column-graph.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { GridFilterComponent } from './grid-filter/grid-filter.component';
import { KendoGridComponent } from './kendo-grid/kendo-grid.component';
import { LabelComponent } from './label/label.component';
import { LazyImgDirective } from '../directives/LazyImgDirective.directive';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { LocalizedDatePipe } from '../pipes/localized-date.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MultiDropdownComponent } from './multi-dropdown/multi-dropdown.component';
import { NgModule } from '@angular/core';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PieGraphComponent } from './pie-graph/pie-graph.component';
import { SanitizeUrlPipe } from '../pipes/sanitize-url.pipe';
import { SearchPipe } from '../pipes/search.pipe';
import { SortPipe } from '../pipes/Sort.pipe';
import { StackedGraphComponent } from './stacked-graph/stacked-graph.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertComponent } from './sweet-alert/sweet-alert.component';
import { TagDropdownComponent } from './tag-dropdown/tag-dropdown.component';
import { TagInputModule } from 'ngx-chips';
import { TextFieldComponent } from './text-field/text-field.component';
import { TextareaFieldComponent } from './textarea-field/textarea-field.component';
import { ToastMsgComponent } from './toastMsg/toastMsg.component';
import { TokenInputComponent } from './token-input/token-input.component';
import { TooltipsModule } from "@progress/kendo-angular-tooltip";
import localeAr from '@angular/common/locales/ar';

registerLocaleData(localeAr);
@NgModule({
  declarations: [
    // DataTableComponent,
    TextFieldComponent,
    DropdownComponent,
    TextareaFieldComponent,
    AlertComponent,
    LabelComponent,
    TokenInputComponent,
    LazyImgDirective,
    ButtonDropdownComponent,
    BreadcrumbsComponent,
    PageHeaderComponent,
    ToastMsgComponent,
    GridFilterComponent,
    TagDropdownComponent,
    SweetAlertComponent,
    KendoGridComponent,
    MultiDropdownComponent,
    PieGraphComponent,
    LineGraphComponent,
    StackedGraphComponent,
    ColumnGraphComponent,
    AreaGraphComponent,

    //pipes
    SanitizeUrlPipe,
    LocalizedDatePipe,
    SortPipe,
    CharCasePipe,
    SearchPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    SweetAlert2Module.forRoot(),
    GridModule,
    ExcelModule,
    PDFModule,
    DropDownListModule,
    DropDownsModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    TooltipsModule,
    ChartsModule,
    ExpansionPanelModule,
    ColorPickerModule
  ],
  exports: [
    // DataTableComponent,
    TextFieldComponent,
    DropdownComponent,
    TextareaFieldComponent,
    AlertComponent,
    LabelComponent,
    TokenInputComponent,
    BreadcrumbsComponent,
    PageHeaderComponent,
    GridFilterComponent,
    TagDropdownComponent,
    SweetAlertComponent,
    LocalizedDatePipe,
    SanitizeUrlPipe,
    SortPipe,
    CharCasePipe,
    SearchPipe,
    KendoGridComponent,
    MultiDropdownComponent,
    PieGraphComponent,
    LineGraphComponent,
    ColumnGraphComponent,
    AreaGraphComponent,
    StackedGraphComponent,
    MatDialogModule,
    DropDownListModule,
    ExpansionPanelComponent,
    ColorPickerModule,
    PDFExportModule,
    GridModule,
    PDFModule
  ],
  providers: [
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
    LocalizedDatePipe,
    SortPipe,
    CharCasePipe,
    SearchPipe
  ]
})
export class SharedModule { }

