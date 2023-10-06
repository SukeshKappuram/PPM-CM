import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupComponent } from '../../corrective-calls/create-calls/popup/popup.component';

import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { GridFilterComponent } from 'src/app/shared/grid-filter/grid-filter.component';
import { KendoGridComponent } from 'src/app/shared/kendo-grid/kendo-grid.component';
import { PageHeaderComponent } from 'src/app/shared/page-header/page-header.component';
import { OnHoldComponent } from '../../corrective-calls/create-calls/on-hold/on-hold.component';
import { LocationsPopupComponent } from '../common-wf-grid/locations-popup/locations-popup.component';
import buttons from './../../../helpers/buttons.json';
import { SweetAlertService } from './../../../services/sweet-alert.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent extends CommonComponent {
  serviceTypeId: any;
  statusId: any;
  @ViewChild('kgrid') grid!: KendoGridComponent;
  @ViewChild('gridFilter') gridFilter!: GridFilterComponent;
  @ViewChild('header') pageHeader!: PageHeaderComponent;
  blob!: Blob;
  selectedWorkOrders: any = [];
  filter: any;

  constructor(
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public ds: DataService
  ) {
    super();
    this.serviceTypeId = this.route.snapshot.data['serviceType'];
    this.statusId = this.route.snapshot.data['statusId'];
    this.navState = navService.getNavigationState();
    this.config['pageType'] = this.route.snapshot.data['pageLinks'];
    this.config['pageTitle'] = this.route.snapshot.data['pageTitle'];
    this.config['apiUrl'] = this.route.snapshot.data['url'];
    this.config['apiEndpoint'] = this.route.snapshot.data['api'];
    this.config['isProjectMandatory'] =
      this.route.snapshot.data['isProjectMandatory'];
    this.config['isFrequencyMandatory'] =
      this.route.snapshot.data['isFrequencyMandatory'];
    this.config['isFrequencyMultiSelect'] =
      this.route.snapshot.data['isFrequencyMultiSelect'];
    this.config['filterType'] = this.route.snapshot.data['filterType'];
    this.config['isTransferable'] = this.route.snapshot.data['isTransferable'];
    this.config['isCloseable'] = this.route.snapshot.data['isCloseable'];
    this.userAccess = this.convertToUserAccess(this.navState.subMenu);
    if (!this.userAccess.canAdd) {
      this.buttons = this.buttons.filter((btn) => btn.id !== 'Save');
    }
    if (this.config?.isTransferable) {
      this.buttons = buttons.correctiveCalls.transfer;
    } else if (this.config?.isCloseable) {
      this.buttons = buttons.correctiveCalls.close;
    }
  }

  getLog(filter: any): void {
    this.filter = filter;
    this.serviceTypeId = this.route.snapshot.data['serviceType'];
    filter['serviceTypeId'] = this.route.snapshot.data['serviceType'];
    let statusId = this.route.snapshot.data['statusId'];
    filter['statusId'] = statusId ?? filter?.statusId ?? null;
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
        .GetLog(
          this.config?.apiUrl ?? 'TaskLog/GetTaskLogGridData',
          filter,
          this.config?.apiEndpoint
        )
        .subscribe({
          next: (result: any) => {
            let gridData = result;
            gridData.actions = this.mapUserAccess(
              gridData.actions,
              this.userAccess
            );
            let transferButton = this.buttons.find(
              (b: any) => b.id === 'Transfer'
            );
            if (transferButton && this.config?.isTransferable) {
              transferButton.isDisabled = false;
            }
            let closeButton = this.buttons.find((b: any) => b.id === 'Close');
            if (closeButton && !this.config?.isTransferable) {
              closeButton.isDisabled = false;
            }
            let locationColumn = gridData?.configuration?.columns?.find(
              (col: any) => col.mappingColumn == 'locationId'
            );
            gridData.data?.forEach((row: any) => {
              row['statusName,'] = row.statusName
                ? '<span class="badge badge-success">' +
                  row.statusName +
                  '</span>'
                : '';
              row['statusName-'] = `${row.statusName}`;
              row[
                'reportedBy,emailAddress,mobileNo'
              ] = `<div class="d-inline-block align-top mr-2"><a><img src='assets/images/empty-profile.png' width="32" height="32" alt=""></a></div>
            <div class="d-inline-block"><a class="text-body font-weight-semibold">${
              row.reportedBy ?? ''
            }</a>
            <div class="text-muted font-size-sm">${row.emailAddress ?? ''}</div>
            <span> ${row.mobileNo ?? ''}</span></div>`;
              row[
                'reportedBy-emailAddress-mobileNo'
              ] = `${row.reportedBy}, ${row.emailAddress}, ${row.mobileNo}`;

              row[
                'buildingName,locationName'
              ] = `<div><a class="text-body font-weight-semibold">${row.buildingName}</a>
            <div class="text-muted font-size-sm">${row.locationName}</div></div>`;
              row[
                'buildingName-locationName'
              ] = `${row.buildingName}, ${row.locationName}`;

              row[
                'typeName,subTypeName'
              ] = `<div><a class="text-body font-weight-semibold">${
                row.typeName
              }</a>
            <div class="text-muted font-size-sm">${
              row.subTypeName ?? 'NA'
            }</div></div>`;
              row[
                'typeName-subTypeName'
              ] = `${row.typeName}, ${row.subTypeName}`;

              row[
                'assetCode,assetName'
              ] = `<div><a class="text-body font-weight-semibold">${
                row.assetCode ?? 'NA'
              }</a>
            <div class="text-muted font-size-sm">${
              row.assetName ?? ''
            }</div></div>`;
              row['assetCode-assetName'] = `${row.assetCode ?? ''}, ${
                row.assetName ?? ''
              }`;
              if (
                locationColumn &&
                locationColumn?.columnFormat === this.ColumnFormat.HTML
              ) {
                row['locationDetailsId'] = row.locationId;
                row['locationId'] =
                  row.locationId === 0
                    ? ''
                    : `<div class="position-relative w-100 text-center">
                <i class="bi bi-geo-alt-fill cursor-pointer"></i>`;
              }
            });
            this.gridFilter.isCollapsed = true;
            if (gridData.data?.length > 0) {
              this.gridFilter.toggleShow();
              this.dataService.filterApplied({
                isFilterApplied: true,
                noOfFiltersApplied: 1
              });
            }
            this.gridData = gridData;
          },
          error: (e: any) => {
            this.alertService.error('Error Retrieving Task !!', {
              id: 'alert-taskLog'
            });
            console.error(e);
          },
          complete: () => {}
        });
    }
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

  edit(item: any) {
    let navState = this.navService.getNavigationState();
    navState.currentLogId = item ? item.id : 0;
    this.navService.setNavigationState(navState);
    let navigateTo = '';
    switch (this.serviceTypeId) {
      case 1:
        navigateTo = Navigate.PPM_LOG;
        break;
      case 2:
        navigateTo = Navigate.REACTIVE_LOG;
        break;
      case 3:
        navigateTo = Navigate.CORRECTIVE_LOG;
        break;
      case 4:
        navigateTo = Navigate.SCHEDULED_LOG;
    }
    let statusId = this.route.snapshot.data['statusId'];
    this.router.navigate([
      navigateTo + (statusId > 0 ? statusId : ServiceStatus.OPEN)
    ]);
  }

  export(item: any) {
    let exportDetails = {
      id: item.id,
      reportType: 1,
      fileType: 1
    };
    this.apiService
      .ExportTaskLog('FileExport/ExportToPdf', exportDetails)
      .subscribe({
        next: (result: any) => {
          this.blob = new Blob([result], { type: 'application/pdf' });
          var downloadURL = window.URL.createObjectURL(result);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = item.securityInfoId + '.pdf';
          link.click();
        },
        error: (e: any) => {
          this.alertService.error('Error Exporting Task Log !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  selectionChange(isChecked: any): void {
    this.grid.selectedRows = isChecked;
  }

  transfer(item: any) {
    this.selectedWorkOrders.push(item.id);
    this.config['isTransferable'] = true;
    this.selectResources();
  }

  selectResources(): void {
    if (this.selectedWorkOrders?.length > 0) {
      let data = {
        resources: null,
        taskLogId: this.navState.currentLogId,
        existingResources: null,
        loadAllResources: true,
      };
      const dialogRef = this.dialog
        .open(PopupComponent, {
          data: {
            title: 'Resource Details',
            contentId: 1,
            contentName: 'Resources',
            data: data,
            projectId: this.filter?.projectId,
            api: this.config?.apiEndpoint
          },
          autoFocus: true,
          maxHeight: '90vh',
          width: '80vw',
          disableClose: false
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            let transcript = {
              taskLogIds: this.selectedWorkOrders?.join(),
              comments: result?.comments,
              resourceId: result?.resourceIds,
              isMobile: false,
              serviceTypeId: this.serviceTypeId
            };
            this.addComments(transcript);
          }
        });
    } else {
      this.alertService.error('No records selected !!', {
        id: 'alert-issuer'
      });
    }
  }

  closeWorkOrder(): void {
    if (this.selectedWorkOrders?.length > 0) {
      let data = {
        resources: this.filter?.masterData?.locs,
        taskLogId: null,
        existingResources: null,
        loadAllResources: true,
        serviceType: this.serviceTypeId
      };
      const dialogRef = this.dialog
        .open(PopupComponent, {
          data: {
            title: 'Work Order Details',
            contentId: 2,
            contentName: 'Work Orders',
            data: data,
            api: this.config?.apiEndpoint
          },
          autoFocus: true,
          maxHeight: '90vh',
          width: '40vw',
          disableClose: false
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            let transcript = {
              taskLogIds: this.selectedWorkOrders?.join(),
              comments: '',
              serviceTypeId: this.serviceTypeId,
              hseqAnswer: result.hseq,
              checkListAnswer: result.checklist,
              locId: result.loc,
            };
            this.addComments(transcript);
          }
        });
    } else {
      this.alertService.error('No records selected !!', {
        id: 'alert-issuer'
      });
    }
  }

  addComments(transcript: any): void {
    const dialogRef = this.dialog
      .open(OnHoldComponent, {
        data: {
          title: 'Reason for ' + (this.config?.isTransferable ?'Transfer':'Close'),
          contentId: 3,
          data: ''
        },
        autoFocus: true,
        maxHeight: '90vh',
        width: '80vw',
        disableClose: true
      })
      .afterClosed()
      .subscribe((userComments: any) => {
        if (userComments?.comments) {
          transcript.comments = userComments?.comments;
          this.processWorkOrders(transcript);
        }
      });
  }

  processWorkOrders(transcript?: any): void {
    this.apiService
      .UpdatePPMStatus(
        this.config?.isTransferable
          ? 'TaskLog/TransferWorkOrders'
          : 'TaskLog/BulkCloseWorkOrders',
        transcript,
        this.config?.apiEndpoint
      )
      .subscribe({
        next: (result) => {
          let showMsg = '';
          if (result) {
            showMsg =
              '<table class="table datatable-basic"><thead class="bg-secondary text-white"><tr><th>Work Order Id</th><th>Message</th><th>Status</th></tr></thead><tbody>';
            result.forEach((msg: any) => {
              showMsg +=
                '<tr><td>' +
                msg.id +
                '</td><td>' +
                msg.message +
                '</td><td><i class="bi ' +
                (msg.isSuccess
                  ? 'text-success bi-check'
                  : 'text-danger bi-exclamation') +
                '-circle-fill"></i></td></tr>';
            });
            showMsg += '</tbody></table>';
            const dialogRef = this.dialog
              .open(PopupComponent, {
                data: {
                  title:
                    (this.config?.isTransferable ? 'Transfer' : 'Close') +
                    ' Status',
                  contentId: 0,
                  contentName: 'Transfer',
                  data: showMsg
                },
                autoFocus: true,
                maxHeight: '90vh',
                width: '80vw',
                disableClose: true
              })
              .afterClosed()
              .subscribe((resp: any) => {
                this.gridFilter?.setFilter();
              });
          } else {
            this.alertService.error(
              'Error ' +
                (this.config?.isTransferable ? 'Transfering' : 'Closing') +
                ' WorkOrder !!',
              {
                id: 'alert-issuer'
              }
            );
          }
        },
        error: (e) => {
          this.alertService.error(
            'Error ' +
              (this.config?.isTransferable ? 'Transfering' : 'Closing') +
              ' WorkOrder !!',
            {
              id: 'alert-issuer'
            }
          );
          console.error(e);
        },
        complete: () => {}
      });
  }

  protected override buttonClicked(buttonType: any): void {
    if (buttonType === 'Transfer') {
      this.selectedWorkOrders = this.grid?.selectedRows;
      this.selectResources();
    } else if (buttonType === 'Close') {
      this.selectedWorkOrders = this.grid?.selectedRows;
      this.closeWorkOrder();
    }
  }
}
