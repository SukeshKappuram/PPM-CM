import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssetDetailsComponent } from './activity/asset-details/asset-details.component';
import { AssetNewComponent } from './activity/asset-new/asset-new.component';
import { FinanceComponent } from './activity/asset-new/finance/finance.component';
import { GeneralComponent } from './activity/asset-new/general/general.component';
import { HeaderPanelComponent } from './activity/asset-new/header-panel/header-panel.component';
import { IdentificationComponent } from './activity/asset-new/identification/identification.component';
import { ParameterComponent } from './activity/asset-new/parameter/parameter.component';
import { SidePanelComponent } from './activity/asset-new/side-panel/side-panel.component';
import { AssetRegisterRoutingModule } from './asset-register-routing.module';
import { AddAssetComponent } from './assets-master/add-asset/add-asset.component';
import { AssetsListComponent } from './assets-master/assets-list/assets-list.component';
import { ConditionalAuditComponent } from './conditional-audit/conditional-audit.component';
import { CreateNewComponent } from './conditional-audit/create-new/create-new.component';
import { AssetReportComponent } from './reports/asset-report/asset-report.component';

@NgModule({
  declarations: [
    //master
    AssetsListComponent,
    AddAssetComponent,

    //condition audit
    CreateNewComponent,
    ConditionalAuditComponent,

    //activity
    AssetDetailsComponent,
    AssetNewComponent,
    HeaderPanelComponent,
    SidePanelComponent,
    GeneralComponent,
    FinanceComponent,
    ParameterComponent,
    IdentificationComponent,

    // reports
    AssetReportComponent
  ],
  imports: [
    CommonModule,
    AssetRegisterRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ],
  exports: [AssetsListComponent, AddAssetComponent],
  providers: []
})
export class AssetRegisterModule {}
