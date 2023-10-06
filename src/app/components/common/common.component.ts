import { Component, HostListener } from '@angular/core';

import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { ColumnFormat } from 'src/app/models/enums/ColumnFormat.enum';
import { CountryCodes } from './../../models/enums/CountryCodes.enum';
import { DataService } from 'src/app/services/data.service';
import { FilterType } from 'src/app/models/enums/FilterType.enum';
import { FormatHelper } from 'src/app/helpers/FormatHelper';
import { IActions } from 'src/app/models/interfaces/IActions';
import { IButton } from 'src/app/models/interfaces/IButton';
import { IGridData } from 'src/app/models/interfaces/IGridData';
import { IMenuItem } from 'src/app/models/interfaces/IMenuItem';
import { INavaigationState } from 'src/app/models/interfaces/INavaigationState';
import { IUserAccess } from 'src/app/models/interfaces/auth/IUserAccess';
import { Popups } from 'src/app/models/enums/Popups.enum';
import { ReportType } from 'src/app/models/enums/ReportType.enum';
import defaultConfig from '../../helpers/config.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export abstract class CommonComponent {
  public config: any;
  public mobileCode: any;
  public alternateMobileCode: any;
  public landLineCode: any;
  public faxNoCode: any;
  protected masterData: any = {};
  protected filteredData: any = {};
  protected isDataLoaded: boolean = false;
  protected isEditable: boolean = true;
  protected gridData: IGridData = {
    configuration: {
      columns: [],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: true,
      canEdit: true,
      canDelete: true
    },
    data: []
  };
  protected formData: any = {};
  protected navState!: INavaigationState;
  protected buttons: IButton[] = [];
  protected apiEndpoint: ApiEndpoints = ApiEndpoints.AMAPI;
  protected isFormValid: boolean = false;
  protected pageTitle: string = '';
  protected FilterType = FilterType;
  protected Popups = Popups;
  protected userAccess!: IUserAccess;

  public CountryCodes = CountryCodes;
  protected chooseables: any[] = [
    { id: 0, name: 'No' },
    { id: 1, name: 'Yes' }
  ];

  protected ApiEndpoints = ApiEndpoints;
  protected ColumnFormat = ColumnFormat;
  protected ReportType = ReportType;
  protected PasswordView: any = {
    password: 'password',
    newPassword: 'password',
    confirmPassword: 'password'
  };

  constructor(protected dataService: DataService = new DataService()) {
    this.config = defaultConfig;
    this.config['isProduction'] = environment.envName === 'prod';
  }

  @HostListener('scroll', ['$event'])
  public scrollHandler(event: any) {
    if (event.target.scrollTop > 100) {
      this.dataService.updateState('block');
    } else {
      this.dataService.updateState('none');
    }
  }

  scrollToTop(el: any) {
    el.scrollTop = 0;
  }

  //only number will be add
  public validateNumericInput(
    event: any,
    minimumDigits: number = 1,
    maximumDigits: number = 10
  ): void {
    const pattern = /[0-9 ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (
      (event.keyCode != 8 && !pattern.test(inputChar)) ||
      event.target.value.length === maximumDigits
    ) {
      event.preventDefault();
    }
  }

  public defaultItem(text: string): any {
    return {
      code: 'Select',
      name: text
    };
  }

  public countryCodeSelected(
    selectedCode: any,
    type: CountryCodes = CountryCodes.MOBILE
  ) {
    switch (type) {
      case CountryCodes.MOBILE:
        this.mobileCode = this.masterData?.countries?.find(
          (country: any) => country.dialCode === selectedCode.dialCode
        );
        break;
      case CountryCodes.ALTERNATE:
        this.alternateMobileCode = this.masterData?.countries?.find(
          (country: any) => country.dialCode === selectedCode.dialCode
        );
        break;
      case CountryCodes.LANDLINE:
        this.landLineCode = this.masterData?.countries?.find(
          (country: any) => country.dialCode === selectedCode.dialCode
        );
        break;
      case CountryCodes.FAX:
        this.faxNoCode = this.masterData?.countries?.find(
          (country: any) => country.dialCode === selectedCode.dialCode
        );
        break;
    }
  }

  pad(num: number, size: number): string {
    return FormatHelper.pad(num, size);
  }

  protected abstract buttonClicked(buttonType: any): void;

  protected saveOrEdit(): void {
    if (this.isEditable) {
      this.save();
    }
    this.isEditable = !this.isEditable;
    this.updateButtons();
  }

  protected save(): void {}

  protected updateButtons(isDisabled: boolean = false): void {
    let savebutton = this.buttons.find((b: any) => b.id === 'Save');
    if (savebutton) {
      savebutton.label = this.isEditable ? 'save' : 'edit';
      savebutton.icon = this.isEditable
        ? 'bi bi-check-circle'
        : 'bi bi-pencil-square';
      savebutton.isDisabled = this.isEditable;
    }
  }

  validateEmailPattern(event: any): void {
    const EMAIL_REGEXP =
      /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/i;
    if (!EMAIL_REGEXP.test(event.target.value)) {
      event.preventDefault();
    }
  }

  getStatusText(status: string): string {
    let icon = '';
    let statusType = '';
    status = status.split(',')[0];
    switch (status) {
      case 'Blocked':
        icon = 'bi bi-lock';
        statusType = 'dark';
        break;
      case 'Cancelled':
        icon = 'bi bi-x';
        statusType = 'warning';
        break;
      case 'Dropped':
        icon = 'bi bi-arrow-down';
        statusType = 'danger';
        break;
      case 'Issued':
        icon = 'bi bi-list-check';
        statusType = 'success';
        break;
      case 'Omitted':
        icon = 'bi bi-x';
        statusType = 'secondary';
        break;
      case 'Overriden':
        icon = 'bi bi-info';
        statusType = 'info';
        break;
      case 'Planned':
        icon = 'bi bi-primary';
        statusType = 'primary';
        break;
    }
    return (
      '<a class="badge badge-flat badge-pill border-' +
      statusType +
      ' text-' +
      statusType +
      '"><i class="' +
      icon +
      ' mr-2"></i>' +
      status +
      '</a>'
    );
  }

  setToString(set: Set<number>, delim: string) {
    let str = '';
    set.forEach(function (elem) {
      str += elem + delim;
    });
    return str;
  }

  getNonEmptyOrUndefinedValue(value: any): boolean {
    return value === undefined || value === '' ? null : value;
  }

  handleFilter(
    value: any,
    type: any,
    key: string = 'name',
    secondaryKey: string = 'code'
  ): void {
    this.filteredData[type] = this.masterData[type].filter(
      (s: any) =>
        s[key]?.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        (secondaryKey in s &&
          s[secondaryKey]?.toLowerCase().indexOf(value.toLowerCase()) !== -1)
    );
  }

  handleFilterByDataSet(
    dataSet: any,
    value: any,
    type: any,
    key: string = 'name',
    secondaryKey: string = 'code',
    index?: number
  ): void {
    if (index != undefined || index != null) {
      this.filteredData[type][index] = dataSet.filter(
        (s: any) =>
          s[key]?.toLowerCase().includes(value.toLowerCase()) |
          ((secondaryKey in s &&
            s[secondaryKey]?.toLowerCase().includes(value.toLowerCase())) ||
            s[key]?.toLowerCase()?.includes(value?.toLowerCase()))
      );
    } else {
      this.filteredData[type] = dataSet.filter(
        (s: any) =>
          s[key]?.toLowerCase().includes(value.toLowerCase()) ||
          (secondaryKey in s &&
            s[secondaryKey]?.toLowerCase().includes(value.toLowerCase()))
      );
    }
  }

  protected togglePassword(key: string): void {
    this.PasswordView[key] =
      this.PasswordView[key] === 'password' ? 'text' : 'password';
  }

  protected convertToUserAccess = (menuAccess?: IMenuItem): IUserAccess => {
    return {
      canAdd: menuAccess?.canAdd ?? false,
      canApprove: menuAccess?.canApprove ?? false,
      canDelete: menuAccess?.canDelete?? false,
      canDownload: menuAccess?.canDownload?? false,
      canExport: menuAccess?.canExport?? false,
      canUpdate: menuAccess?.canUpdate?? false
    };
  };

  protected mapUserAccess(
    actions: IActions,
    userAccess: IUserAccess
  ): IActions {
    let userActions: IActions = {
      canAdd: actions?.canAdd && userAccess?.canAdd,
      canEdit: actions?.canEdit,
      canDelete: actions?.canDelete && userAccess?.canDelete,
      canSelect:
        actions?.canSelect,
      canSearch: actions?.canSearch,
      canAccessPDF: actions?.canAccessPDF && userAccess?.canExport,
      canAccessExcel: actions?.canAccessExcel && userAccess?.canExport,
      modifyColumnView: actions?.modifyColumnView,
      canExport: actions?.canExport && userAccess?.canExport,
      canTransfer: actions?.canTransfer
    };
    return userActions;
  }
}
