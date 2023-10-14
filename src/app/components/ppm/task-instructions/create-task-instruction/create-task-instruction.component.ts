import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { FormatHelper } from '../../../../helpers/FormatHelper';
import buttons from '../../../../helpers/buttons.json';

@Component({
  selector: 'app-create-instruction',
  templateUrl: './create-task-instruction.component.html',
  styleUrls: ['./create-task-instruction.component.scss']
})
export class CreateTaskInstructionComponent
  extends CommonComponent
  implements OnInit
{
  generalTaskInstForm!: FormGroup;
  financialTaskInstForm!: FormGroup;
  taskInstructionDetailsForm!: FormGroup;
  generalTaskInstruction: any = {};
  financialTaskInstruction: any = {};
  tId: number = 0;
  instruction: any = {};
  instructionDetails: any;
  hseqElements: any = [];
  sparesRequired: any = [];
  isPriorityRequired: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private router: Router
  ) {
    super();
    this.buttons = buttons.ppm.taskInstructions.create;
    let navState = this.navService.getNavigationState();
    this.isEditable = false;
    if (this.router.url === `/${Navigate.CREATE_TASK}`) {
      navState.currentInstructionId = 0;
      this.isEditable = true;
    }
    this.updateButtons();
    this.tId = navState.currentInstructionId;
    this.apiService.GetTaskInstructionById(this.tId).subscribe({
      next: (result) => {
        this.instruction = result.taskInstruction ?? {};
        this.instructionDetails = result.taskInstructionDetails;
        if (
          this.instructionDetails == undefined ||
          this.instructionDetails == null
        ) {
          this.instructionDetails = [];
        }
        this.hseqElements = FormatHelper.tokenize(
          this.instruction?.hseqElements ?? ''
        );
        this.sparesRequired = FormatHelper.tokenize(
          this.instruction?.sparesRequired ?? ''
        );
        this.generalTaskInstForm = this.fb.group({
          code: [this.instruction?.id ?? 0],
          name: [this.instruction?.name ?? '', Validators.required],
          classification: [this.instruction?.classificationId],
          type: [this.instruction?.typeId, Validators.required],
          subType: [this.instruction?.subTypeId, Validators.required],
          category: [this.instruction?.categoryId, Validators.required],
          discipline: [this.instruction?.disciplineId, Validators.required],
          priority: [this.instruction?.priorityId, this.instruction?.classificationId === 2 ? Validators.required : []],
          isMasterInstruction: [this.instruction?.isMasterInstruction ?? true]
        });

        this.financialTaskInstForm = this.fb.group({
          noOfStaff: [this.instruction?.noOfStaff ?? 0],
          estLabourCost: [this.instruction?.estLabourCost ?? 0],
          estStockCost: [this.instruction?.estStockCost ?? 0],
          estTime: [this.instruction?.estTime ?? 0, Validators.required],
          totalTime: [this.instruction?.totalTime ?? 0],
          sparesRequired: [this.instruction?.sparesRequired ?? ''],
          hseqElements: [this.instruction?.hseqElements ?? ''],
          hseqComment: [this.instruction?.hseqComment ?? '']
        });

        this.taskInstructionDetailsForm = this.fb.group({
          taskInstructionDetails: this.fb.array([])
        });
        this.generalTaskInstForm.valueChanges.subscribe(() => {
          this.updateValidation();
        });

        this.financialTaskInstForm.valueChanges.subscribe(() => {
          this.updateValidation();
        });
        this.instructionDetails?.forEach((details: any) => {
          let task = {
            id: details?.id,
            code: details?.code,
            details: details?.details,
            groupId: details?.groupId,
            standardId: details?.standardId
          };
          this.addTaskDetails(task);
        });
        this.masterData = result;
        this.filteredData = { ...this.masterData };
        this.isDataLoaded = true;
      },
      error: (e) => {
        this.alertService.error('Error retreving instructions !!', {
          id: 'alert-taskInstructions'
        },e);
        console.error(e);
      },
      complete: () => {}
    });
  }

  updateValidation(): void {
    let savebutton = this.buttons.find((b: any) => b.id === 'Save');
    if (savebutton && this.isEditable) {
      savebutton.isDisabled =
        !this.generalTaskInstForm?.valid || !this.financialTaskInstForm?.valid;
    }
  }

  ngOnInit() {
    this.calculateTotalTime(
      this.instruction?.noOfStaff ?? 0,
      this.instruction?.estTime ?? 0
    );
  }

  calculateTotalTime(_noOfUsers: string | null, _estTime: string | null): void {
    let noOfUsers =
      _noOfUsers ?? this.financialTaskInstForm?.controls['noOfStaff']?.value;
    let estTime =
      _estTime ?? this.financialTaskInstForm?.controls['estTime']?.value;
    this.instruction['totalTimeInMins'] =
      parseFloat(noOfUsers ?? 0) * parseFloat(estTime ?? 0);
    this.financialTaskInstForm?.controls['totalTime'].patchValue(
      this.instruction?.totalTimeInMins
    );
  }

  sparesUpdated(spares: any): void {
    this.sparesRequired = spares;
  }

  hseqElementsUpdated(elements: any): void {
    this.hseqElements = elements;
  }

  buttonClicked(buttonType: any): void {
    if (buttonType == 'Save') {
      this.saveOrEdit();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.VIEW_TI_GRID]);
    }
  }

  override save(): void {
    let general = this.generalTaskInstForm.value;
    let financial = this.financialTaskInstForm.value;

    let data = {
      id: this.tId,
      name: general.name,
      classificationId: general.classification?.id ?? general.classification,
      typeId: general.type?.id ?? general?.type,
      subTypeId: general.subType?.id ?? general?.subType,
      categoryId: general.category?.id ?? general?.category,
      priorityId: general.priority?.id ?? general?.priority,
      disciplineId: general.discipline?.id ?? general?.discipline,
      isMasterInstruction: general.isMasterInstruction,
      noOfStaff: financial.noOfStaff,
      estimatedLabourCost: financial.estLabourCost,
      estimatedStockCost: financial.estStockCost,
      estimatedTimeInMins: financial.estTime,
      totalTimeInMins: financial.totalTime,
      sparesRequired: [
        ...new Set(this.sparesRequired.map((d: any) => d.value))
      ].join(','),
      isActive: true,
      questionGroupId: '', //financial.hseqQuestion,
      hseqComment: financial.hseqComment,
      hseqElements: [
        ...new Set(this.hseqElements.map((d: any) => d.value))
      ].join(',')
    };

    this.apiService
      .AddPpm('TaskInstructions/AddOrUpdateTaskInstruction', data)
      .subscribe({
        next: (result) => {
          this.tId = result;
          this.alertService.success('Saved instruction Successfully!!', {
            id: 'alert-taskInstructions'
          });
        },
        error: (e) => {
          this.alertService.error('Error retreving instructions !!', {
            id: 'alert-taskInstructions'
          },e);
          console.error(e);
          this.isEditable = true;
        },
        complete: () => {}
      });
  }

  //Task Instructions Details

  addTaskDetails(taskDetails?: any) {
    const taskInstructionForm = this.fb.group({
      id: [taskDetails?.id ?? 0],
      code: [taskDetails?.code ?? '', Validators.required],
      details: [taskDetails?.details ?? '', Validators.required],
      groupId: [taskDetails?.groupId, Validators.required],
      standardId: [taskDetails?.standardId, Validators.required]
    });
    this.taskInstructionDetails.push(taskInstructionForm);
  }

  get taskInstructionDetails() {
    return this.taskInstructionDetailsForm?.controls[
      'taskInstructionDetails'
    ] as FormArray;
  }

  getTaskDetails(form: any): FormGroup {
    return form;
  }

  saveTaskDetails(id: any, taskForm: any): void {
    taskForm = taskForm as FormGroup;
    if (taskForm.valid) {
      let taskFormValues = taskForm.value;
      let taskFormDetails = {
        code: taskFormValues?.code,
        details: taskFormValues?.details,
        groupId: taskFormValues?.groupId?.id,
        standardId: taskFormValues?.standardId?.id,
        taskInstructionId: this.tId,
        id: taskFormValues?.id ?? 0,
        name: 'test name'
      };
      this.apiService
        .AddPpm(
          'TaskInstructions/AddOrUpdateTaskInstructionDetails',
          taskFormDetails
        )
        .subscribe({
          next: (result) => {
            this.alertService.success('Saved instruction Successfully!!', {
              id: 'alert-taskInstructions'
            });
          },
          error: (e) => {
            this.alertService.error('Error retreving instructions !!', {
              id: 'alert-taskInstructions'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  deleteTaskDetails(taskDetailsIdx: number, taskDetails: any): void {
    if (taskDetails.value.id > 0) {
      this.apiService
        .DeleteTaskInstructionById(
          'TaskInstructions/AddOrUpdateTaskInstructionDetails',
          taskDetails.value.id
        )
        .subscribe({
          next: (result) => {
            if (result.isSuccess) {
              this.instructionDetails.removeAt(taskDetailsIdx);
              this.alertService.success(result.message, {
                id: 'alert-taskInstructions'
              });
            }
          },
          error: (e) => {
            this.alertService.error('Error retreving instructions !!', {
              id: 'alert-taskInstructions'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    } else {
      this.taskInstructionDetails.removeAt(taskDetailsIdx);
    }
  }

  classificationChanged(clasification: any): void {
    if (clasification.code === 'BIN') {
      this.isPriorityRequired = true;
      this.generalTaskInstForm
        ?.get('priority')
        ?.addValidators([Validators.required]);
      this.generalTaskInstForm?.get('priority')?.setValue(null);
    } else {
      this.isPriorityRequired = false;
      this.generalTaskInstForm?.get('priority')?.clearValidators();
      this.generalTaskInstForm?.get('priority')?.addValidators([]);
      this.generalTaskInstForm?.get('priority')?.setValue(null);
    }
  }
}
