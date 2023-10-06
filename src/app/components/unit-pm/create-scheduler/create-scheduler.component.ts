import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import buttons from '../../../helpers/buttons.json';

@Component({
  selector: 'app-create-scheduler',
  templateUrl: './create-scheduler.component.html',
  styleUrls: ['./create-scheduler.component.scss']
})
export class CreateSchedulerComponent extends CommonComponent {
  selectAssetForm!: FormGroup;
  unitPmForm!: FormGroup;
  setPPMForm!: FormGroup;
  serviceDetailsForm!: FormGroup;
  assetDetailsForm!: FormGroup;
  asset: any;
  instruction: any;
  selectedBuilding: any;
  selectedResource: any;
  schedulerData: any;
  assetData: any[] = [];

  @ViewChild('costCenterList') costCenterDD!: DropdownComponent;
  @ViewChild('costCodeList') costCodeDD!: DropdownComponent;

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
    this.buttons = buttons.ppm.scheduler.create;
    this.navState = this.navService.getNavigationState();
    if (this.router.url === `/${Navigate.CREATE_SCHEDULE}`) {
      this.navState.currentSchedulerId = 0;
      this.isEditable = true;
    } else {
      this.buttons = this.buttons.filter((b: any) => b.id !== 'Save');
    }
    // this.apiService
    //   .GetSchedulerById(
    //     `UnitPMScheduler/GetUnitPMScheduerData/${this.navState.currentSchedulerId}`,
    //     this.ApiEndpoints.SCHEDULERAPI
    //   )
    //   .subscribe({
    //     next: (result) => {
    //       this.masterData = result;
    //       this.filteredData = { ...this.masterData };
    //       this.unitPmForm = this.fb.group({
    //         project: [],
    //         building: [],
    //         floor: [],
    //         unit: []
    //       });
    //       this.setPPMForm = this.fb.group({
    //         ppmCode: ['', Validators.required],
    //         instructionSet: [, Validators.required],
    //         family: ['', Validators.required],
    //         priority: [, Validators.required],
    //         estimationTime: ['', Validators.required],
    //         estimationMen: ['', Validators.required],
    //         stockLabCost: ['', Validators.required],
    //         totalCost: ['', Validators.required],
    //         financeCode: [, Validators.required],
    //         costCenter: [, Validators.required],
    //         costCode: [, Validators.required],
    //         resource: [, Validators.required],
    //         designation: ['', Validators.required],
    //         shift: [, Validators.required],
    //         isPermitNeeded: ['', Validators.required],
    //         isHealthSafetyCheckNeeded: ['', Validators.required]
    //       });
    //       this.serviceDetailsForm = this.fb.group({
    //         lastService: ['', Validators.required],
    //         serviceFrequency: ['', Validators.required],
    //         serviceFrequencyType: [, Validators.required],
    //         nextDue: ['', Validators.required],
    //         week: ['', Validators.required]
    //       });
    //       this.assetDetailsForm = this.fb.group({
    //         assetsDetails: this.fb.array([])
    //       });
    //       this.isDataLoaded = true;
    //     },
    //     error: (e) => {
    //       this.alertService.error('Error Retrieving Scheduler !!', {
    //         id: 'alert-scheduler'
    //       });
    //       console.error(e);
    //     },
    //     complete: () => {}
    //   });
    
  }

  get assetsDetails() {
    return this.assetDetailsForm.controls['assetsDetails'] as FormArray;
  }

  addAssetsDetailsForm(asset: any) {
    const scheduledLocationForm = this.fb.group({
      assetCode: [asset.assetCode],
      assetName: [asset.assetName],
      assetId: [asset.assetId]
    });
    this.assetsDetails.push(scheduledLocationForm);
  }

  protected override save(): void {
    let formData = {
      ...this.unitPmForm.value,
      ...this.setPPMForm.value,
      ...this.serviceDetailsForm.value
    };
    let data = {
        id:0,
        code:formData.ppmCode,
        projectId:formData.project,
        buildingId:formData.building,
        taskInstructionId:formData.instructionSet,
        priorityId:formData.priority,
        estimationTime:formData.estimationTime,
        estimationMen:formData.estimationMen,
        stockLabCost:formData.stockLabCost,
        totalCost:formData.totalCost,
        financeCodeId:formData.financeCode,
        costCenterId:formData.costCenter,
        costCodeId:formData.costCode,
        qrCodeUrl:formData.string,
        resourceId:formData.resource,
        shiftId:formData.shift,
        isPermitNeeded:formData.isPermitNeeded,
        hasHSC:formData.true,
        frequencyTypeId:formData.serviceFrequencyType,
        numberOfServices:0,
        startHours:0,
        startMins:0,
        endHours:0,
        endMins:0,
        weekDays:'',
        months:'',
        monthType:0,
        startDate:'',
        endDate:'',
        unitPMSchedulerAssets:[]
    };
    this.apiService
      .addOrUpdateScheduledTask('UnitPMScheduler/AddOrUpdateUnitPMScheduler', data)
      .subscribe({
        next: (result: any) => {
          this.navState = this.navService.getNavigationState();
          this.navState.currentSchedulerId = result;
          this.navService.setNavigationState(this.navState);
          this.alertService
            .success('Scheduler Updated Successfully!!', {
              id: 'alert-scheduler'
            })
            .then(() => {
              this.isEditable = false;
              this.buttons = this.buttons.filter(
                (button) => button.label !== 'Save'
              );
              this.router.navigate([Navigate.VIEW_UT_SCHEDULE]);
            });
        },
        error: (e: any) => {
          this.alertService.error('Error Retrieving Scheduled Task !!', {
            id: 'alert-scheduledTask'
          });
        },
        complete: () => { }
      });
  }

  buttonClicked(buttonType: any) {
    if (buttonType == 'Save') {
      this.save();
    } else {
      this.router.navigate(['scheduled-tasks/scheduler']);
    }
  }

  getTaskDetails(form: any): FormGroup {
    return form;
  }

  deleteTaskDetails(idx: number, details: any) {
    if (details.value.id > 0) {
    } else {
      this.assetsDetails.removeAt(idx);
    }
  }

  projectSelected(project: any) {
    this.apiService
      .GetSchedulerById(
        `UnitPMScheduler/GetProjectAdditionalData/${project.id}`,
        this.ApiEndpoints.SCHEDULERAPI
      )
      .subscribe({
        next: (result) => {
          this.masterData = { ...this.masterData, ...result };
          this.filteredData = { ...this.masterData };
          this.selectedBuilding = 'Select Building';
          this.selectedResource = 'Select Resource';
          this.filteredData['units'] = [];
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Scheduler !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  buildingSelected(building: any) {
    this.filteredData.units = this.masterData?.units?.filter(
      (u: any) => u.buildingId === building.id
    );
  }

  unitSelected() {
    if (!this.unitPmForm.valid) {
      this.alertService.error('Enter valid unit details !!', {
        id: 'alert-scheduler'
      });
      return;
    }
    let formData = this.unitPmForm.value;
    this.apiService
      .GetSchedulerById(
        `UnitPMScheduler/GetUnitPMAssets/${formData.building?.id}/${formData.floor?.id}/${formData.unit?.id}`,
        this.ApiEndpoints.SCHEDULERAPI
      )
      .subscribe({
        next: (result) => {
          this.assetData = result??[];
          this.assetData.forEach((asset) => {
            this.addAssetsDetailsForm(asset);
          });
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Scheduler !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  getInstructionData(instruction: any) {
    this.apiService.GetTaskInstructionById(instruction.id).subscribe({
      next: (result) => {
        this.instruction = result.taskInstruction;
        let ppmData = this.setPPMForm.value;
        ppmData.instructionSet = this.instruction.id;
        ppmData.estimationMen = this.instruction.noOfStaff;
        ppmData.estimationTime = this.instruction.estimatedTimeInMins;
        ppmData.ppmCode = this.asset.id;
        ppmData.priority =
          this.schedulerData?.priorityId ?? this.instruction?.priorityId;
        ppmData.stockLabCost = this.instruction.estimatedStockCost;
        ppmData.totalCost = this.instruction.estimatedLabourCost;
        this.setPPMForm.patchValue(ppmData);
      },
      error: (e) => {
        this.alertService.error('Error Retrieving Asset !!', {
          id: 'alert-scheduler'
        });
        console.error(e);
      },
      complete: () => {}
    });
  }
}
