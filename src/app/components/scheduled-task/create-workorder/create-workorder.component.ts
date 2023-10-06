import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LogMode } from 'src/app/models/enums/LogMode.enum';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import buttons from '../../../helpers/buttons.json';
import { CommonComponent } from '../../common/common.component';
import { ChecklistComponent } from '../../corrective-calls/create-calls/checklist/checklist.component';
import { OnHoldComponent } from '../../corrective-calls/create-calls/on-hold/on-hold.component';
import { ResourceComponent } from '../../corrective-calls/create-calls/resource/resource.component';
import { SubTaskComponent } from '../../corrective-calls/create-calls/sub-task/sub-task.component';

@Component({
  selector: 'app-create-workorder',
  templateUrl: './create-workorder.component.html',
  styleUrls: ['./create-workorder.component.scss']
})
export class CreateWorkorderComponent extends CommonComponent {
  tabs: any[] = [
    { tabId: 1, isCollapsed: true, name: 'tab-pane' },
    { tabId: 2, isCollapsed: true, name: 'open-cases' }
  ];
  accountForm!: FormGroup;
  generalForm!: FormGroup;
  reportedbyForm!: FormGroup;
  loggedby!: FormGroup;

  loggedByUser: any;
  loggedDate: Date = new Date();
  tabId: number = 0;
  statusId: number = 0;
  serviceTypeId: number = 0;
  @ViewChild('resources') resources!: ResourceComponent;
  selectedLocations: any[] = [];

  selectedLocationsData: any = {
    units: [],
    rooms: []
  };
  blob!: Blob;
  statuses: any[] = [];
  reporterSubTypes: any[] = [];
  selectedClient: any;
  selectedUserType: any;
  selectedUserSubType: any;
  selectedCountry: any;
  selectedResource: any;
  pageHeader: string = '';
  pageDescription: string = '';
  badgeTitle: any;
  currentSummary: any = '';
  statusBadge: string = 'badge-danger badge-pill';

  ServiceStatus = ServiceStatus;

  @ViewChildren('unit') unitDps!: QueryList<DropdownComponent>;
  @ViewChildren('room') roomDps!: QueryList<DropdownComponent>;
  @ViewChild('checklist') checklistForm!: ChecklistComponent;
  @ViewChild('subtasks') subTasks!: SubTaskComponent;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private router: Router,
    private route: ActivatedRoute,
    private navService: NavigationService,
    private datePipe: LocalizedDatePipe,
    private authService: AuthService,
    private dialog: MatDialog,
    private localDatePipe: LocalizedDatePipe
  ) {
    super();
    this.config['pageTitle'] = this.route.snapshot.data['pageTitle'];
    this.navState = navService.getNavigationState();
    this.config['apiUrl'] = this.route.snapshot.data['url'];
    this.getLog();
  }

  getLog() {
    this.isDataLoaded = false;
    this.apiService
      .GetTaskLog(
        `${this.config?.apiUrl}/GetTaskLogGeneralInfo/${this.navState?.currentLogId}`,
        ApiEndpoints.SCHEDULERAPI
      )
      .subscribe({
        next: (result: any) => {
          this.buttons = buttons.scheduledTask.log.create;
          this.masterData = result?.configuration;
          this.formData = result?.taskLogInfo;
          this.statuses = this.masterData?.taskStatuses;
          this.statusId = this.formData?.statusId;
          this.pageHeader = this.formData?.securityInfoId.toUpperCase();
          this.config.pageTitle = this.pageHeader;
          this.pageDescription =
            'Due Date : ' +
            this.localDatePipe.transform(
              this.formData?.dueDate,
              'dd-MMM-yyyy HH:mm',
              false
            );
          this.badgeTitle = this.statuses.find(
            (s: any) => s.id === this.formData?.statusId
          )?.name;
          this.resourceSelected(this.formData?.reportedById);
          this.selectedClient = this.masterData?.accounts[0];
          this.accountForm = this.fb.group({
            project: [this.formData?.projectId],
            building: [this.formData?.buildingId]
          });
          this.config.defaultCountryCode =
            this.navState?.currentAccount?.mainMobileCode ??
            this.config.defaultCountryCode;
          this.generalForm = this.fb.group({
            title: [this.formData?.title],
            type: [this.formData?.typeId],
            category: [this.formData?.categoryId],
            loc: [this.formData?.locId],
            subType: [this.formData?.subTypeId],
            channel: [this.formData?.channelId],
            locDate: [this.formData?.locDate],
            ppmId: [this.formData?.ppmId],
            parentWo: [this.formData?.parentWo],
            summary: [],
            updateSummary: [this.formData?.summary],
            updateHoldSummary: [this.formData?.onHoldReason],
            rejectedSummary: [this.formData?.rejectedReason],
            priority: [this.formData?.priorityId],
            faultCode: [this.formData?.faultCodeId],
            estStockCost: [this.formData?.estimatedStockCost],
            estLabourCost: [this.formData?.estimatedLabourCost],
            estTime: [this.formData?.estimatedTime],
            refNumber: [this.formData?.refNumber]
          });
          this.generalForm.valueChanges.subscribe(() => this.updateButtons());
          this.setLoc(this.formData?.locDate);
          this.selectedLocations = this.formData?.locations ?? [];
          this.activateButtons();
          this.isDataLoaded = true;
        },
        error: (e: any) => {
          this.alertService.error('Error Retrieving Scheduled Task !!', {
            id: 'alert-scheduledTask'
          });
        },
        complete: () => {}
      });
  }

  resourceSelected(resourceId: any): void {
    this.apiService
      .GetTaskLog(
        `${this.config?.apiUrl}/GetAllResources/${this.formData?.projectId ?? 0}`,
        ApiEndpoints.SCHEDULERAPI
      )
      .subscribe({
        next: (result: any) => {
          this.masterData['resources'] = result;
          let reporterType = this.masterData?.reporterTypes?.find(
            (r: any) => r.id === this.formData?.reporterTypeId
          );
          this.selectedUserType = reporterType;
          this.reporterSubTypes = this.masterData?.reporterSubTypes?.filter(
            (u: any) =>
              u.reporterTypeId === parseInt(this.formData?.reporterTypeId)
          );
          let reporterSubType = this.reporterSubTypes?.find(
            (r: any) => r.id === this.formData?.reporterSubTypeId
          );
          this.selectedUserSubType = reporterSubType;
          this.selectedCountry = this.masterData?.countries?.find(
            (code: any) =>
              code.mobileCode ===
              (this.formData?.mobileCode ?? this.config?.defaultCountryCode)
          );

          let reporter = this.masterData?.resources?.find(
            (r: any) => r.id === resourceId
          );

          this.selectedResource = reporter;
          if (this.selectedResource) {
            this.selectedResource.name = this.formData?.reportedByName;
            this.selectedResource.email = this.formData?.emailAddress;
            this.selectedResource.mobile = this.formData?.mobileNo;
          }

          this.reportedbyForm = this.fb.group({
            reporter: [this.formData?.reportedById],
            name: [this.selectedResource?.name],
            email: [this.selectedResource?.email],
            mobile: [
              this.selectedResource?.mobile,
              [
                Validators.pattern('^[0-9]*$'),
                Validators.minLength(6),
                Validators.maxLength(15)
              ]
            ],
            countryId: [this.selectedCountry?.mobileCode]
          });
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

  updateSummary() {
    let generalFormValue = this.generalForm.value;
    let currentSummary = generalFormValue.summary;
    let updateSummary = generalFormValue.updateSummary;
    if (currentSummary) {
      let currentDate = this.datePipe.transform(
        'new',
        'dd-MMM-yyyy HH:mm',
        true
      );
      let user = sessionStorage.getItem('currentUser');
      generalFormValue.updateSummary =
        currentDate +
        ' : ' +
        user +
        ' - ' +
        generalFormValue.summary +
        (updateSummary ? '\n' + updateSummary : '');
      generalFormValue.summary = '';
      this.generalForm.patchValue(generalFormValue);
      this.currentSummary = null;
      this.formData['summary'] = generalFormValue.updateSummary;
    }
  }

  setLoc(locDate?: any) {
    if (this.formData) {
      this.formData['locDate'] = this.datePipe.transform(
        locDate ? locDate : new Date(),
        'dd-MMM-yyyy HH:mm',
        locDate === undefined
      );
      this.generalForm.controls['locDate'].setValue(this.formData['locDate']);
    }
  }

  getAdditionalDetails(currentLogId: any): void {
    this.apiService
      .GetTaskLog(
        `${this.config?.apiUrl}/GetTaskLogAdditionalInfo/${currentLogId}`,
        ApiEndpoints.SCHEDULERAPI
      )
      .subscribe({
        next: (result: any) => {
          this.masterData = { ...this.masterData, ...result };
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

  public getLoggedInUser(): any {
    return this.authService.getUser();
  }

  buttonClicked(buttonType: any) {
    if (buttonType == 'Save') {
      this.saveOrEdit();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.OPEN_ST_SCHEDULE]);
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
    } else if (buttonType === 'Export') {
      this.exportData();
    }
  }

  override save(): void {
    let taskLog = {
      ...this.generalForm?.value,
      ...this.accountForm?.value,
      ...this.reportedbyForm?.value
    };
    let taskLogData = {
      id: this.formData?.id ?? 0,
      title: taskLog.title,
      taskSlNo: 0,
      securityInfoId: '',
      serviceTypeId: this.serviceTypeId,
      dueDate: new Date(),
      reportedById: parseInt(taskLog.reporter),
      reportedByName: taskLog.name,
      createdBy: taskLog.reporter,
      reportedDate: taskLog.reportedDt,
      typeId: taskLog.type,
      subTypeId: taskLog.subType,
      categoryId: taskLog.category,
      channelId: taskLog.channel,
      modeId: taskLog.mode,
      locId: taskLog.loc?.id ?? taskLog.loc,
      locDate: taskLog.locDate,
      ppmId: taskLog.ppmId,
      parentWo: taskLog.parentWo,
      summary: taskLog.updateSummary,
      priorityId: taskLog.priority,
      faultCodeId: taskLog.faultCode?.id,
      estimatedStockCost: taskLog.estStockCost,
      estimatedLabourCost: taskLog.estLabourCost,
      estimatedTime: taskLog.estTime,
      assetId: taskLog.assetId,
      assetDescription: taskLog.description,
      assetCode: taskLog.code,
      assetName: '',
      hasAsset: taskLog.hasAsset ?? false,
      projectId: taskLog.project,
      buildingId: taskLog.building,
      floorId: taskLog.floor,
      unitId: taskLog.unit,
      roomId: taskLog.room,
      reporterTypeId: taskLog.reportingUserTypeId,
      reporterSubTypeId: taskLog.reportingUserSubTypeId,
      mobileCode: taskLog.countryId,
      mobileNo: taskLog.mobile,
      emailAddress: taskLog.email,
      statusId: this.statusId,
      taskInstructionId: taskLog.taskInstructionId
    };
    this.apiService
      .AddOrUpdateTaskLog(
        `${this.config?.apiUrl}/UpdateTaskLog`,
        taskLogData,
        ApiEndpoints.SCHEDULERAPI
      )
      .subscribe({
        next: (result: any) => {
          this.alertService
            .success('Task Log Saved Successfully !!', { id: 'alert-taskLog' })
            .then(() => {});
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

  updateStatus(statusId: number): void {
    let navState = this.navService.getNavigationState();
    this.apiService
      .AddOrUpdateTaskLog(
        `TaskLogOperations/UpdateTaskLogStatus?taskLogId=${navState.currentLogId}&statusId=${statusId}&serviceTypeId=` +
          this.serviceTypeId,
        null,
        ApiEndpoints.SCHEDULERAPI
      )
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.alertService
              .success('Task Log Saved Successfully !!', {
                id: 'alert-taskLog'
              })
              .then(() => {
                this.getLog();
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

  navigateLog(mode: LogMode) {
    let navigateTo = '';
    if (mode === LogMode.GRID) {
      let type =
        this.statusId === 3
          ? 'ClosedWo'
          : this.statusId === 6
          ? 'ArchiveWo'
          : 'OpenWo';
      navigateTo = Navigate.SCHEDULE_TASKS + type;
    }
    this.router.navigate([navigateTo]);
  }

  openTab(tabId: number) {
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
    if (this.tabId == tabId) {
      this.tabId = 0;
      return;
    }
    if (this.tabId === 0) {
      this.getAdditionalDetails(this.navState.currentLogId);
    }
    this.tabId = tabId;
    this.tabs[1].isCollapsed = true;
  }

  exportData() {
    let exportDetails = {
      id: this.navState.currentLogId,
      reportType: 2,
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
          link.download = this.formData?.title + '.pdf';
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

  getTaskDetails(form: any): FormGroup {
    return form;
  }

  unitChanged(unit: any, index: any) {
    this.selectedLocationsData.rooms[index] = this.masterData?.rooms.filter(
      (room: any) => room.unitId === parseInt(unit.value)
    );
    this.roomDps.get(index)?.setToDefault();
  }

  buildingChanged(building: any, index: any, unit: any = { value: '0' }): void {
    this.unitDps.get(index)?.setToDefault();
    this.selectedLocationsData.units[index] = this.masterData?.units.filter(
      (unit: any) => unit.buildingId === parseInt(building.value)
    );
    this.unitChanged(unit, index);
  }

  openPopup(type: number) {
    let title = '';
    let data = {};
    switch (type) {
      case 1:
        title = 'Reason for Hold';
        data = this.masterData.onHoldReasons;
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
              onHold,
              ApiEndpoints.SCHEDULERAPI
            )
            .subscribe({
              next: (result: any) => {
                if (result) {
                  this.alertService
                    .success('Task Log Saved Successfully !!', {
                      id: 'alert-taskLog'
                    })
                    .then(() => {
                      this.getLog();
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

  override updateButtons(): void {
    let isFormValid =
      this.generalForm?.valid &&
      this.accountForm?.valid &&
      this.reportedbyForm?.valid;
    let savebutton = this.buttons.find((b: any) => b.id === 'Save');
    if (savebutton) {
      savebutton.isDisabled = !isFormValid;
    }
  }

  updateActions() {
    let actionBtn = this.buttons.find((b: any) => b.id === 'Actions');
    if (actionBtn) {
      if (
        this.statusId === ServiceStatus.OPEN ||
        this.statusId === ServiceStatus.ASSIGNED
      ) {
        this.statusBadge =
          this.statusId === ServiceStatus.OPEN
            ? 'badge-danger badge-pill'
            : 'badge-pink badge-pill';
        actionBtn.dropdownList = this.statuses
          .filter(
            (e: any) =>
              e.id !== this.statusId &&
              (e.id === ServiceStatus.CLOSED || e.id === ServiceStatus.ONHOLD)
          )
          .map((e: any) => e.name.toString());
      } else if (this.statusId === ServiceStatus.ONHOLD) {
        this.statusBadge = 'badge-dark badge-pill';
        actionBtn.dropdownList = this.statuses
          .filter(
            (e: any) =>
              e.id !== this.statusId && e.id === ServiceStatus.REMOVE_ONHOLD
          )
          .map((e: any) => e.name.toString());
        actionBtn.dropdownList.push('Add On-Hold');
      } else if (this.statusId === ServiceStatus.CLOSED) {
        this.statusBadge = 'badge-success badge-pill';
        actionBtn.dropdownList = this.statuses
          .filter(
            (e: any) =>
              e.id !== this.statusId && e.id === ServiceStatus.ARCHIVED
          )
          .map((e: any) => e.name.toString());
      }
    }
  }

  activateButtons() {
    let btns = buttons.scheduledTask.log.create;
    if (this.navState.currentLogId === 0) {
      this.isEditable = true;
      btns = btns.filter(
        (button) =>
          button.id !== 'Actions' &&
          button.id !== 'New w/o' &&
          button.id !== 'Export'
      );
    } else if (this.statusId === ServiceStatus.CLOSED) {
      btns = btns.filter(
        (button) => button.id !== 'Save' && button.id !== 'Cancel'
      );
    } else if (
      this.statusId === ServiceStatus.ARCHIVED ||
      this.statusId === ServiceStatus.ARCHIVED
    ) {
      btns = [];
    }
    this.buttons = btns;
    this.updateButtons();
    this.updateActions();
  }
}
