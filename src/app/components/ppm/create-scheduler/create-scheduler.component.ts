import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import buttons from '../../../helpers/buttons.json';
import { TextFieldComponent } from '../../../shared/text-field/text-field.component';


@Component({
  selector: 'app-create-scheduler',
  templateUrl: './create-scheduler.component.html',
  styleUrls: ['./create-scheduler.component.scss']
})
export class CreateSchedulerComponent extends CommonComponent {
  selectAssetForm!: FormGroup;
  setPPMForm!: FormGroup;
  serviceDetailsForm!: FormGroup;
  asset: any;
  instruction: any;
  serviceDetailsData: any = {};
  selectedBuilding: any;
  selectedResource: any;
  schedulerData: any;

  @ViewChild('lastDate') lastServiceDate!: TextFieldComponent;
  @ViewChild('nextDate') nextServiceDate!: TextFieldComponent;

  seletableData: any = {
    buildings: []
  };
  seletedData: any = {
    projects: []
  };

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private datepipe: DatePipe,
    private navService: NavigationService
  ) {
    super();
    this.isEditable = false;
    this.buttons = buttons.ppm.scheduler.create;
    this.navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState?.subMenu);
    if(!this.userAccess.canAdd){
      this.buttons = this.buttons.filter((btn) => btn.id !== 'Save')
    }
    if (this.router.url === `/${Navigate.CREATE_SCHEDULE}`) {
      this.navState.currentSchedulerId = 0;
      this.isEditable = true;
      this.getProjectData(this.navState.currentSchedulerId);
    } else {
      this.getSchedulerData(this.navState.currentSchedulerId);
      this.buttons = this.buttons.filter((b: any) => b.id !== 'Save');
    }
  }

  buttonClicked(buttonType: any) {
    if (buttonType == 'Save') {
      this.createScheduler();
    } else {
      this.router.navigate([Navigate.VIEW_SCHEDULE_GRID]);
    }
  }

  createScheduler() {
    let schedulerForm = {
      ...this.selectAssetForm.value,
      ...this.setPPMForm.value,
      ...this.serviceDetailsForm.value
    };
    let scheduler = {
      id: 0,
      ppmCode: schedulerForm.ppmCode,
      buildingId: schedulerForm.building.id,
      assetId: parseInt(schedulerForm.assetId),
      assetName: this.asset.name,
      floorId: this.asset.floorId,
      floorName: this.asset.floorName,
      location: schedulerForm.location,
      quantity: schedulerForm.qty,
      qrCodeUrl: this.asset.qrCodeUrl,
      assetImageUrl: this.asset.assetImageUrl,
      projectId: schedulerForm.project.id?? schedulerForm.project,
      taskInstructionId: schedulerForm.instructionSet,
      family: schedulerForm.family,
      priorityId: schedulerForm.priority.id?? parseInt(schedulerForm.priority),
      estimationTime: schedulerForm.estimationTime,
      estimationMen: schedulerForm.estimationMen,
      resourceCount: 1,
      stockLabCost: schedulerForm.stockLabCost,
      totalCost: schedulerForm.totalCost,
      financeCodeId: schedulerForm.financeCode.id,
      costCodeId: schedulerForm.costCode.id,
      costCenterId: schedulerForm.costCenter.id,
      resourceId: schedulerForm.resource.id,
      designation: schedulerForm.designation,
      shiftId: schedulerForm.shift?.id,
      lastService: schedulerForm.lastService,
      serviceFrequency: schedulerForm.serviceFrequency,
      serviceFrequencyTypeId: parseInt(
        schedulerForm.serviceFrequencyType?.id ??
          schedulerForm.serviceFrequencyType
      ),
      nextDueDate: schedulerForm.nextDue,
      week: schedulerForm.week, // to review
      isPermitNeeded: schedulerForm.isPermitNeeded,
      isHealthSafetyCheckNeeded: schedulerForm.isHealthSafetyCheckNeeded
    };

    this.apiService
      .AddPpm('Scheduler/AddOrUpdateSchedule', scheduler)
      .subscribe({
        next: (result) => {
          this.navState.currentSchedulerId = result;
          this.navService.setNavigationState(this.navState);
          this.alertService
            .success('Scheduler Updated Successfully!!', {
              id: 'alert-scheduler'
            })
            .then(() => {
              this.router.navigate([Navigate.VIEW_SCHEDULE]);
            });
        },
        error: (e) => {
          this.alertService.error('Error Updating Scheduler !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => { }
      });
  }

  calculateServiceDate(
    data: any,
    isNegitive: boolean = false,
    isServiceFrequencyChanged: boolean = false,
    isServiceFrequencyTypeChanged: boolean = false
  ): void {
    let serviceDetails = this.serviceDetailsForm.value;
    if (
      !isServiceFrequencyChanged &&
      !isServiceFrequencyTypeChanged &&
      serviceDetails.serviceFrequencyType &&
      serviceDetails.serviceFrequency
    ) {
      this.adjustServiceDate(serviceDetails, data, isNegitive);
    } else if (
      isServiceFrequencyChanged &&
      (serviceDetails.lastService || serviceDetails.nextDue) &&
      serviceDetails.serviceFrequencyType
    ) {
      serviceDetails.serviceFrequency = parseInt(data, 10);
      this.adjustServiceDate(
        serviceDetails,
        serviceDetails.lastService != ''
          ? serviceDetails.lastService
          : serviceDetails.nextDue,
        serviceDetails.lastService ? false : true
      );
    } else if (
      isServiceFrequencyTypeChanged &&
      (serviceDetails.lastService || serviceDetails.nextDue) &&
      serviceDetails.serviceFrequency
    ) {
      serviceDetails.serviceFrequencyType = parseInt(data, 10);
      this.adjustServiceDate(
        serviceDetails,
        serviceDetails.lastService != ''
          ? serviceDetails.lastService
          : serviceDetails.nextDue,
        serviceDetails.lastService ? false : true
      );
    }
  }

  adjustServiceDate(
    serviceDetails: any,
    date: any,
    isNegitive: boolean = true
  ): void {
    let serviceDate = new Date(date);
    switch (serviceDetails.serviceFrequencyType ?? serviceDetails.serviceFrequencyType?.id) {
      case 1:
        serviceDate.setDate(
          serviceDate.getDate() +
          1 * serviceDetails.serviceFrequency * (isNegitive ? -1 : 1)
        );
        break;
      case 2:
        serviceDate.setDate(
          serviceDate.getDate() +
          7 * serviceDetails.serviceFrequency * (isNegitive ? -1 : 1)
        );
        break;
      case 3:
        serviceDate.setMonth(
          serviceDate.getMonth() +
          serviceDetails.serviceFrequency * (isNegitive ? -1 : 1)
        );
        if (serviceDate.getMonth() == new Date(date).getMonth()) {
          serviceDate.setDate(serviceDate.getDate() - 1);
          if (serviceDate.getMonth() == new Date(date).getMonth()) {
            if (
              (0 == serviceDate.getFullYear() % 4 &&
                0 != serviceDate.getFullYear() % 100) ||
              0 == serviceDate.getFullYear() % 400
            ) {
              serviceDate.setDate(29);
            } else {
              serviceDate.setDate(28);
            }
          }
        }
        break;
      case 4:
        serviceDate.setFullYear(
          serviceDate.getFullYear() +
          serviceDetails.serviceFrequency * (isNegitive ? -1 : 1)
        );
        break;
    }
    if (isNegitive) {
      serviceDetails.lastService = this.datepipe.transform(
        new Date(serviceDate),
        'yyyy-MM-dd'
      );
      serviceDetails.nextDue = date;
      serviceDetails.week = CommonHelper.getCurrentWeek(new Date(date));
    } else {
      serviceDetails.lastService = date;
      serviceDetails.nextDue = this.datepipe.transform(
        new Date(serviceDate),
        'yyyy-MM-dd'
      );
      serviceDetails.week = CommonHelper.getCurrentWeek(new Date(serviceDate));
    }
    this.serviceDetailsForm.patchValue(serviceDetails);
    this.serviceDetailsData = serviceDetails;
    setTimeout(() => {
      this.lastServiceDate.focus();
      setTimeout(() => this.lastServiceDate.blur(), 100);
    }, 100);
    setTimeout(() => {
      this.nextServiceDate.focus();
      setTimeout(() => this.nextServiceDate.blur(), 100);
    }, 100);
  }

  getProjectData(schedulerId: number) {
    this.apiService
      .GetTaskLog(`TaskLog/GetProjectsMasterData/${schedulerId}`)
      .subscribe({
        next: (result) => {
          this.masterData = result;
          this.filteredData = { ...this.masterData };
          this.selectAssetForm = this.fb.group({
            project: [, Validators.required],
            building: [, Validators.required],
            asset: [, Validators.required],
            assetId: [, Validators.required],
            assetName: [, Validators.required],
            location: [, Validators.required],
            qty: [, Validators.required],
            qrCode: []
          });

          this.setPPMForm = this.fb.group({
            ppmCode: [],
            instructionSet: [, Validators.required],
            family: [],
            priority: [, Validators.required],
            estimationTime: [],
            estimationMen: [],
            stockLabCost: [],
            totalCost: [],
            financeCode: [],
            costCenter: [],
            costCode: [],
            resource: [],
            designation: [],
            shift: [],
            isPermitNeeded: [false],
            isHealthSafetyCheckNeeded: [false]
          });

          this.serviceDetailsForm = this.fb.group({
            lastService: ['', Validators.required],
            serviceFrequency: [, Validators.required],
            nextDue: [, Validators.required],
            serviceFrequencyType: [, Validators.required],
            week: []
          });

          this.selectAssetForm.valueChanges.subscribe((data) => {
            let savebutton = this.buttons.find((b: any) => b.id === 'Save');
            if (savebutton) {
              savebutton.isDisabled =
                !this.selectAssetForm?.valid ||
                !this.setPPMForm?.valid ||
                !this.serviceDetailsForm?.valid;
            }
          });

          this.setPPMForm.valueChanges.subscribe((data) => {
            this.updateButtons();
          });

          this.serviceDetailsForm.valueChanges.subscribe((data) => {
            this.updateButtons();
          });
          this.isDataLoaded = true;
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Scheduler !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => { }
      });
  }

  resourceChanged(resource: any) {
    this.selectedResource = this.masterData?.resources?.find(
      (c: any) => c.id === parseInt(resource?.id)
    );
  }

  projectSelected(project: any) {
    this.apiService
      .GetSchedulerById(
        `Scheduler/GetSchedulerAddtionalDataByProjectId/${project.id}`
      )
      .subscribe({
        next: (result) => {
          this.masterData = {};
          this.masterData['projects'] = this.filteredData.projects;
          this.masterData = {...this.masterData, ...result };
          this.filteredData = { ...this.masterData };
          this.resetForm();
          this.selectAsset({ id: 0 });
          this.getInstructionData(0);
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Scheduler !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => { }
      });
  }

  getSchedulerData(schedulerId: any) {
    this.apiService
      .GetSchedulerById(`Scheduler/GetSchedulerData/${schedulerId}`)
      .subscribe({
        next: (result) => {
          this.masterData = { ...this.masterData, ...result };
          this.filteredData = { ...this.masterData };
          this.schedulerData = this.masterData.schedulerData;
          let sd = this.schedulerData;
          this.selectAssetForm = this.fb.group({
            project: [sd?.projectId, Validators.required],
            building: [sd?.buildingId, Validators.required],
            asset: [sd?.assetId, Validators.required],
            assetId: [sd?.assetId, Validators.required],
            assetName: [sd?.assetName, Validators.required],
            location: [sd?.location, Validators.required],
            qty: [sd?.quantity, Validators.required],
            qrCode: [sd?.qrCodeUrl]
          });

          this.setPPMForm = this.fb.group({
            ppmCode: [sd?.ppmCode],
            project: [sd?.projectId, Validators.required],
            instructionSet: [sd?.taskInstructionId, Validators.required],
            family: [sd?.family],
            priority: [sd?.priorityId, Validators.required],
            estimationTime: [sd?.estimationTime],
            estimationMen: [sd?.estimationMen],
            stockLabCost: [sd?.stockLabCost],
            totalCost: [sd?.totalCost],
            financeCode: [sd?.financeCodeId, Validators.required],
            costCenter: [sd?.costCenterId, Validators.required],
            costCode: [sd?.costCodeId, Validators.required],
            resource: [sd?.resourceId, Validators.required],
            designation: [sd?.designation],
            shift: [sd?.shiftId],
            isPermitNeeded: [sd?.isPermitNeeded ?? false],
            isHealthSafetyCheckNeeded: [sd?.isHealthSafetyCheckNeeded ?? false]
          });

          this.serviceDetailsForm = this.fb.group({
            lastService: ['', Validators.required],
            serviceFrequency: [sd?.serviceFrequency, Validators.required],
            nextDue: [Validators.required],
            serviceFrequencyType: [
              sd?.serviceFrequencyTypeId,
              Validators.required
            ],
            week: [sd?.week]
          });

          this.selectAssetForm.valueChanges.subscribe((data) => {
            let savebutton = this.buttons.find((b: any) => b.id === 'Save');
            if (savebutton) {
              savebutton.isDisabled =
                !this.selectAssetForm?.valid ||
                !this.setPPMForm?.valid ||
                !this.serviceDetailsForm?.valid;
            }
          });

          this.setPPMForm.valueChanges.subscribe((data) => {
            this.updateButtons();
          });

          this.serviceDetailsForm.valueChanges.subscribe((data) => {
            this.updateButtons();
          });
          this.selectAsset({ id: sd?.assetId });
          this.getInstructionData(sd?.taskInstructionId);
          if (sd?.buildingId) {
            this.serviceDetailsData['serviceFrequency'] = sd?.serviceFrequency;
            this.serviceDetailsData['serviceFrequencyType'] =
              sd?.serviceFrequencyTypeId;
            this.serviceDetailsData['week'] = sd?.week;
            let lastService = this.datepipe.transform(
              new Date(sd?.lastService),
              'yyyy-MM-dd'
            );
            this.calculateServiceDate(lastService);
          }
          this.isDataLoaded = true;
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Scheduler !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => { }
      });
  }

  override updateButtons(): void {
    let savebutton = this.buttons.find((b: any) => b.id === 'Save');
    if (savebutton) {
      savebutton.isDisabled =
        !this.selectAssetForm?.valid ||
        !this.setPPMForm?.valid ||
        !this.serviceDetailsForm?.valid;
    }
  }

  getAssetData(building: any, selectedAssetId?: any, selectedProjectId?: any) {
    this.apiService
      .GetAssetForScheduler('Scheduler/GetAssetsByBuilding', building?.id)
      .subscribe({
        next: (result) => {
          this.masterData['assets'] = result;
          this.filteredData = { ...this.masterData };
          if (selectedAssetId) {
            this.selectAsset({ id: selectedAssetId });
            this.getTasksData({ id: selectedProjectId });
          } else {
            this.selectAsset({ id: 0 });
          }
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Asset !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => { }
      });
  }

  selectAsset(asset: any) {
    this.asset = this.masterData?.assets?.find((a: any) => a.id == asset.id);
    let assetData = this.selectAssetForm.value;
    assetData.assetId = asset?.id;
    assetData.assetName = this.asset?.name;
    assetData.location = this.asset?.floorName;
    assetData.qrCode = this.asset?.qrCodeUrl;
    assetData.qty = this.asset?.quantity;
    this.selectAssetForm.patchValue(assetData);
  }

  getTasksData(project: any) {
    this.apiService.GetTaskByProjectId(project.id).subscribe({
      next: (result) => {
        this.masterData['resources'] = result.resources;
        this.masterData['taskInstructions'] = result.taskInstructions;
        this.filteredData = { ...this.masterData };
        if (this.schedulerData?.taskInstructionId) {
          this.getInstructionData(this.schedulerData?.taskInstructionId);
          this.resourceChanged({
            id: this.schedulerData?.resourceId
          });
        }
      },
      error: (e) => {
        this.alertService.error('Error Retrieving Asset !!', {
          id: 'alert-scheduler'
        });
        console.error(e);
      },
      complete: () => { }
    });
  }

  getInstructionData(instruction: any) {
    this.apiService
      .GetTaskInstructionById(instruction ?? instruction?.id)
      .subscribe({
        next: (result) => {
          this.instruction = result.taskInstruction;
          let ppmData = this.setPPMForm.value;
          ppmData.instructionSet = this.instruction?.id;
          ppmData.estimationMen = this.instruction?.noOfStaff;
          ppmData.estimationTime = this.instruction?.estimatedTimeInMins;
          ppmData.ppmCode = this.asset?.id;
          ppmData.priority =
            this.schedulerData?.priorityId ?? this.instruction?.priorityId;
          ppmData.stockLabCost = this.instruction?.estimatedStockCost;
          ppmData.totalCost = this.instruction?.estimatedLabourCost;
          this.setPPMForm.patchValue(ppmData);
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Asset !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => { }
      });
  }

  resetForm() {
    this.selectAssetForm.controls['building'].setValue(null);
    this.selectAssetForm.controls['asset'].setValue(null);
    this.setPPMForm.controls['instructionSet'].setValue(null);
    this.setPPMForm.controls['priority'].setValue(null);
    this.setPPMForm.controls['financeCode'].setValue(null);
    this.setPPMForm.controls['costCenter'].setValue(null);
    this.setPPMForm.controls['costCode'].setValue(null);
    this.setPPMForm.controls['resource'].setValue(null);
    this.setPPMForm.controls['shift'].setValue(null);
    this.serviceDetailsForm.controls['serviceFrequencyType'].setValue(null);
  }
}
