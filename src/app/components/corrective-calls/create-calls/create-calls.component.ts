import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ServiceType } from 'src/app/models/enums/ServiceType.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { LogMode } from './../../../models/enums/LogMode.enum';
import { ChecklistComponent } from './checklist/checklist.component';

import buttons from '../../../helpers/buttons.json';
import { ServiceStatus } from './../../../models/enums/ServiceStatus.enum';
import { LocalizedDatePipe } from './../../../pipes/localized-date.pipe';
import { SweetAlertService } from './../../../services/sweet-alert.service';
import { GeneralComponent } from './general/general.component';
import { LeftLayoutComponent } from './left-layout/left-layout.component';
import { OnHoldComponent } from './on-hold/on-hold.component';
import { ResourceComponent } from './resource/resource.component';
import { SubTaskComponent } from './sub-task/sub-task.component';

@Component({
  selector: 'app-create-calls',
  templateUrl: './create-calls.component.html',
  styleUrls: ['./create-calls.component.scss']
})
export class CreateCallsComponent extends CommonComponent implements OnInit {
  tabs: any[] = [
    { tabId: 1, isCollapsed: true, name: 'tab-pane' },
    { tabId: 2, isCollapsed: true, name: 'open-cases' }
  ];

  statuses: any[] = [];
  tabId: number = 0;
  pageHeader: string = '';
  badgeTitle: string = '';
  pageDescription: string = '';
  statusId: number = 0;
  taskLogData: any = {};
  serviceTypeId: number = 0;
  isActivityOpened: boolean = false;
  mode: LogMode = LogMode.CREATE;
  ServiceType = ServiceType;
  ServiceStatus = ServiceStatus;
  statusBadge: string = 'badge-danger badge-pill';
  LogMode = LogMode;

  @ViewChild('location') locationForm!: LeftLayoutComponent;
  @ViewChild('general') generalForm!: GeneralComponent;
  @ViewChild('checklist') checklistForm!: ChecklistComponent;
  @ViewChild('resources') resources!: ResourceComponent;
  @ViewChild('subtasks') subTasks!: SubTaskComponent;
  blob!: Blob;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private navService: NavigationService,
    private alertService: SweetAlertService,
    private localDatePipe: LocalizedDatePipe
  ) {
    super();
    this.isEditable = false;
    this.config['pageType'] = this.route.snapshot.data['pageLinks'];
    this.serviceTypeId = this.route.snapshot.data['serviceType'];
    this.statusId = this.route.snapshot.data['statusId'];
    if (!this.statusId) {
      this.route.params.subscribe((param: any) => {
        if (!isNaN(param['statusId'])) {
          this.statusId = parseInt(param['statusId']);
        }
      });
    }
    this.navState = navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState.subMenu);
    this.config['pageTitle'] = this.route.snapshot.data['pageTitle'];
    if (this.router.url.includes('copy')) {
      this.navState.currentLogId = 0;
      this.navService.setNavigationState(this.navState);
      this.isEditable = true;
    } else if (this.router.url.includes('create')) {
      this.navState.currentLogId = 0;
      this.navState.currentLog = null;
      this.navState.isHeaderCall = false;
      this.navService.setNavigationState(this.navState);
      this.isEditable = this.navState.subMenu?.canAdd ?? false;
    } else if (
      this.statusId === ServiceStatus.CLOSED ||
      this.statusId === ServiceStatus.ARCHIVED ||
      !this.navState.subMenu?.canUpdate
    ) {
      this.mode = LogMode.LOCKED;
    } else {
      this.mode = LogMode.EDIT;
    }
  }

  ngOnInit(): void {
    this.activateButtons();
  }

  getAdditionalDetails(currentLogId: any): void {
    this.apiService
      .GetTaskLog('TaskLog/GetTaskLogAdditionalInfo/' + currentLogId)
      .subscribe({
        next: (result: any) => {
          this.masterData = result;
          this.checklistForm?.updateAnswers(
            this.tabId === 2 ? result?.checkListItems : result?.hseqListItems
          );
        },
        error: (e: any) => {
          this.alertService.error('Error retreving additional information !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  setMasterData(data: any): void {
    this.masterData = data;
  }

  getWoType(serviceType: number): string {
    let serviceTitle = '';
    switch (serviceType) {
      case 1:
        serviceTitle = 'PM Log';
        break;
      case 2:
        serviceTitle = 'Reactive W/O';
        break;
      case 3:
        serviceTitle = 'Corrective W/O';
        break;
    }
    return serviceTitle;
  }

  getLogGrid(): void {
    // if (!this.tabs[1].isCollapsed) {
    let serviceTypeId = this.route.snapshot.data['serviceType'];
    this.gridData.configuration.columns = [];
    this.apiService
      .GetLog(
        `TaskLog/GetTaskLogOpenCases/${this.navState.currentLogId}/${serviceTypeId}`,
        null
      )
      .subscribe({
        next: (result: any) => {
          let gridData = result;
          gridData.data?.forEach((row: any) => {
            row['statusName'] = row.statusName
              ? '<span class="badge badge-success">' +
                row.statusName +
                '</span>'
              : '';
            row[
              'reportedBy,emailAddress,mobileNo'
            ] = `<div class="d-inline-block align-top mr-2"><a><img src='assets/images/empty-profile.png' class="rounded-circle" width="32" height="32" alt=""></a></div>
            <div class="d-inline-block"><a class="text-body font-weight-semibold">${row.reportedBy}</a>
            <div class="text-muted font-size-sm">${row.emailAddress}</div>
            <span> ${row.phoneNo}</span></div>`;
            row[
              'buildingName,locationName'
            ] = `<div><a class="text-body font-weight-semibold">${row.buildingName}</a>
            <div class="text-muted font-size-sm">${row.locationName}</div></div>`;
            row[
              'typeName,subTypeName'
            ] = `<div><a class="text-body font-weight-semibold">${
              row.typeName
            }</a>
            <div class="text-muted font-size-sm">${
              row.subTypeName ?? 'NA'
            }</div></div>`;
            row[
              'assetCode,assetName'
            ] = `<div><a class="text-body font-weight-semibold">${
              row.assetCode ?? 'NA'
            }</a>
            <div class="text-muted font-size-sm">${
              row.assetName ?? ''
            }</div></div>`;
          });
          gridData.actions.canSelect = false;
          this.gridData = gridData;
        },
        error: (e: any) => {
          this.alertService.error('Error Retrieving Open Cases !!', {
            id: 'open-cases'
          });
          console.error(e);
        },
        complete: () => {}
      });
    // }
  }

  edit(item: any) {
    let navState = this.navService.getNavigationState();
    navState.currentLogId = item ? item.id : 0;
    this.generalForm.setLogDateTime(true);
    this.navService.setNavigationState(navState);
    this.navigateLog(LogMode.EDIT);
  }

  toggleTabs(index: number): void {
    if (this.pageHeader) {
      this.tabs[index].isCollapsed = !this.tabs[index].isCollapsed;
      this.tabs.find((t) => t.tabId !== this.tabs[index].tabId).isCollapsed =
        true;
      if (this.tabs[0].isCollapsed) {
        this.tabId = 0;
        this.getLogGrid();
      }
    }
  }

  openTab(tabId: number) {
    if (this.pageHeader) {
      this.closeTabs();
      if (this.tabId == tabId) {
        this.tabId = 0;
        return;
      }
      if (
        (tabId === 1 || tabId === 9) &&
        (this.tabId === 0 || this.tabId === 12)
      ) {
        this.getAdditionalDetails(this.navState.currentLogId);
      }
      this.tabId = tabId;
      this.tabs[1].isCollapsed = true;
    }
  }

  closeTabs(): void {
    if (this.statusId === ServiceStatus.CLOSED) {
      if (this.checklistForm?.statusId) {
        this.checklistForm.statusId = ServiceStatus.CLOSED;
      }
      if (this.resources?.statusId) {
        this.resources.statusId = ServiceStatus.CLOSED;
      }
      if (this.subTasks?.statusId) {
        this.subTasks.statusId = ServiceStatus.CLOSED;
      }
    }
  }

  buttonClicked(buttonType: any): void {
    if (buttonType == 'Save') {
      this.saveOrEdit();
    } else if (buttonType == 'Cancel') {
      this.navigateLog(LogMode.GRID);
    } else if (
      buttonType === 'Assigned' ||
      buttonType === 'Active' ||
      buttonType === 'Complete' ||
      buttonType === 'Remove On-Hold' ||
      buttonType === 'Archive'
    ) {
      let statusId = this.statuses.find((s: any) => s.name === buttonType).id;
      if (buttonType === 'Complete') {
        if (
          this.serviceTypeId === ServiceType.PM &&
          (this.masterData?.checkListItems?.questionAnswers?.length !==
            this.masterData?.checkListItems?.questions?.length ||
            this.masterData?.checkListItems?.questionAnswers?.some(
              (ans: any) => ans.answerId === 0
            ))
        ) {
          this.alertService.error('Please Complete All Checklist !!', {
            id: 'alert-taskLog'
          });
          return;
        }
        if (
          this.masterData?.hseqListItems?.questionAnswers?.length !==
          this.masterData?.hseqListItems?.questions?.length
        ) {
          this.alertService.error('Please fill HSEQ Questionnaire !!', {
            id: 'alert-taskLog'
          });
          return;
        }
        if (this.masterData?.taskResources?.length < 1) {
          this.alertService.error('No resource have been assigned !!', {
            id: 'alert-taskLog'
          });
          return;
        }
      }
      this.updateStatus(statusId);
    } else if (buttonType === 'On-Hold' || buttonType === 'Add On-Hold') {
      this.openPopup(1);
    } else if (buttonType === 'New w/o') {
      this.copyLog();
    } else if (buttonType === 'Export') {
      this.exportData();
    }
  }

  navigateLog(mode: LogMode) {
    let navigateTo = '';
    if (mode === LogMode.CREATE) {
      switch (this.serviceTypeId) {
        case 1:
          navigateTo = Navigate.PPM_LOG_CREATE;
          break;
        case 2:
          navigateTo = Navigate.REACTIVE_LOG_CREATE;
          break;
        case 3:
          navigateTo = Navigate.CORRECTIVE_LOG_CREATE;
          break;
      }
    }
    if (mode === LogMode.COPY) {
      switch (this.serviceTypeId) {
        case 1:
          navigateTo = Navigate.PPM_LOG_COPY;
          break;
        case 2:
          navigateTo = Navigate.REACTIVE_LOG_COPY;
          break;
        case 3:
          navigateTo = Navigate.CORRECTIVE_LOG_COPY;
          break;
      }
    }
    if (mode === LogMode.EDIT) {
      switch (this.serviceTypeId) {
        case 1:
          navigateTo = Navigate.PPM_LOG + (this.statusId ?? ServiceStatus.OPEN);
          break;
        case 2:
          navigateTo =
            Navigate.REACTIVE_LOG + (this.statusId ?? ServiceStatus.OPEN);
          break;
        case 3:
          navigateTo =
            Navigate.CORRECTIVE_LOG + (this.statusId ?? ServiceStatus.OPEN);
          break;
      }
    } else if (mode === LogMode.GRID) {
      let type =
        this.statusId === 3
          ? 'closed'
          : this.statusId === 6
          ? 'archived'
          : 'open';
      switch (this.serviceTypeId) {
        case 1:
          navigateTo = Navigate.PPM_CALLS + type;
          break;
        case 2:
          navigateTo = Navigate.REACTIVE_CALLS + type;
          break;
        case 3:
          navigateTo = Navigate.CORRECTIVE_CALLS + type;
          break;
      }
    }
    this.router.navigate([navigateTo]);
  }

  exportData() {
    let exportDetails = {
      id: this.navState.currentLogId,
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
          link.download = this.pageHeader + '.pdf';
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

  copyLog() {
    let client = {
      client: this.locationForm.selectedClient,
      logId: this.navState.currentLogId
    };
    let taskLog = {
      ...this.generalForm.getFormData(),
      ...this.locationForm.getFormData(),
      ...client
    };
    this.navState.currentLog = taskLog;
    this.navService.setNavigationState(this.navState);
    this.navigateLog(LogMode.COPY);
  }

  override save(): void {
    let taskLog = {
      ...this.generalForm.getFormData(),
      ...this.locationForm.getFormData()
    };
    if (this.generalForm?.hasAsset && (!taskLog.code || taskLog.code === '')) {
      this.alertService.error(
        'Cannot Save Task Log as asset is not assigned!!',
        {
          id: 'alert-taskLog'
        }
      );
      return;
    }
    let taskLogData = {
      id: this.generalForm?.taskLogInfo?.id ?? 0,
      title: taskLog.title,
      taskSlNo: 0,
      securityInfoId: '',
      serviceTypeId: this.route.snapshot.data['serviceType'],
      dueDate: new Date(),
      reportedById: parseInt(taskLog.reporter),
      reportedByName: taskLog.name,
      createdBy: taskLog.reporter,
      reportedDate: taskLog.reportedDt,
      typeId: taskLog.type?.id ?? taskLog?.type,
      subTypeId: taskLog.subType?.id ?? taskLog?.subType,
      categoryId: taskLog.category?.id ?? taskLog?.category,
      channelId: taskLog.channel?.id ?? taskLog?.channel,
      modeId: taskLog.mode,
      locId: taskLog.loc?.id ?? taskLog?.loc,
      locDate: taskLog.locDate,
      summary: taskLog.updateSummary ?? taskLog?.summary,
      priorityId: taskLog.priority?.id ?? taskLog?.priority,
      faultCodeId: taskLog.faultCode?.id ?? taskLog?.faultCode,
      estimatedStockCost: taskLog.estStockCost,
      estimatedLabourCost: taskLog.estLabourCost,
      estimatedTime: taskLog.estTime,
      assetId: taskLog.assetId,
      assetDescription: taskLog.description,
      assetCode: taskLog.code,
      assetName: '',
      hasAsset: taskLog.hasAsset ?? false,
      projectId: taskLog.project?.id ?? taskLog.project,
      buildingId: taskLog.building?.id ?? taskLog.building,
      floorId: taskLog.floor?.id ?? taskLog?.floor,
      unitId: taskLog.unit?.id ?? taskLog?.unit,
      roomId: taskLog.room?.id ?? taskLog?.room,
      reporterTypeId: taskLog.reportingUserTypeId,
      reporterSubTypeId: taskLog.reportingUserSubTypeId,
      mobileCode: taskLog.countryId,
      mobileNo: taskLog.mobile,
      emailAddress: taskLog.email,
      statusId: this.route.snapshot.data['statusId'],
      taskInstructionId: taskLog.taskInstructionId,
      refNumber: taskLog.refNumber
    };
    if (taskLogData?.mobileNo == '' && taskLogData?.emailAddress == '') {
      this.alertService.error('Please Enter Email or Mobile No', {
        id: 'alert-taskLog'
      });
      return;
    }
    this.apiService
      .AddOrUpdateTaskLog('TaskLog/AddOrUpdateTaskLog', taskLogData)
      .subscribe({
        next: (result: any) => {
          this.alertService
            .success('Task Log Saved Successfully !!', { id: 'alert-taskLog' })
            .then(() => this.edit({ id: result }));
        },
        error: (e: any) => {
          this.alertService.error('Error Saving Task Log !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  updateActions(event: any) {
    this.statuses = event;
    let actionBtn = this.buttons.find((b: any) => b.id === 'Actions');
    if (actionBtn) {
      actionBtn.dropdownList = event.map((e: any) => e.name.toString());
    }
    this.generalForm?.generalForm?.valueChanges.subscribe(() => {
      this.updateButtons();
    });
    this.generalForm?.assetForm?.valueChanges.subscribe(() => {
      this.updateButtons();
    });
    this.locationForm?.locationForm?.valueChanges.subscribe(() => {
      this.updateButtons();
    });
    this.locationForm?.reportedbyForm?.valueChanges.subscribe(() => {
      this.updateButtons();
    });
  }

  updateLog(event: any) {
    if (event?.securityInfoId) {
      let type = this.generalForm
        ?.getMasterData()
        .types.find((t: any) => t.id === event.typeId)?.name;
      this.pageHeader = event.securityInfoId?.toUpperCase();
      this.config.pageTitle = this.pageHeader;
      this.pageDescription =
        'Due Date : ' +
        this.localDatePipe.transform(event.dueDate, 'dd-MMM-yyyy HH:mm', false);
      this.badgeTitle = this.statuses.find(
        (s: any) => s.id === event.statusId
      )?.name;
      this.taskLogData['feedback'] = {
        feedbackComments: event.feedbackComments,
        feedbackDate: event.feedbackDate,
        feedbackUserId: event.feedbackUserId,
        signatureUrl: event.signatureUrl,
        ratingId: event.ratingId,
        feedbackUserName: event.feedbackUserName
      };
      this.taskLogData['subTask'] = {
        subTaskStatuses: this.generalForm?.getMasterData()?.subTaskStatuses,
        subTaskTypes: this.generalForm?.getMasterData()?.subTaskTypes
      };
      this.taskLogData['statusId'] = this.generalForm.taskLogInfo?.statusId;
      this.statusId = event.statusId;
      if (this.taskLogData?.statusId === ServiceStatus.ARCHIVED) {
        this.buttons = buttons.correctiveCalls.create.filter(
          (b) => b.id !== 'Actions'
        );
      }
      this.activateButtons();
      this.updateActionButton(event);
    }
  }

  updateActionButton(tLog: any) {
    let actionBtn = this.buttons.find((b: any) => b.id === 'Actions');
    if (actionBtn) {
      if (
        tLog?.statusId === ServiceStatus.OPEN ||
        tLog?.statusId === ServiceStatus.ASSIGNED
      ) {
        this.statusBadge =
          tLog?.statusId === ServiceStatus.OPEN
            ? 'badge-danger badge-pill'
            : 'badge-pink badge-pill';
        actionBtn.dropdownList = this.statuses
          .filter(
            (e: any) =>
              e.id !== tLog?.statusId &&
              (e.id === ServiceStatus.CLOSED || e.id === ServiceStatus.ONHOLD)
          )
          .map((e: any) => e.name.toString());
      } else if (tLog?.statusId === ServiceStatus.ONHOLD) {
        this.statusBadge = 'badge-dark badge-pill';
        actionBtn.dropdownList = this.statuses
          .filter(
            (e: any) =>
              e.id !== tLog?.statusId && e.id === ServiceStatus.REMOVE_ONHOLD
          )
          .map((e: any) => e.name.toString());
        actionBtn.dropdownList.push('Add On-Hold');
      } else if (tLog?.statusId === ServiceStatus.CLOSED) {
        this.statusBadge = 'badge-success badge-pill';
        actionBtn.dropdownList = this.statuses
          .filter(
            (e: any) =>
              e.id !== tLog?.statusId && e.id === ServiceStatus.ARCHIVED
          )
          .map((e: any) => e.name.toString());
      }
    }
  }

  activateButtons() {
    let btns = buttons.correctiveCalls.create;
    if (!this.userAccess?.canExport) {
      btns = btns.filter((button) => button.id !== 'Export');
    }
    if (!this.userAccess?.canAdd) {
      btns = btns.filter((button) => button.id !== 'Save');
    }
    if (this.navState.currentLogId === 0) {
      this.isEditable = this.userAccess?.canAdd ?? false;
      btns = btns.filter(
        (button) =>
          button.id !== 'Actions' &&
          button.id !== 'New w/o' &&
          button.id !== 'Export'
      );
    }
    if (this.statusId === ServiceStatus.CLOSED) {
      btns = btns.filter(
        (button) => button.id !== 'Save' && button.id !== 'Cancel'
      );
    } 
    else if (
      this.taskLogData?.statusId === ServiceStatus.ARCHIVED ||
      this.statusId === ServiceStatus.ARCHIVED
    ) {
      btns = [];
    } else if (this.mode === LogMode.LOCKED) {
      btns = btns.filter(
        (button) => button.id !== 'Actions' && button.id !== 'New w/o'
      );
    } else if(this.navState.currentLogId !== 0 && this.serviceTypeId === 2){
      this.isEditable = this.userAccess?.canAdd ?? false;
      btns = btns.filter(
        (button) =>
          button.id !== 'Actions' &&
          button.id !== 'Save'
      );
    }
    this.buttons = btns;
    this.updateButtons();
  }

  updateStatus(statusId: number): void {
    let navState = this.navService.getNavigationState();
    this.apiService
      .AddOrUpdateTaskLog(
        `TaskLogOperations/UpdateTaskLogStatus?taskLogId=${navState.currentLogId}&statusId=${statusId}&serviceTypeId=` +
          this.serviceTypeId,
        null
      )
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.alertService
              .success('Task Log Saved Successfully !!', {
                id: 'alert-taskLog'
              })
              .then(() => {
                this.generalForm.getData(
                  this.generalForm?.taskLogInfo?.projectId,
                  false
                );
                if (statusId === ServiceStatus.CLOSED) {
                  this.statusId = statusId;
                  this.taskLogData.statusId = this.statusId;
                  this.closeTabs();
                  this.activateButtons();
                }
              });
          }
        },
        error: (e: any) => {
          this.alertService.error('Error Saving Task Log !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  override updateButtons(): void {
    let isFormValid =
      this.generalForm?.generalForm?.valid &&
      ((this.generalForm?.hasAsset && this.generalForm?.assetForm?.valid) || !this.generalForm.hasAsset)&&
      this.locationForm?.locationForm?.valid &&
      this.locationForm?.reportedbyForm?.valid;
    if (this.generalForm?.hasAsset) {
      let asset = this.generalForm.assetForm?.value;
      if (!asset.code || asset.code === '') {
        isFormValid = false;
      } else {
        isFormValid = isFormValid && true;
      }
    }
    let savebutton = this.buttons.find((b: any) => b.id === 'Save');
    if (savebutton) {
      savebutton.isDisabled = !isFormValid;
    }
  }

  openPopup(type: number) {
    let title = '';
    let data = {};
    switch (type) {
      case 1:
        title = 'Reason for Hold';
        data = this.generalForm.getMasterData().onHoldReasons;
        break;
    }
    const dialogRef = this.dialog
      .open(OnHoldComponent, {
        data: {
          title: title,
          contentId: type,
          data: data
        },
        autoFocus: true,
        maxHeight: '90vh',
        width: '80vw',
        disableClose: false
      })
      .afterClosed()
      .subscribe((onHold: any) => {
        if (onHold) {
          this.apiService
            .AddOrUpdateTaskLog(
              `TaskLogOperations/SaveTaskLogOnHoldReason`,
              onHold
            )
            .subscribe({
              next: (result: any) => {
                if (result) {
                  this.alertService
                    .success('Task Log Saved Successfully !!', {
                      id: 'alert-taskLog'
                    })
                    .then(() => {
                      this.generalForm.getData(
                        this.generalForm?.taskLogInfo?.projectId,
                        false
                      );
                    });
                }
              },
              error: (e: any) => {
                this.alertService.error('Error Saving Task Log !!', {
                  id: 'alert-taskLog'
                });
                console.error(e);
              },
              complete: () => {}
            });
        }
      });
  }
}
