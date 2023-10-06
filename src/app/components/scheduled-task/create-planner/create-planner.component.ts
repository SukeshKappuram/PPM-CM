import '@progress/kendo-date-math/tz/regions/Europe';
import '@progress/kendo-date-math/tz/regions/NorthAmerica';

import { FormBuilder, FormGroup } from '@angular/forms';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import buttons from 'src/app/helpers/buttons.json';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { CommonComponent } from '../../common/common.component';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GridFilterComponent } from 'src/app/shared/grid-filter/grid-filter.component';

const currentYear = new Date().getFullYear();
const parseAdjust = (eventDate: string): Date => {
  const date = new Date(eventDate);
  date.setFullYear(currentYear);
  return date;
};

@Component({
  selector: 'app-create-planner',
  templateUrl: './create-planner.component.html',
  styleUrls: ['./create-planner.component.scss']
})
export class CreatePlannerComponent extends CommonComponent {
  public selectedDate: Date = new Date();
  public resources: any[] = [
    {
      name: 'Rooms',
      data: [
        { text: 'Meeting Room 101', value: 1, color: '#6eb3fa' },
        { text: 'Meeting Room 201', value: 2, color: '#f58a8a' }
      ],
      field: 'roomId',
      valueField: 'value',
      textField: 'text',
      colorField: 'color'
    },
    {
      name: 'Attendees',
      data: [
        { text: 'Alex', value: 1, color: '#f8a398' },
        { text: 'Bob', value: 2, color: '#51a0ed' },
        { text: 'Charlie', value: 3, color: '#56ca85' }
      ],
      multiple: true,
      field: 'attendees',
      valueField: 'value',
      textField: 'text',
      colorField: 'color'
    }
  ];
  public events: SchedulerEvent[] = [];
  formGroup!: FormGroup<any>;
  startEndValidator: any;
  @ViewChild('gridFilter') gridFilter!: GridFilterComponent;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private navService: NavigationService,
    private apiService: ApiService
  ) {
    super();
    this.navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState?.subMenu);
    this.buttons = buttons.scheduledTask.issuer.create;
    if (!this.userAccess.canAdd && !this.userAccess.canUpdate) {
      this.buttons = this.buttons.filter(
        (button) =>
          button.id !== 'Build' && button.id !== 'Issue' && button.id !== 'Drop'
      );
    }
    this.config['apiUrl'] = this.route.snapshot.data['url'];
    this.config['apiEndpoint'] = this.route.snapshot.data['api'];
    this.config['title'] = this.route.snapshot.data['title'];
    this.config['items'] = this.route.snapshot.data['items'];
    this.config['filter'] = this.route.snapshot.data['filter'];
    this.config['showStartEndDates'] =
      this.route.snapshot.data['showStartEndDates'];
    this.config['isProjectMandatory'] =
      this.route.snapshot.data['isProjectMandatory'] ?? true;
    this.config['isFrequencyMultiSelect'] =
      this.route.snapshot.data['isFrequencyMultiSelect'];
    this.config['isFrequencyMandatory'] =
      this.route.snapshot.data['isFrequencyMandatory'];
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
      this.apiService
        .GetDataByFilter(
          'Planner/GetPlannerCalendarData',
          filter,
          ApiEndpoints.SCHEDULERAPI
        )
        .subscribe((res: any) => {
          if (res) {
            this.gridFilter.toggleShow();
            this.dataService.filterApplied({
              isFilterApplied: true,
              noOfFiltersApplied: 1
            });
            this.events = res.data.map(
              (dataItem: any) =>
                <SchedulerEvent>{
                  id: dataItem.id,
                  start: parseAdjust(dataItem.startDate),
                  startTimezone: dataItem?.StartTimezone,
                  end: parseAdjust(dataItem.endDate),
                  endTimezone: dataItem.EndTimezone,
                  isAllDay: dataItem.isAllDayEvent,
                  title: dataItem.reference,
                  description:
                    dataItem.locationName + ', ' + dataItem.projectName,
                  recurrenceRule: dataItem.RecurrenceRule,
                  recurrenceId: dataItem.RecurrenceID,
                  recurrenceException: dataItem.RecurrenceException,
                  roomId: dataItem.scheduledId,
                  attendees: dataItem.resource
                }
            );
          }
        });
    }
  }

  protected override buttonClicked(buttonType: any): void {}
}
