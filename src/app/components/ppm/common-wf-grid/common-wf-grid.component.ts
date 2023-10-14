import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GridFilterComponent } from 'src/app/shared/grid-filter/grid-filter.component';
import { PageHeaderComponent } from 'src/app/shared/page-header/page-header.component';
import { CommonComponent } from '../../common/common.component';
import { LocationsPopupComponent } from './locations-popup/locations-popup.component';

@Component({
  selector: 'app-common-wf-grid',
  templateUrl: './common-wf-grid.component.html',
  styleUrls: ['./common-wf-grid.component.scss']
})
export class CommonWfGridComponent extends CommonComponent {
  @ViewChild('gridFilter') gridFilter!: GridFilterComponent;
  @ViewChild('header') pageHeader!: PageHeaderComponent;
  constructor(
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private navService: NavigationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super();
    this.config['apiUrl'] = this.route.snapshot.data['url'];
    this.config['apiEndpoint'] = this.route.snapshot.data['api'];
    this.config['title'] = this.route.snapshot.data['title'];
    this.config['items'] = this.route.snapshot.data['items'];
    this.config['filter'] = this.route.snapshot.data['filter'];
    this.config['showStartEndDates'] =
      this.route.snapshot.data['showStartEndDates'];
    this.config['isProjectMandatory'] =
      this.route.snapshot.data['isProjectMandatory'] ?? true;
    this.config['isExportable'] = this.route.snapshot.data['isExportable'];
    this.config['setBackFrequency'] =
      this.route.snapshot.data['setBackFrequency'];
    this.config['useSearchButton'] =
      this.route.snapshot.data['useSearchButton'];
    this.config['isFrequencyMultiSelect'] =
      this.route.snapshot.data['isFrequencyMultiSelect'];
    this.config['isFrequencyMandatory'] =
      this.route.snapshot.data['isFrequencyMandatory'];
    this.navState = navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState.subMenu);
  }

  getData(filter: any) {
    if (
      this.config.isProjectMandatory &&
      (filter.projectId == '' ||
        filter.projectId == undefined ||
        filter.projectId == null)
    ) {
      this.alertService.error('Please Select Project !!', {
        id: 'alert-issuer'
      });
    } else if (
      this.config.isFrequencyMandatory &&
      (filter.frequencyTypeIds == '' ||
        filter.frequencyTypeIds == undefined ||
        filter.frequencyTypeIds == null)
    ) {
      this.alertService.error('Please Select Frequency !!', {
        id: 'alert-issuer'
      });
    } else {
      this.gridData.configuration.columns = [];
      this.apiService
        .GetDataByFilter(this.config?.apiUrl, filter, this.config?.apiEndpoint)
        .subscribe({
          next: (result: any) => {
            let gridData = result;
            let locationColumn = gridData?.configuration?.columns?.find(
              (col: any) => col.mappingColumn == 'locationId'
            );
            gridData.data?.forEach((row: any) => {
              let status = row.isBlocked
                ? 'Blocked'
                : row.isCancelled
                ? 'Cancelled'
                : row.isDropped
                ? 'Dropped'
                : row.isIssued
                ? 'Issued'
                : row.isOmit
                ? 'Omitted'
                : row.isOverrideWO
                ? 'Overriden'
                : 'Planned';
              row['currentStatus,'] = status ? this.getStatusText(status) : 'Planned';
              row['currentStatus-'] = status ? status : 'Planned';
              row[
                'assetCode,assetName'
              ] = `<div><a class="text-body font-weight-semibold">${row.assetCode}</a>
                <div class="text-muted font-size-sm">${row.assetName}</div></div>`;
              row['assetCode-assetName'] = `${row.assetCode ?? ''}, ${
                row.assetName ?? ''
              }`;
              row[
                'buildingName,locationName'
              ] = `<div><a class="text-body font-weight-semibold">${row.buildingName}</a>
              <div class="text-muted font-size-sm">${row.locationName}</div></div>`;
              row[
                'buildingName-locationName'
              ] = `${row.buildingName}, ${row.locationName}`;
              row[
                'systemName,tagName'
              ] = `<div><a class="text-body font-weight-semibold">${
                row.systemName
              }</a>
              <div class="text-muted font-size-sm">${
                row.tagName ?? 'NA'
              }</div></div>`;
              row['systemName-tagName'] = `${row.systemName}, ${row.tagName}`;
              row[
                'typeName-subTypeName'
              ] = `${row.typeName}, ${row.subTypeName}`;
              row[
                'taskInstructionCode,taskInstructionName'
              ] = `<div><a class="text-body font-weight-semibold">${
                row.taskInstructionCode
              }</a>
              <div class="text-muted font-size-sm">${
                row.taskInstructionName ?? 'NA'
              }</div></div>`;
              row[
                'taskInstructionCode-taskInstructionName'
              ] = `${row.taskInstructionCode}, ${row.taskInstructionName}`;
              if (
                locationColumn &&
                locationColumn?.columnFormat === this.ColumnFormat.HTML
              ) {
                row['locationDetailsId'] = row.locationId;
                row['locationId'] =
                  row.locationId === 0
                    ? ''
                    : `<div class="position-relative w-100 text-center">
                <i class="bi bi-geo-alt-fill cursor-pointer"></i>
                </div>`;
              }
            });
            if (gridData.data?.length > 0) {
              this.gridFilter.toggleShow();
              this.dataService.filterApplied({
                isFilterApplied: true,
                noOfFiltersApplied: 1
              });
            }
              this.gridData = gridData;
              this.gridData.actions = this.mapUserAccess(gridData.actions, this.userAccess);
          },
          error: (e) => {
            this.alertService.error('Error Retrieving Issuer !!', {
              id: 'alert-issuer'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  view(scheduler: any) {
    let navState = this.navService.getNavigationState();
    let navigateTo = '';
    if (this.config.apiEndpoint === ApiEndpoints.STOCKAPI) {
      navState.currentMRId = scheduler ? scheduler.id : 0;
      this.navService.setNavigationState(navState);
      navigateTo = Navigate.VIEW_MR;
    } else {
      navState.currentSchedulerId = scheduler ? scheduler.id : 0;
      this.navService.setNavigationState(navState);
      navigateTo =
        this.config.apiEndpoint === ApiEndpoints.PPMAPI
          ? Navigate.VIEW_SCHEDULE
          : Navigate.VIEW_ST_SCHEDULE;
    }
    this.router.navigate([navigateTo]);
  }

  openLocation(columnSelected: any): void {
    if (
      columnSelected.name === 'locationId' &&
      columnSelected?.value?.locationDetailsId > 0
    ) {
      this.dialog
        .open(LocationsPopupComponent, {
          data: {
            taskId: columnSelected.value?.locationDetailsId,
            title: 'Locations'
          },
          autoFocus: true,
          maxHeight: '85vh',
          width: '80vw',
          disableClose: true
        })
        .afterClosed();
    }
  }

  override getStatusText(status: string): string {
    let icon = '';
    let statusType = '';
    switch (status) {
      case 'Blocked':
        icon = 'bi bi-lock';
        statusType = 'dark';
        break;
      case 'Cancelled':
        icon = 'bi bi-x';
        statusType = 'warning';
        break;
      case 'Dropped':
        icon = 'bi bi-arrow-down';
        statusType = 'danger';
        break;
      case 'Issued':
        icon = 'bi bi-list-check';
        statusType = 'success';
        break;
      case 'Omitted':
        icon = 'bi bi-x';
        statusType = 'secondary';
        break;
      case 'Overriden':
        icon = 'bi bi-info';
        statusType = 'info';
        break;
      case 'Planned':
        icon = 'bi bi-info';
        statusType = 'primary';
        break;
    }
    return (
      '<a class="badge badge-flat badge-pill border-' +
      statusType +
      ' text-' +
      statusType +
      '"><i class="' +
      icon +
      ' mr-2"></i>' +
      status +
      '</a>'
    );
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
