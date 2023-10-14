import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { LogMode } from 'src/app/models/enums/LogMode.enum';
import { ServiceType } from 'src/app/models/enums/ServiceType.enum';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent extends CommonComponent {
  generalForm!: FormGroup;
  assetForm!: FormGroup;
  taskLogInfo: any = {};
  hasAsset: boolean = false;
  currentSummary: any = '';
  LogMode = LogMode;
  currentLogId: number = 0;
  isFormLoaded: boolean = false;
  refreshIntervalId: any = 0;
  ServiceType = ServiceType;
  locationInfo: any = {};

  @Input() override isEditable: boolean = false;
  @Input() serviceTypeId: number = 0;
  @Input() mode: LogMode = LogMode.CREATE;
  @Output() actionsUpdated: EventEmitter<any> = new EventEmitter();
  @Output() logUpdated: EventEmitter<any> = new EventEmitter();
  @Output() assetUpdated: EventEmitter<any> = new EventEmitter();
  @ViewChild('category') categoryDD!: DropdownComponent;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private alertService: SweetAlertService,
    private dialog: MatDialog,
    private navService: NavigationService,
    private datePipe: LocalizedDatePipe,
    private ds: DataService
  ) {
    super();
    let navState = this.navService.getNavigationState();
    if (navState.currentLogId === 0) {
      // this.getData(0);
      this.createForm();
    }
  }

  getMasterData() {
    return this.masterData;
  }

  getData(projectId?: any, updateForm: boolean = true): void {
    let navState = this.navService.getNavigationState();
    this.serviceTypeId = this.route.snapshot?.data['serviceType'];
    this.currentLogId =
      navState.currentLog?.logId && navState.currentLog.logId > 0
        ? navState.currentLog?.logId
        : navState.currentLogId;
    this.isFormLoaded = false;
    this.apiService
      .GetTaskLog(
        `TaskLog/GetTaskLogGeneralInfo/${this.currentLogId}/${this.serviceTypeId}/${projectId}`
      )
      .subscribe({
        next: (result: any) => {
          let tLog = result.taskLogInfo;
          if (updateForm) {
            this.masterData = result.configuration;
            this.filteredData = { ...this.masterData };
            this.actionsUpdated.emit(this.masterData?.taskStatuses);
            this.ds.updateLoggedByUser({
              email: tLog?.loggedByEmail,
              designation: tLog?.loggedByDesignation
            });
            this.createForm(tLog);
            if (this.currentLogId === 0) {
              this.taskLogInfo['reportedDate'] = new Date();
              this.setLogDateTime(false);
            } else {
              this.taskLogInfo = tLog;
              if (projectId > 0 && tLog?.taskInstructionId) {
                this.instructionChanged({
                  value: tLog?.taskInstructionId
                });
              }
              this.updateAsset(false);
              // this.setLoc(this.taskLogInfo?.locDate);
            }
            this.ds.updateReportedDate(this.taskLogInfo?.loggedByDate);
          } else {
            this.logUpdated.emit(tLog);
            this.taskLogInfo = tLog;
            tLog.completionDate = this.datePipe.transform(
              tLog?.completionDate,
              'dd-MMM-yyyy HH:mm'
            );
            this.taskLogInfo.completionDate = tLog?.completionDate;
          }
          this.isFormLoaded = true;
        },
        error: (e: any) => {
          this.alertService.error('Error retreving instructions !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  createForm(tLog: any = null) {
    this.generalForm = this.fb.group({
      title: [tLog?.title, Validators.required],
      reportedDt: [tLog?.reportedDate ?? new Date(), Validators.required],
      category: [tLog?.categoryId, Validators.required],
      // loc: [tLog?.locId, Validators.required],
      // locDate: [tLog?.locDate],
      summary: [tLog?.summary],
      updateSummary: [tLog?.summary],
      updateHoldSummary: [tLog?.onHoldReason],
      rejectedSummary: [tLog?.rejectedReason],
      // estStockCost: [tLog?.estimatedStockCost],
      // estLabourCost: [tLog?.estimatedLabourCost],
      // estTime: [tLog?.estimatedTime],
      closedDate: [tLog?.completionDate],
      // refNumber: [tLog?.refNumber],
      // ppmId: [tLog?.ppmCode],
      // parentWo: [tLog?.parentWorkOrder]
    });
    this.generalForm?.valueChanges.subscribe(() => {
      this.assetUpdated.emit();
    });
    this.assetForm = this.fb.group({
      code: [this.taskLogInfo?.assetCode],
      assetId: [this.taskLogInfo?.assetId],
      description: [this.taskLogInfo?.assetDescription],
      hasAsset: [this.taskLogInfo?.hasAsset]
    });
    this.isFormLoaded = true;
  }

  setLogDateTime(resetInterval: boolean) {
    if (resetInterval) {
      clearInterval(this.refreshIntervalId);
    } else if (this.refreshIntervalId === 0) {
      this.refreshIntervalId = setInterval(() => {
        this.taskLogInfo['reportedDate'] = new Date();
        this.generalForm.controls['reportedDate']?.setValue(
          this.taskLogInfo?.reportedDate
        );
        this.ds.updateReportedDate(this.taskLogInfo?.reportedDate);
      }, 60000);
    }
  }

  setAssetLocation(locationInfo: any): void {
    this.locationInfo = locationInfo;
  }

  getAssets(reset: boolean = false): void {
    let assetLocation = {
      projectId: this.locationInfo?.project?.id ?? this.locationInfo?.project,
      buildingId:
        this.locationInfo?.building?.id ?? this.locationInfo?.building,
      floorId: this.locationInfo?.floor?.id ?? this.locationInfo?.floor,
      unitId: this.locationInfo?.unit?.id ?? this.locationInfo?.unit,
      roomId: this.locationInfo?.room?.id ?? this.locationInfo?.room
    };
    // this.resetAsset(false);
    if (assetLocation?.roomId > 0) {
      this.apiService
        .GetLog('TaskLog/GetAssetsByLocation', assetLocation)
        .subscribe({
          next: (result: any) => {
            this.masterData['assets'] = result.data;
            this.filteredData = { ...this.masterData };
            this.updateAsset(true);
          },
          error: (e: any) => {
            this.alertService.error('Error retreving instructions !!', {
              id: 'alert-taskLog'
            });
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  updateAsset(showPopup: boolean, reset: boolean = false): void {
    if (reset) {
      this.assetForm.reset();
      this.hasAsset = false;
    } else {
      this.assetForm = this.fb.group({
        code: [this.taskLogInfo?.assetCode],
        assetId: [this.taskLogInfo?.assetId],
        description: [this.taskLogInfo?.assetDescription],
        hasAsset: [this.taskLogInfo?.hasAsset]
      });
      this.hasAsset = this.taskLogInfo?.hasAsset || showPopup;
      if (showPopup) {
        this.openPopup(1);
      }
    }
    if (this.taskLogInfo?.securityInfoId) {
      this.ds.updateTasklog(this.taskLogInfo);
      this.logUpdated.emit(this.taskLogInfo);
    }
  }

  instructionChanged(event: any) {
    let instructionId = event.id ?? event.value;
    let taskInstruction = this.masterData?.taskInstructions?.find(
      (t: any) => t.id === parseInt(instructionId)
    );
    let tasklog = this.taskLogInfo;
    tasklog['title'] = this.taskLogInfo?.title ?? taskInstruction?.name;
    tasklog['taskInstructionId'] = instructionId;
    tasklog['categoryId'] =
      this.taskLogInfo?.categoryId ?? taskInstruction?.categoryId;
    tasklog['estimatedLabourCost'] = taskInstruction?.estimatedLabourCost;
    tasklog['estimatedStockCost'] = taskInstruction?.estimatedStockCost;
    tasklog['estimatedTime'] = taskInstruction?.estimatedTimeInMins;
    this.taskLogInfo = tasklog;

    let generalForm = this.generalForm.value;
    generalForm.title = taskInstruction?.name ?? generalForm.title;
    generalForm.category =
      this.taskLogInfo?.categoryId ??
      taskInstruction?.categoryId ??
      generalForm.category;
    // generalForm.estLabourCost =
    //   taskInstruction?.estimatedLabourCost ?? generalForm.estLabourCost;
    // generalForm.estStockCost =
    //   taskInstruction?.estimatedStockCost ?? generalForm.estStockCost;
    // generalForm.estTime =
    //   taskInstruction?.estimatedTimeInMins ?? generalForm.estTime;
    this.generalForm.patchValue(generalForm);
  }

  // setLoc(locDate?: any) {
  //   this.taskLogInfo['locDate'] = this.datePipe.transform(
  //     locDate ? locDate : new Date(),
  //     'dd-MMM-yyyy HH:mm',
  //     locDate === undefined
  //   );
  //   this.generalForm.controls['locDate'].setValue(this.taskLogInfo['locDate']);
  // }

  openPopup(type: number) {
    let title = '';
    let contentName = '';
    let data = {};
    if (this.mode !== LogMode.LOCKED) {
      switch (type) {
        case 1:
          title = 'Asset Details';
          contentName = 'Assets';
          data = {
            assets: this.masterData?.assets,
            selectedBuilding: this.taskLogInfo.buildingId,
            isBuildingSelected: true
          };
          break;

        case 2:
          title = 'Task Instructions';
          contentName = 'TaskInstructions';
          data = {
            taskInstructions: this.masterData?.taskInstructions,
            selectTitle: this.taskLogInfo?.taskInstructionId,
            isTitleSelected: true
          };
      }

      const dialogRef = this.dialog
        .open(PopupComponent, {
          data: {
            title: title,
            contentId: this.Popups.TableData,
            contentName: contentName,
            data: data
          },
          autoFocus: true,
          maxHeight: '90vh',
          width: '80vw',
          disableClose: false
        })
        .afterClosed()
        .subscribe((result) => {
          switch (result?.contentName) {
            case 'Assets':
              let asset = result.selectedAsset;
              this.taskLogInfo['assetCode'] = asset.code;
              this.taskLogInfo['assetDescription'] = asset.description;
              let assetDetails = this.assetForm.value;
              assetDetails.assetId = asset.id;
              assetDetails.code = asset.code;
              assetDetails.description = asset.description;
              this.assetForm.patchValue(assetDetails);
              this.assetUpdated.emit();
              break;

            case 'TaskInstructions':
              this.instructionChanged({
                value: result.selectedInstruction.id
              });
          }
        });
    }
  }

  resetAsset(hasAsset: boolean) {
    if (!hasAsset) {
      let asset = {
        code: '',
        description: '',
        hasAsset: false
      };
      this.assetForm?.patchValue(asset);
      this.taskLogInfo['assetCode'] = '';
      this.taskLogInfo['assetDescription'] = '';
      this.taskLogInfo['hasAsset'] = false;
      this.assetForm?.get('assetCode')?.clearValidators();
      this.assetForm?.get('assetDescription')?.clearValidators();
    } else {
      this.assetForm?.controls['hasAsset'].setValue(true);
      this.assetForm?.get('assetCode')?.addValidators(Validators.required);
      this.assetForm
        ?.get('assetDescription')
        ?.addValidators(Validators.required);
      this.assetForm?.get('assetCode')?.markAsTouched();
    }
    this.assetUpdated.emit();
  }

  getFormData(): any {
    let generalFormValue = this.generalForm.value;
    generalFormValue['taskInstructionId'] = this.taskLogInfo.taskInstructionId;
    if (this.hasAsset) {
      this.assetForm.controls['hasAsset'].setValue(true);
      let asset = this.assetForm.value;
      if (!asset.code || asset.code === '') {
        this.alertService.error('Asset has not been selected !!', {
          id: 'alert-taskLog'
        });
        return;
      }
    }
    return { ...generalFormValue, ...this.assetForm.value };
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
      this.taskLogInfo['summary'] = generalFormValue.updateSummary;
    }
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
