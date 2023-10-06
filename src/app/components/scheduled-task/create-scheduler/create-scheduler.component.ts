import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { FrequencyType } from 'src/app/models/enums/FrequencyType.enum';
import { MonthType } from 'src/app/models/enums/MonthType';
import { Months } from 'src/app/models/enums/Months.enum';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { Weeks } from 'src/app/models/enums/Weeks.enum';
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
  setScheduledTaskForm!: FormGroup;
  selectLocationForm!: FormGroup;
  serviceDetailsForm!: FormGroup;

  frequency: any = {
    inMinutes: '',
    inHours: '',
    inDays: '',
    inWeeks: '',
    inMonths: ''
  };
  timeRangeInMin: any = {
    start: 'hh:mm',
    end: 'hh:mm'
  };
  timeRangeInHrs: any = {
    start: 'hh:mm',
    end: 'hh:mm'
  };
  timeRangeInDys: any = {
    start: 'hh:mm',
    end: 'hh:mm'
  };
  timeRangeInWks: any = {
    start: 'hh:mm',
    end: 'hh:mm'
  };
  timeRangeInMon: any = {
    start: 'hh:mm',
    end: 'hh:mm'
  };
  timeRangeInEM: any = {
    start: 'hh:mm',
    end: 'hh:mm'
  };
  selectedInstruction: any;
  selectedResource: any;
  scheduledTasks: any;
  selectedLocations: any[] = [];
  selectedFrequencyType: any = FrequencyType.Minutely;
  selectedMonthType: any = MonthType.On;
  selectedMonths: Set<number> = new Set<number>();
  selectedDays: Set<number> = new Set<number>();

  FrequencyType = FrequencyType;
  MonthType = MonthType;

  selectedLocationsData: any = {
    rooms: []
  };

  minDate: any;
  selectedBuilding: any;
  units: any[] = [];

  @ViewChildren('unit') unitDps!: QueryList<DropdownComponent>;
  @ViewChildren('room') roomDps!: QueryList<DropdownComponent>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private router: Router,
    private navService: NavigationService
  ) {
    super();
    this.pageTitle = 'Scheduled Task';
    this.buttons = buttons.scheduledTask.scheduler.create;
    let navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(navState?.subMenu);
    if (this.router.url === `/${Navigate.CREATE_ST_SCHEDULE}`) {
      navState.currentSchedulerId = 0;
      if(!this.userAccess.canAdd){
        this.buttons = this.buttons.filter((btn) => btn.id !== 'Save')
      }
      this.navService.setNavigationState(navState);
    }
    this.getScheduledTaskData(navState.currentSchedulerId);

    this.masterData['monthType'] = [
      { id: 1, name: 'On', value: MonthType.On },
      { id: 2, name: 'Every', value: MonthType.Every }
    ];

    this.masterData['days'] = [
      { id: 2, name: 'Monday', value: Weeks.Monday },
      { id: 3, name: 'Tuesday', value: Weeks.Tuesday },
      { id: 4, name: 'Wednesday', value: Weeks.Wednesday },
      { id: 5, name: 'Thursday', value: Weeks.Thursday },
      { id: 6, name: 'Friday', value: Weeks.Friday },
      { id: 7, name: 'Saturday', value: Weeks.Saturday },
      { id: 1, name: 'Sunday', value: Weeks.Sunday }
    ];

    this.masterData['months'] = [
      { id: 1, name: 'January', value: Months.January, noOfDays: 31 },
      { id: 2, name: 'February', value: Months.February, noOfDays: 28 },
      { id: 3, name: 'March', value: Months.March, noOfDays: 31 },
      { id: 4, name: 'April', value: Months.April, noOfDays: 30 },
      { id: 5, name: 'May', value: Months.May, noOfDays: 31 },
      { id: 6, name: 'June', value: Months.June, noOfDays: 30 },
      { id: 7, name: 'July', value: Months.July, noOfDays: 31 },
      { id: 8, name: 'August', value: Months.August, noOfDays: 31 },
      { id: 9, name: 'September', value: Months.September, noOfDays: 30 },
      { id: 10, name: 'October', value: Months.October, noOfDays: 31 },
      { id: 11, name: 'November', value: Months.November, noOfDays: 30 },
      { id: 12, name: 'December', value: Months.December, noOfDays: 31 }
    ];

    let todaysDate = new Date();
    let year = todaysDate.getFullYear();
    let month = ('0' + (todaysDate.getMonth() + 1)).slice(-2); // MM
    let day = ('0' + todaysDate.getDate()).slice(-2); // DD
    this.minDate = year + '-' + month + '-' + day; // Results in "YYYY-MM-DD" for today's dat
  }

  getScheduledTaskData(id: any) {
    this.apiService
      .scheduledTaskData('ScheduledTask/GetScheduledTaskData', id)
      .subscribe({
        next: (result: any) => {
          this.masterData['projects'] = result?.projects;
          this.filteredData = { ...this.masterData, ...{ rooms: [] } };
          this.scheduledTasks = result?.scheduledTasks;
          this.selectLocationForm = this.fb.group({
            scheduledDetails: this.fb.array([])
          });
          if (this.scheduledTasks) {
            this.isEditable = false;
            this.selectedFrequencyType = this.scheduledTasks?.frequencyTypeId;
            this.selectedMonthType = this.scheduledTasks?.monthType;
            this.scheduledTasks?.weekDays
              ?.split(',')
              ?.forEach((item: any) => this.selectedDays.add(parseInt(item)));
            this.scheduledTasks?.months
              ?.split(',')
              ?.forEach((item: any) => this.selectedMonths.add(parseInt(item)));
            this.projectSelected({ id: this.scheduledTasks?.projectId });
            this.buttons = this.buttons.filter(
              (button) => button.label !== 'Save'
            );
          }
          this.setScheduledTaskForm = this.fb.group({
            scheduledTaskCode: [this.scheduledTasks?.code],
            project: [this.scheduledTasks?.projectId, Validators.required],
            building: [this.scheduledTasks?.buildingId, Validators.required],
            instructionSet: [
              this.scheduledTasks?.taskInstructionId,
              Validators.required
            ],
            priority: [this.scheduledTasks?.priorityId, Validators.required],
            estimationTime: [this.scheduledTasks?.estimationTime],
            estimationMen: [this.scheduledTasks?.estimationMen],
            stocklabCost: [this.scheduledTasks?.stockLabCost],
            totalCost: [this.scheduledTasks?.totalCost],
            financeCode: [
              this.scheduledTasks?.financeCodeId,
              Validators.required
            ],
            costCenter: [
              this.scheduledTasks?.costCenterId,
              Validators.required
            ],
            costCode: [this.scheduledTasks?.costCodeId, Validators.required],
            resource: [this.scheduledTasks?.resourceId, Validators.required],
            designation: [this.scheduledTasks?.designation],
            shift: [this.scheduledTasks?.shiftId],
            isPermitNeeded: [this.scheduledTasks?.isPermitNeeded],
            hasHSC: [this.scheduledTasks?.hasHSC]
          });

          switch (this.scheduledTasks?.frequencyTypeId) {
            case FrequencyType.Minutely:
              this.frequency['inMinutes'] =
                this.scheduledTasks?.numberOfServices;
              this.timeRangeInMin['start'] =
                this.scheduledTasks?.id > 0
                  ? this.pad(this.scheduledTasks?.startHours, 2) +
                  ':' +
                  this.pad(this.scheduledTasks.startMins, 2)
                  : this.timeRangeInMin?.start;
              this.timeRangeInMin['end'] =
                this.scheduledTasks?.id > 0
                  ? this.pad(this.scheduledTasks?.endHours, 2) +
                  ':' +
                  this.pad(this.scheduledTasks?.endMins, 2)
                  : this.timeRangeInMin?.end;
              break;
            case FrequencyType.Hourly:
              this.frequency['inHours'] = this.scheduledTasks?.numberOfServices;
              this.timeRangeInHrs['start'] =
                this.scheduledTasks?.id > 0
                  ? this.pad(this.scheduledTasks?.startHours, 2) +
                  ':' +
                  this.pad(this.scheduledTasks?.startMins, 2)
                  : this.timeRangeInHrs?.start;
              this.timeRangeInHrs['end'] =
                this.scheduledTasks?.id > 0
                  ? this.pad(this.scheduledTasks?.endHours, 2) +
                  ':' +
                  this.pad(this.scheduledTasks?.endMins, 2)
                  : this.timeRangeInHrs?.end;
              break;
            case FrequencyType.Daily:
              this.frequency['inDays'] = this.scheduledTasks?.numberOfServices;
              this.timeRangeInDys['start'] =
                this.scheduledTasks?.id > 0
                  ? this.pad(this.scheduledTasks?.startHours, 2) +
                  ':' +
                  this.pad(this.scheduledTasks.startMins, 2)
                  : this.timeRangeInDys?.start;
              break;
            case FrequencyType.Weekly:
              this.frequency['inWeeks'] = this.scheduledTasks?.numberOfServices;
              this.timeRangeInWks['start'] =
                this.scheduledTasks?.id > 0
                  ? this.pad(this.scheduledTasks?.startHours, 2) +
                  ':' +
                  this.pad(this.scheduledTasks.startMins, 2)
                  : this.timeRangeInWks?.start;
              break;
            case FrequencyType.Monthly:
              this.frequency['inMonths'] =
                this.scheduledTasks?.numberOfServices;
              if (this.scheduledTasks?.monthType === MonthType.On) {
                this.timeRangeInMon['start'] =
                  this.scheduledTasks?.id > 0
                    ? this.pad(this.scheduledTasks?.startHours, 2) +
                    ':' +
                    this.pad(this.scheduledTasks.startMins, 2)
                    : this.timeRangeInMon?.start;
              } else {
                this.timeRangeInEM['start'] =
                  this.scheduledTasks?.id > 0
                    ? this.pad(this.scheduledTasks?.startHours, 2) +
                    ':' +
                    this.pad(this.scheduledTasks.startMins, 2)
                    : this.timeRangeInEM?.start;
              }
              break;
          }
          this.serviceDetailsForm = this.fb.group({
            frequency: [
              this.scheduledTasks?.frequencyTypeId ?? FrequencyType.Minutely
            ],
            inMinutes: [this.frequency.inMinutes],
            startTimeInMin: [
              this.scheduledTasks?.frequencyTypeId === FrequencyType.Minutely ||
                this.scheduledTasks?.frequencyTypeId === undefined
                ? this.timeRangeInMin.start
                : ''
            ],
            endTimeInMin: [
              this.scheduledTasks?.frequencyTypeId === FrequencyType.Minutely ||
                this.scheduledTasks?.frequencyTypeId === undefined
                ? this.timeRangeInMin.end
                : ''
            ],
            inHours: [this.frequency.inHours],
            startTimeInHr: [
              this.scheduledTasks?.frequencyTypeId === FrequencyType.Hourly ||
                this.scheduledTasks?.frequencyTypeId === undefined
                ? this.timeRangeInHrs.start
                : ''
            ],
            endTimeInHr: [
              this.scheduledTasks?.frequencyTypeId === FrequencyType.Hourly ||
                this.scheduledTasks?.frequencyTypeId === undefined
                ? this.timeRangeInHrs.end
                : ''
            ],
            inDays: [this.frequency.inDays],
            startTimeInD: [
              this.scheduledTasks?.frequencyTypeId === FrequencyType.Daily ||
                this.scheduledTasks?.frequencyTypeId === undefined
                ? this.timeRangeInDys.start
                : ''
            ],
            inWeeks: [this.frequency.inWeeks],
            weekDays: [],
            startTimeInW: [
              this.scheduledTasks?.frequencyTypeId === FrequencyType.Weekly ||
                this.scheduledTasks?.frequencyTypeId === undefined
                ? this.timeRangeInWks.start
                : ''
            ],
            inMonths: [this.frequency.inMonths],
            startTimeInM: [
              this.scheduledTasks?.frequencyTypeId === FrequencyType.Monthly ||
                this.scheduledTasks?.frequencyTypeId === undefined
                ? this.timeRangeInMon.start
                : ''
            ],
            inDaysByMonth: [
              this.scheduledTasks?.monthType === MonthType.On
                ? this.frequency.inMonths
                : ''
            ],
            months: [],
            inMonthsByFrequency: [
              this.scheduledTasks?.monthType === MonthType.Every
                ? this.frequency.inMonths
                : ''
            ],
            startTimeInE: [
              this.scheduledTasks?.monthType === MonthType.Every ||
                this.frequency.inMonths === undefined
                ? this.timeRangeInEM.start
                : ''
            ],
            monthType: [this.scheduledTasks?.monthType ?? MonthType.On],
            startDate: [this.scheduledTasks?.startDate, Validators.required],
            endDate: [this.scheduledTasks?.endDate]
          });
          this.setScheduledTaskForm.valueChanges.subscribe((data: any) => {
            this.updateButtons();
          });
          this.serviceDetailsForm.valueChanges.subscribe((data: any) => {
            this.updateButtons();
          });
          this.selectLocationForm.valueChanges.subscribe((data: any) => {
            this.updateButtons();
          });
          this.isDataLoaded = true;
        },
        error: (e: any) => {
          this.alertService.error('Error Retrieving Scheduled Task !!', {
            id: 'alert-scheduledTask'
          });
        },
        complete: () => { }
      });
  }

  onMonthSelected(month: any): void {
    if (this.selectedFrequencyType === FrequencyType.Monthly) {
      if (!this.selectedMonths.has(month.value)) {
        this.selectedMonths.add(month.value);
      } else {
        this.selectedMonths.delete(month.value);
      }
    }
  }

  onDaySelected(day: any): void {
    if (this.selectedFrequencyType === FrequencyType.Weekly) {
      if (!this.selectedDays.has(day.value)) {
        this.selectedDays.add(day.value);
      } else {
        this.selectedDays.delete(day.value);
      }
    }
  }

  protected override save(): void {
    let formData = {
      ...this.setScheduledTaskForm.value,
      ...this.serviceDetailsForm.value
    };
    let noOfServices = 0;
    if (
      formData.frequency === FrequencyType.Minutely ||
      formData.frequency === FrequencyType.Hourly
    ) {
      noOfServices =
        formData.frequency === FrequencyType.Minutely
          ? parseInt(formData.inMinutes)
          : parseInt(formData.inHours);
      if (
        formData.frequency === FrequencyType.Minutely &&
        (noOfServices < 0 || noOfServices > 60)
      ) {
        this.alertService.error(
          'Time Interval should be greater than 0 or less than 60 Min !!',
          {
            id: 'alert-scheduledTask'
          }
        );
        return;
      }

      if (
        formData.frequency === FrequencyType.Hourly &&
        (noOfServices < 0 || noOfServices > 12)
      ) {
        this.alertService.error(
          'Time Interval should be greater than 0 or less than 12 Hrs !!',
          {
            id: 'alert-scheduledTask'
          }
        );
        return;
      }
      let startTime =
        formData.frequency === FrequencyType.Minutely
          ? formData.startTimeInMin ?? this.timeRangeInMin?.start
          : formData.startTimeInHr ?? this.timeRangeInHrs?.start;
      let endTime =
        formData.frequency === FrequencyType.Minutely
          ? formData.endTimeInMin ?? this.timeRangeInMin?.end
          : formData.endTimeInHr ?? this.timeRangeInHrs?.end;
      if (
        parseFloat(startTime.replace(':', '.')) >
        parseFloat(endTime.replace(':', '.'))
      ) {
        this.alertService.error('End time can not be less than start time !!', {
          id: 'alert-scheduledTask'
        });
        return;
      }
      if (
        parseFloat(endTime.replace(':', '.')) -
        parseFloat(startTime.replace(':', '.')) <
        parseFloat(
          this.selectedFrequencyType === FrequencyType.Minutely
            ? formData.inMinutes
            : formData.inHours
        ) /
        60
      ) {
        this.alertService.error(
          'Atleast one occurrence is required between start time and end time !!',
          {
            id: 'alert-scheduledTask'
          }
        );
        return;
      }
      if (startTime && startTime.split(':')[0] !== 'hh') {
        formData.startTimeInHr = startTime.split(':')[0];
        formData.startTimeInMin = startTime.split(':')[1];
      } else {
        this.alertService.error('Start time is required !!', {
          id: 'alert-scheduledTask'
        });
        return;
      }
      if (endTime && endTime.split(':')[0] !== 'hh') {
        formData.endTimeInHr = endTime.split(':')[0];
        formData.endTimeInMin = endTime.split(':')[1];
      } else {
        this.alertService.error('End time is required !!', {
          id: 'alert-scheduledTask'
        });
        return;
      }
    } else {
      let startTime = '';
      switch (formData.frequency) {
        case FrequencyType.Daily:
          noOfServices = parseInt(formData.inDays);
          startTime = formData.startTimeInD;
          if (formData.frequency === FrequencyType.Daily && (noOfServices < 0 || noOfServices > 28)) {
            this.alertService.error(
              'Time Interval should be greater than 0  or less than equal to 28 Days !!',
              {
                id: 'alert-scheduledTask'
              }
            );
            return;
          }
          if (startTime && startTime.split(':')[0] !== 'hh') {
            formData.startTimeInHr = startTime.split(':')[0];
            formData.startTimeInMin = startTime.split(':')[1];
          } else {
            this.alertService.error('Start time is required !!', {
              id: 'alert-scheduledTask'
            });
            return;
          }
          break;
        case FrequencyType.Weekly:
          noOfServices = parseInt(formData.inWeeks);
          startTime = formData.startTimeInW;
          if (formData.frequency === FrequencyType.Weekly && noOfServices < 0) {
            this.alertService.error(
              'Time Interval should be greater than 0 Weeks !!',
              {
                id: 'alert-scheduledTask'
              }
            );
            return;
          }
          if (this.selectedDays.size < 1) {
            this.alertService.error(
              'Atleast one day of the week has to be selected !!',
              {
                id: 'alert-scheduledTask'
              }
            );
            return;
          }
          if (startTime && startTime.split(':')[0] !== 'hh') {
            formData.startTimeInHr = startTime.split(':')[0];
            formData.startTimeInMin = startTime.split(':')[1];
          } else {
            this.alertService.error('Start time is required !!', {
              id: 'alert-scheduledTask'
            });
            return;
          }
          break;
        case FrequencyType.Monthly:
          if (formData.monthType === MonthType.On) {
            noOfServices = parseInt(formData.inMonths);
            if (noOfServices < 0 || noOfServices > 28) {
              this.alertService.error(
                'Time Interval should be greater than 0 and lessthan or equal to 28 !!',
                {
                  id: 'alert-scheduledTask'
                }
              );
              return;
            }
            startTime = formData.startTimeInM;
            if (startTime && startTime.split(':')[0] !== 'hh') {
              formData.startTimeInHr = startTime.split(':')[0];
              formData.startTimeInMin = startTime.split(':')[1];
            } else {
              this.alertService.error('Start time is required !!', {
                id: 'alert-scheduledTask'
              });
              return;
            }
            if (this.selectedMonths.size < 1) {
              this.alertService.error(
                'Atleast one month has to be selected !!',
                {
                  id: 'alert-scheduledTask'
                }
              );
              return;
            }
          } else if (formData.monthType === MonthType.Every) {
            if (noOfServices < 0 || noOfServices > 12) {
              this.alertService.error(
                'Time Interval should be greater than 0 and less than or equal to 12 !!',
                {
                  id: 'alert-scheduledTask'
                }
              );
              return;
            }
            noOfServices = parseInt(formData.inMonthsByFrequency);
            startTime = formData.startTimeInE;
            if (startTime && startTime.split(':')[0] !== 'hh') {
              formData.startTimeInHr = startTime.split(':')[0];
              formData.startTimeInMin = startTime.split(':')[1];
            } else {
              this.alertService.error('Start time is required !!', {
                id: 'alert-scheduledTask'
              });
              return;
            }
          }
          break;
      }
    }
    let data = {
      id: 0,
      code: formData.scheduledTaskCode,
      projectId: formData.project.id,
      buildingId: formData.building.id,
      taskInstructionId: formData.instructionSet.id,
      priorityId: formData.priority.id,
      estimationTime: formData.estimationTime,
      estimationMen: formData.estimationMen,
      stockLabCost: formData.stocklabCost,
      totalCost: formData.totalCost,
      financeCodeId: formData.financeCode.id,
      costCenterId: formData.costCenter.id,
      costCodeId: formData.costCode.id,
      qrCodeUrl: '',
      resourceId: formData.resource.id,
      shiftId: formData.shift?.id,
      isPermitNeeded: formData.isPermitNeeded ?? false,
      hasHSC: formData.hasHSC ?? false,
      frequencyTypeId: formData.frequency,
      numberOfServices: noOfServices,
      startHours: formData.startTimeInHr ?? '',
      startMins: formData.startTimeInMin ?? '',
      endHours:
        formData.frequency === FrequencyType.Minutely ||
          formData.frequency === FrequencyType.Hourly
          ? formData.endTimeInHr
          : '',
      endMins:
        formData.frequency === FrequencyType.Minutely ||
          formData.frequency === FrequencyType.Hourly
          ? formData.endTimeInMin
          : '',
      weekDays: this.setToString(this.selectedDays, ','),
      months: this.setToString(this.selectedMonths, ','),
      monthType:
        formData.frequency === FrequencyType.Monthly
          ? formData.monthType
          : MonthType.None,
      startDate: formData.startDate,
      endDate: formData.endDate,
      scheduledTaskLocations: this.getFormData()
    };
    this.apiService
      .addOrUpdateScheduledTask('ScheduledTask/AddOrUpdateScheduledTask', data)
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
              this.router.navigate([Navigate.VIEW_ST_SCHEDULE]);
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

  override updateButtons(): void {
    let savebutton = this.buttons.find((b: any) => b.id === 'Save');
    if (savebutton) {
      savebutton.isDisabled =
        !this.setScheduledTaskForm?.valid ||
        !this.serviceDetailsForm?.valid ||
        !this.scheduledDetails?.valid;
    }
  }

  updateForm(): void {
    if (this.selectedFrequencyType === FrequencyType.Minutely) {
      this.serviceDetailsForm
        ?.get('inMinutes')
        ?.addValidators([Validators.min(10), Validators.max(59)]);
      this.serviceDetailsForm?.get('inHours')?.clearValidators();
    } else if (this.selectedFrequencyType === FrequencyType.Minutely) {
      this.serviceDetailsForm
        ?.get('inHours')
        ?.addValidators([Validators.min(10), Validators.max(59)]);
      this.serviceDetailsForm?.get('inMinutes')?.clearValidators();
    } else if (this.selectedFrequencyType === FrequencyType.Daily) {
      this.serviceDetailsForm
        ?.get('inDays')
        ?.addValidators([Validators.min(1)]);
      this.serviceDetailsForm?.get('inDays')?.clearValidators();
    } else if (this.selectedFrequencyType === FrequencyType.Weekly) {
      this.serviceDetailsForm
        ?.get('inWeeks')
        ?.addValidators([Validators.min(1)]);
      this.serviceDetailsForm?.get('inWeeks')?.clearValidators();
    } else if (
      this.selectedFrequencyType === FrequencyType.Monthly &&
      this.selectedMonthType == MonthType.On
    ) {
      this.serviceDetailsForm
        ?.get('inMonths')
        ?.addValidators([Validators.min(1)]);
      this.serviceDetailsForm?.get('inMonths')?.clearValidators();
    } else if (
      this.selectedFrequencyType === FrequencyType.Monthly &&
      this.selectedMonthType == MonthType.Every
    ) {
      this.serviceDetailsForm
        ?.get('inMonthsByFrequency')
        ?.addValidators([Validators.min(1)]);
      this.serviceDetailsForm?.get('inMonthsByFrequency')?.clearValidators();
    }
  }

  get scheduledDetails() {
    return this.selectLocationForm.controls['scheduledDetails'] as FormArray;
  }

  projectSelected(project: any, resetValue: any = null) {
    this.apiService
      .getScheduledDataByProject(
        'ScheduledTask/GetProjectAdditionalData',
        project?.id
      )
      .subscribe({
        next: (result: any) => {
          this.filteredData = {};
          this.masterData = { ...this.masterData, ...result };
          this.filteredData = { ...this.masterData };
          if (resetValue)
            this.resetForm();
          if (this.scheduledTasks?.taskInstructionId) {
            this.buildingSelected({ id: this.scheduledTasks?.buildingId });
            this.instructionSelected({
              id: this.scheduledTasks?.taskInstructionId
            });
            this.resourceSelected({ id: this.scheduledTasks?.resourceId });
            this.selectedLocations =
              this.scheduledTasks?.scheduledTaskLocations ?? [];
            let i = 0;
            this.selectedLocations.forEach((location) => {
              this.addScheduledLocation(location, i);
              i++;
            });
          }
        },
        error: (e: any) => {
          this.alertService.error('Error Retrieving Scheduled Task !!', {
            id: 'alert-scheduledTask'
          });
        },
        complete: () => { }
      });
  }

  resetForm() {
    this.setScheduledTaskForm.controls['building'].setValue(null);
    this.setScheduledTaskForm.controls['instructionSet'].setValue(null);
    this.setScheduledTaskForm.controls['priority'].setValue(null);
    this.setScheduledTaskForm.controls['estimationTime'].setValue('');
    this.setScheduledTaskForm.controls['estimationMen'].setValue('');
    this.setScheduledTaskForm.controls['stocklabCost'].setValue('');
    this.setScheduledTaskForm.controls['totalCost'].setValue('');
    this.setScheduledTaskForm.controls['financeCode'].setValue(null);
    this.setScheduledTaskForm.controls['costCenter'].setValue(null);
    this.setScheduledTaskForm.controls['costCode'].setValue(null);
    this.setScheduledTaskForm.controls['resource'].setValue(null);
    this.setScheduledTaskForm.controls['designation'].setValue(null);
    this.setScheduledTaskForm.controls['shift'].setValue(null);
    this.selectedInstruction = null;
  }

  instructionSelected(instruction: any): void {
    this.selectedInstruction = this.masterData.taskInstructions?.find(
      (ins: any) => ins.id == instruction.id
    );
    let schedulerForm = this.setScheduledTaskForm.value;
    schedulerForm['estimationTime'] =
      this.selectedInstruction?.estimatedTimeInMins;
    schedulerForm['estimationMen'] = this.selectedInstruction?.estimationMen;
    schedulerForm['stocklabCost'] =
      this.selectedInstruction?.estimatedLabourCost;
    schedulerForm['totalCost'] = this.selectedInstruction?.estimatedStockCost;
    this.setScheduledTaskForm.patchValue(schedulerForm);
  }

  resourceSelected(resource: any) {
    this.selectedResource = this.masterData.resources?.find(
      (ins: any) => ins.id == resource.id
    );
    let schedulerForm = this.setScheduledTaskForm.value;
    schedulerForm['designation'] = this.selectedResource?.designation;
    this.setScheduledTaskForm.patchValue(schedulerForm);
  }

  buildingSelected(building: any, unit: any = { id: 0 }): void {
    this.selectedBuilding = building.id;
    this.units = this.masterData?.units.filter(
      (unit: any) => unit.buildingId === building.id
    );
    this.filteredData['units'] = { ...this.units };
    for (let i = 0; i < this.scheduledDetails.length; i++) {
      this.unitDps.get(i)?.setToDefault();
      this.unitChanged(unit, i);
    }
  }

  handleFilterForUnits(value: any, type: any) {
    this.filteredData['units'] = this.units.filter((s: any) => s['name']?.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  unitChanged(unit: any, index: any) {
    this.selectedLocationsData.rooms[index] = this.masterData?.rooms.filter(
      (room: any) => room.unitId === parseInt(unit.id)
    );
    this.filteredData.rooms[index] = this.selectedLocationsData.rooms[index];
    this.roomDps.get(index)?.setToDefault();
  }

  handleFilterForRooms(value: any, type: any, index: number) {
    this.filteredData['rooms'][index] = this.selectedLocationsData?.rooms[index].filter((s: any) => s['name']?.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  getFormData(): any {
    let formData = this.selectLocationForm.value;
    let arrayData = formData?.scheduledDetails;
    let dataLocations: any[] = [];
    arrayData.forEach((element: any) => {
      dataLocations.push({ id: 0, scheduledTaskId: 0, floorId: element?.floorId?.id, unitId: element?.unitId?.id, roomId: element?.roomId?.id });
    });
    return dataLocations;
  }

  getTaskDetails(form: any): FormGroup {
    return form;
  }

  addScheduledLocation(scheduledDetails?: any, index?: any) {
    const scheduledLocationForm = this.fb.group({
      id: [scheduledDetails?.id ?? 0],
      scheduledTaskId: [scheduledDetails?.id ?? 0],
      floorId: [scheduledDetails?.floorId],
      unitId: [scheduledDetails?.unitId],
      roomId: [scheduledDetails?.roomId]
    });
    this.scheduledDetails.push(scheduledLocationForm);
    if (scheduledDetails || this.selectedBuilding) {
      this.unitChanged({ id: scheduledDetails?.unitId?.toString() }, index);
    }
    this.filteredData.units = this.units;
  }

  deleteTaskDetails(idx: number, details: any) {
    if (details.value.id > 0) {
    } else {
      this.scheduledDetails.removeAt(idx);
    }
  }
}
