import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { ApiService } from 'src/app/services/api.service';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { DatePipe } from '@angular/common';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { FrequencyType } from './../../models/enums/FrequencyType.enum';
import { Months } from 'src/app/models/enums/Months.enum';
import { ServiceType } from 'src/app/models/enums/ServiceType.enum';
import { SlideInOutAnimation } from './animation';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-grid-filter',
  templateUrl: './grid-filter.component.html',
  styleUrls: ['./grid-filter.component.scss'],
  animations: [SlideInOutAnimation]
})
export class GridFilterComponent implements OnInit {
  filterForm!: FormGroup;
  startDate: any;
  endDate: any;
  showOptions: boolean = true;
  isCollapsed: boolean = false;
  masterData: any = {};
  seletableData: any = {};
  isDataLoaded: boolean = false;
  graphs: any[] = [];
  exportReportXL: any = {};

  months = [
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

  @Input() fieldWidth: number = 10;
  @Input() useSearchButton: boolean = true;
  @Input() isProjectMandatory: boolean = true;
  @Input() filterType: FilterType = FilterType.WorkOrder;
  @Input() showStartEndDates: boolean = true;
  @Input() isFrequencyProjected: boolean = false;
  @Input() isFrequencyCalculated: boolean = false;
  @Input() api: ApiEndpoints = ApiEndpoints.PPMAPI;
  @Input() isMultiSelect: boolean = false;
  @Input() isFrequencySelected: boolean = false;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();
  @Input() isFrequencyMandatory: boolean = true;
  @Input() isMonthlyReport: boolean = false;
  @Input() isYearRequired: boolean = false;
  @Input() isExportable: boolean = false;
  @Input() isWOMandatory: boolean = false;
  @Input() setBackFrequency: number = 3;
  @Input() status: number =  0;
  @Input() serviceTypeId: number =  0;
  frequencyAhead: number = 0;
  projected: any;
  ending: any;
  presentWeek: any;

  selectedBuilding: any = '';
  selectedSystem: any = '';
  selectedResource: any = '';
  selectedFrequencyType: any = '';
  selectedWOStatus: any = '';
  selectedWOTypes: any = '';
  selectedFrequency: any = {};

  animationState = 'in';
  frequencyLabel: string = 'Weeks';

  endDateTitle: string = 'Scheduled Date';

  FilterType = FilterType;
  blob!: Blob;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    public datepipe: DatePipe
  ) {
    this.presentWeek =
      new Date().getFullYear() + '-' + CommonHelper.getCurrentWeek(new Date());
    let years = [];
    let startYear = 2023;
    let i = 0;
    do {
      years.push({ id: startYear, name: startYear.toString() });
      startYear += 1;
      i++;
    } while (i <= 10);
    this.seletableData['years'] = years;
    this.seletableData['months'] = this.months;
  }

  toggleShow() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  ngOnInit(): void {
    if(this.filterType === FilterType.WorkOrder && this.serviceTypeId !== ServiceType.PM){
      this.endDateTitle = 'Logged By Date';
    }
    let date = new Date();
    let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    startDate.setMonth(startDate.getMonth() - (this.setBackFrequency ?? 3));
    this.startDate = this.datepipe.transform(startDate, 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');
    this.filterForm = this.fb.group({
      project: [],
      building: [],
      type: [],
      subType: [],
      category: [],
      status: [],
      loc: [],
      system: [],
      tag: [],
      store: [],
      discipline: [],
      shift: [],
      startDate: [this.startDate],
      endDate: [this.endDate],
      weeksAhead: [],
      presentWeek: [],
      projected: [],
      ending: [],
      resource: [],
      frequencyType: [],
      mrCode: [],
      workOrderType: [],
      workOrderStatus: [],
      month: [9],
      year: [2023],
      financeCode: [],
      costCentre: []
    });
    this.getData();
  }

  setFilter() {
    let filterData = this.filterForm.value;
    let frequencyType = this.isMultiSelect
      ? filterData.frequencyType
        ? filterData.frequencyType
            ?.map((f: any) => f.id)
            .filter((d: any) => d > 0)
            .join(',')
        : ''
      : filterData.frequencyType?.id;
    let filter = {};
    switch (this.filterType) {
      case FilterType.MR:
        filter = {
          projectId: filterData.project?.id,
          mrCode: filterData?.mrCode,
          workOrder: filterData?.workOrderType?.id
        };
        break;
      case FilterType.Assets:
        filter = {
          projectId: filterData.project?.id,
          systemId: filterData.system?.id
        };
        break;
      default:
        filter = {
          startDate: filterData.startDate,
          endDate:
            this.filterType === FilterType.Issuer && filterData?.ending
              ? filterData?.ending
              : filterData.endDate,
          projectId: filterData.project?.id,
          buildingId: filterData.building?.id,
          typeId: filterData.type?.id,
          subTypeId: filterData.subType?.id,
          categoryId: filterData.category?.id,
          statusId: filterData.status?.id,
          locId: filterData.loc?.id,
          tag: filterData.tag?.id,
          system: filterData.system?.id,
          storeId: filterData.store?.id,
          disciplineId: filterData.discipline?.id,
          shiftId: filterData.shift?.id,
          weeksAhead: filterData?.weeksAhead,
          presentWeek: filterData?.presentWeek,
          projected: filterData?.projected,
          resourceId: filterData.resource?.id,
          frequencyTypeIds: frequencyType === '' ? null : frequencyType,
          month: filterData.month?.id ?? filterData.month,
          year: filterData.year?.id ?? filterData.year,
          projectName: filterData.project?.name,
          monthName: this.months.find(
            (m) => m.id === (filterData.month?.id ?? filterData.month)
          )?.name,
          masterData: this.masterData
        };
    }
    this.isCollapsed = true;
    this.filterChanged.emit(filter);
  }

  getData() {
    if (this.filterType === FilterType.Accounts) {
      this.isYearRequired = true;
      this.isDataLoaded = true;
      this.seletableData.projects = [
        { id: 13, name: 'C-168 Tower (FAB)', code: 'C168' },
        { id: 9, name: 'C18 Building Muroor Road (FAB)', code: 'C-18' },
        { id: 1, name: 'City Gate Towers', code: 'CTGT' },
        { id: 60, name: 'COL Master Community', code: 'COLMC' },
        { id: 61, name: 'Court Yard Mall -Riyadh City', code: 'CYMR' },
        { id: 5, name: 'Etihad Airways Engineering', code: 'EYAE' },
        { id: 62, name: 'Fish Market', code: 'FISH' }
      ];
      this.seletableData.financeCodes = [
        { id: 1, name: 'Planned Preventive Maintenance', code: 'PPM' },
        { id: 2, name: 'Corrective Maintenance', code: 'CMS' },
        { id: 3, name: 'Reactive Maintenance', code: 'RMS' },
        { id: 4, name: 'Maintenance Order', code: 'MTO' }
      ];
      this.seletableData.costCentres = [
        { financeCodeId: 0, id: 1, name: 'Administration', code: 'ADM' },
        {
          financeCodeId: 0,
          id: 2,
          name: 'Automatic Doors & Shutters',
          code: 'ADS'
        },
        {
          financeCodeId: 0,
          id: 3,
          name: 'Building Fabric, Infrastructure & Architectural',
          code: 'BLD'
        },
        {
          financeCodeId: 0,
          id: 4,
          name: 'Building Management System',
          code: 'BMSM'
        },
        { financeCodeId: 0, id: 5, name: 'Cleaning', code: 'CLNG' },
        { financeCodeId: 0, id: 6, name: 'Consumables', code: 'CNSM' },
        { financeCodeId: 0, id: 7, name: 'Communications', code: 'COMM' },
        { financeCodeId: 0, id: 8, name: 'Civil Works', code: 'CVL' },
        {
          financeCodeId: 0,
          id: 9,
          name: 'Drainage / Sewage System',
          code: 'DRAN'
        },
        { financeCodeId: 0, id: 10, name: 'Electrical', code: 'ELEC' },
        { financeCodeId: 0, id: 11, name: 'Elevator / Escalator', code: 'ELEV' }
      ];
    } else {
      this.apiService.getFilterGridData(this.filterType, this.api).subscribe({
        next: (result: any) => {
          this.masterData = result;
          Object.keys(result).forEach((key) => {
            this.seletableData[key] = result[key];
          });
          this.seletableData.buildings =
            this.filterType === FilterType.MR ||
            this.filterType === FilterType.Assets ||
            this.filterType === FilterType.Reports ||
            this.filterType === FilterType.Export ||
            this.filterType === FilterType.Transfer ||
            this.filterType === FilterType.BlukClose
              ? null
              : [];
          this.seletableData.resources = [];
          this.isDataLoaded = true;
          if(this.isFrequencyCalculated){
            this.calculateWeeks('0');
          }
        },
        error: (e: any) => {
          this.alertService.error('Error Fetching Filters !!', {
            id: 'alert-scheduler'
          });
          console.error(e);
        },
        complete: () => {}
      });
    }
  }

  projectSelected(project: any) {
    this.seletableData.buildings = this.masterData?.buildings?.filter(
      (b: any) => b.projectId === project.id
    );
    this.seletableData.resources = this.masterData?.resources?.filter(
      (r: any) => r.projectId === project.id || r.projectId === 0
    );
    this.selectedBuilding = 'Select Building';
    this.selectedResource = 'Select Resource';
  }

  typeSelected(type: any) {
    this.seletableData.subTypes = this.masterData?.subTypes?.filter(
      (t: any) => t.typeId === type.id
    );
  }

  handleFilter(value: any, type: any): void {
    this.seletableData[type] = this.masterData[type].filter(
      (s: any) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  calculateWeeks(frequency: any) {
    let frequencyType = this.selectedFrequency?.id ?? FrequencyType.Weekly;
    this.frequencyAhead = parseInt(frequency);
    if (frequency >= 0) {
      let year = new Date().getFullYear();
      let currentDate = new Date();
      switch (frequencyType) {
        case FrequencyType.Minutely:
        case FrequencyType.Hourly:
        case FrequencyType.Daily:
          this.ending = new Date(
            currentDate.setDate(currentDate.getDate() + this.frequencyAhead)
          );
          break;
        case FrequencyType.Weekly:
          let weekNumber =
            CommonHelper.getCurrentWeek(new Date()) + parseInt(frequency);
          let elapsedDays = 1 + (weekNumber - 1) * 7;
          currentDate = new Date(year, 0, elapsedDays);
          let lastDayOfWeek = currentDate;
          lastDayOfWeek.setDate(
            currentDate.getDate() - currentDate.getDay() + 6
          );
          this.projected = lastDayOfWeek.getFullYear() + '-' + weekNumber;
          this.ending = lastDayOfWeek;
          break;
        case FrequencyType.Monthly:
          this.ending = new Date(
            currentDate.setMonth(currentDate.getMonth() + this.frequencyAhead)
          );
          break;
        case FrequencyType.Yearly:
          this.ending = new Date(
            currentDate.setFullYear(
              currentDate.getFullYear() + this.frequencyAhead
            )
          );
          break;
      }
      this.ending = this.datepipe.transform(this.ending, 'dd-MMM-yyyy');
      this.filterForm.controls['ending'].setValue(this.ending);
    }
  }

  frequencyTypeSelection(selectedType: any) {
    this.selectedFrequency = selectedType;
    this.frequencyLabel =
      this.selectedFrequency?.name == 'Minutes' ||
      this.selectedFrequency?.name == 'Hours' ||
      this.selectedFrequency?.name == 'Daily'
        ? 'Days'
        : this.selectedFrequency?.name?.replace('ly', 's');
    let filterData = this.filterForm.value;
    this.calculateWeeks(filterData.weeksAhead);
  }

  exportXL() {
    let filterData = this.filterForm.value;
    if (
      this.isProjectMandatory &&
      (filterData.project?.id == '' ||
        filterData.project?.id == undefined ||
        filterData.project?.id == null)
    ) {
      this.alertService.error('Please Select Project !!', {
        id: 'alert-issuer'
      });
    } else if (
      filterData.workOrderType[0]?.id == '' ||
      filterData.workOrderType[0]?.id == undefined ||
      filterData.workOrderType[0]?.id == null
    ) {
      this.alertService.error('Please Select Work Order Type !!', {
        id: 'alert-issuer'
      });
    } else if (
      filterData.workOrderStatus[0]?.id == '' ||
      filterData.workOrderStatus[0]?.id == undefined ||
      filterData.workOrderStatus[0]?.id == null
    ) {
      this.alertService.error('Please Select Work Order Status !!', {
        id: 'alert-issuer'
      });
    } else {
      let workOrderType = this.isMultiSelect
        ? filterData.workOrderType
          ? filterData.workOrderType
              ?.map((f: any) => f.id)
              .filter((d: any) => d > 0)
              .join(',')
          : ''
        : filterData.workOrderType?.id;
      let workOrderStatus = this.isMultiSelect
        ? filterData.workOrderStatus
          ? filterData.workOrderStatus
              ?.map((f: any) => f.id)
              .filter((d: any) => d > 0)
              .join(',')
          : ''
        : filterData.workOrderStatus?.id;
      let workOrderTypeName = this.isMultiSelect
        ? filterData.workOrderType
          ? filterData.workOrderType
              ?.map((f: any) => f.name)
              .filter((d: any) => d != null)
              .join(',')
          : ''
        : filterData.workOrderType?.name;
      let workOrderStatusName = this.isMultiSelect
        ? filterData.workOrderStatus
          ? filterData.workOrderStatus
              ?.map((f: any) => f.name)
              .filter((d: any) => d != null)
              .join(',')
          : ''
        : filterData.workOrderStatus?.name;
      this.exportReportXL = {
        reportType: 2,
        fileType: 2,
        requestTypeId: 1,
        settings: [
          {
            key: 'Project',
            value: filterData?.project?.name
          },
          {
            key: 'Start Date',
            value: filterData?.startDate
          },
          {
            key: 'End Date',
            value: filterData?.endDate
          },
          {
            key: 'Status',
            value: workOrderStatusName
          },
          {
            key: 'Work Order Type',
            value: workOrderTypeName
          },
          {
            key: 'Report Date Time',
            value: this.datepipe.transform(new Date(), 'dd-MMM-yyyy HH:mm')
          }
        ],
        projectId: filterData?.project?.id,
        startDate: filterData?.startDate,
        endDate: filterData?.endDate,
        statusIds: workOrderStatus,
        workOrderTypes: workOrderType
      };
      this.apiService
        .downloadXLReport('FileExport/ExportToExcel', this.exportReportXL)
        .subscribe({
          next: (result: any) => {
            this.blob = new Blob([result], { type: 'octet-stream' });
            var downloadURL = window.URL.createObjectURL(result);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = 'ExcelReport.xlsx';
            link.click();
          }
        });
    }
  }
}
