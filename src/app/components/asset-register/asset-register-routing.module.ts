import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetDetailsComponent } from './activity/asset-details/asset-details.component';
import { AssetNewComponent } from './activity/asset-new/asset-new.component';
import { AssetsListComponent } from './assets-master/assets-list/assets-list.component';
import { ConditionalAuditComponent } from './conditional-audit/conditional-audit.component';
import { CreateNewComponent } from './conditional-audit/create-new/create-new.component';
import { AssetReportComponent } from './reports/asset-report/asset-report.component';

const routes: Routes = [
  {
    path: 'Masters/GetSystem',
    component: AssetsListComponent,
    data: {
      title: 'System'
    }
  },
  {
    path: 'Masters/GetSubSystem',
    component: AssetsListComponent,
    data: {
      title: 'SubSystem'
    }
  },
  {
    path: 'Masters/GetCategory',
    component: AssetsListComponent,
    data: {
      title: 'Category'
    }
  },
  {
    path: 'Masters/GetTags',
    component: AssetsListComponent,
    data: {
      title: 'Tags'
    }
  },
  {
    path: 'Masters/GetType',
    component: AssetsListComponent,
    data: {
      title: 'Type'
    }
  },
  {
    path: 'Masters/GetUOM',
    component: AssetsListComponent,
    data: {
      title: 'UOM'
    }
  },
  {
    path: 'Masters/GetParameter',
    component: AssetsListComponent,
    data: {
      title: 'Parameter'
    }
  },
  {
    path: 'Masters/GetParametersLink',
    component: AssetsListComponent,
    data: {
      title: 'Parameter Link'
    }
  },
  {
    path: 'Masters/GetDepreciationMethods',
    component: AssetsListComponent,
    data: {
      title: 'Depreciation Methods'
    }
  },
  {
    path: 'Activity/CreateAsset',
    component: AssetNewComponent
  },
  {
    path: 'Activity/EditAsset',
    component: AssetNewComponent
  },
  {
    path: 'Activity/GetAsset',
    component: AssetDetailsComponent
  },
  {
    path: 'Condition-Records/CreateConditionalAudit',
    component: CreateNewComponent
  },
  {
    path: 'Condition-Records/GetConditionalAudit',
    component: ConditionalAuditComponent
  },
  {
    path: 'Reports/GetAssetReports',
    component: AssetReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRegisterRoutingModule {}
