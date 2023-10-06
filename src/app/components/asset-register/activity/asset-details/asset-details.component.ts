import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GridFilterComponent } from 'src/app/shared/grid-filter/grid-filter.component';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent extends CommonComponent {
  @ViewChild('gridFilter') gridFilter!: GridFilterComponent;
  constructor(
    private navService: NavigationService,
    private apiService: ApiService,
    private router: Router,
    private alertService: SweetAlertService
  ) {
    super();
    this.navState = navService?.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState.subMenu);
  }

  getAssets(filter: any): void {
    if (
      filter.projectId == '' ||
      filter.projectId == undefined ||
      filter.projectId == null
    ) {
      this.alertService.error('Please Select Project !!', {
        id: 'alert-issuer'
      });
    } else {
      this.gridData.configuration.columns = [];
      this.apiService
        .GetAssetDetails(`Activity/GetAllAssets/`, filter)
        .subscribe({
          next: (result) => {
            let gridData = result;
            if (gridData.data?.length > 0) {
              this.gridFilter.toggleShow();
              this.dataService.filterApplied({
                isFilterApplied: true,
                noOfFiltersApplied: 1
              });
            }
            gridData.actions = this.mapUserAccess(gridData.actions, this.userAccess);
            this.gridData = gridData;
          },
          error: (e) => {
            this.alertService.error('Error retreving assets !!', {
              id: 'alert-assetDetails'
            });
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  deleteAsset(item: any): void {
    this.apiService
      .DeleteAsset(
        this.navService.getNavigationState().subMenu?.editUrl ?? '',
        item.id
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.alertService.success('Deleted asset successfully!!', {
              id: 'alert-assetDetails'
            });
          } else {
            this.alertService.warn('Could not delete asset !!', {
              id: 'alert-assetDetails'
            });
          }
        },
        error: (e) => {
          this.alertService.error('Error deleting asset !!', { id: '3' });
          console.error(e);
        },
        complete: () => this.getAssets({})
      });
  }

  modifyAsset(item?: any): void {
    let navState = this.navService.getNavigationState();
    navState.currentAssertId = item ? item.assetId : undefined;
    navState.editUrl = 'Activity/GetAllMasterData';
    this.navService.setNavigationState(navState);
    this.router.navigate([Navigate.EDIT_ASSET]);
  }

  protected override buttonClicked(buttonType: any): void {}
}
