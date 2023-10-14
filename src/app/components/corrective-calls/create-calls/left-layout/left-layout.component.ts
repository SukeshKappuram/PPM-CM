import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import { LogMode } from './../../../../models/enums/LogMode.enum';

@Component({
  selector: 'app-left-layout',
  templateUrl: './left-layout.component.html',
  styleUrls: ['./left-layout.component.scss']
})
export class LeftLayoutComponent extends CommonComponent {
  locationForm!: FormGroup;
  reportedbyForm!: FormGroup;
  selectedUserType: any;
  selectedUserSubType: any;
  selectedProject: any;
  selectedResource: any;
  buildings: any[] = [];
  units: any[] = [];
  rooms: any[] = [];
  reporterSubTypes: any[] = [];
  selectedClient: any;
  selectedCountry: any;
  currentLog: any = {};
  loggedDate: Date = new Date();
  LogMode = LogMode;
  loggedByUser: any;
  isLoggedByCustomer: boolean = false;

  @Input() mode: LogMode = LogMode.CREATE;
  @Output() locationChanged: EventEmitter<any> = new EventEmitter();
  @Output() projectChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('building') buildingDD!: DropdownComponent;
  @ViewChild('floor') floorDD!: DropdownComponent;
  @ViewChild('unit') unitsDD!: DropdownComponent;
  @ViewChild('room') roomsDD!: DropdownComponent;
  @ViewChild('reporter') reporterDD!: DropdownComponent;
  serviceTypeId: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private ds: DataService,
    private authService: AuthService,
    public localDatePipe: LocalizedDatePipe,
    private route: ActivatedRoute
  ) {
    super();
    this.navState = navService.getNavigationState();
    this.ds.loggedDate.subscribe((logggedDate) => {
      this.loggedDate = logggedDate;
    });
    this.ds.loggedByUser.subscribe((loggedUser) => {
      this.loggedByUser = loggedUser;
    });
    this.masterData['clients'] = [this.navState?.currentAccount];
    this.clientSelected(this.masterData?.clients[0]);
    this.config.defaultCountryCode =
      this.navState?.currentAccount?.mainMobileCode ??
      this.config.defaultCountryCode;
    this.serviceTypeId = this.route.snapshot.data['serviceType'];
  }

  public getLoggedInUser(): any {
    return this.authService.getUser();
  }

  clientSelected(client: any) {
    this.selectedClient = client;
    this.apiService
      .GetTaskLog(`TaskLog/GetProjectsMasterData/${this.navState.currentLogId}`)
      .subscribe({
        next: (result: any) => {
          this.isLoggedByCustomer =
            this.getLoggedInUser()?.designation?.toLowerCase() === 'customer';
          this.masterData['projects'] = result;
          this.filteredData = { ...this.masterData };
          this.locationForm = this.fb.group({
            project: [
              this.masterData?.projects?.length === 1 &&
              this.navState.currentLogId > 0
                ? this.masterData?.projects[0]?.id
                : null,
              Validators.required
            ],
            building: [
              this.masterData?.locationModel?.buildingId,
              Validators.required
            ],
            floor: [
              this.masterData?.locationModel?.floorId,
              Validators.required
            ],
            unit: [this.masterData?.locationModel?.unitId, Validators.required],
            room: [this.masterData?.locationModel?.roomId, Validators.required]
          });
          this.reportedbyForm = this.fb.group({
            reporter: ['', Validators.required],
            name: ['', Validators.required],
            email: ['', Validators.email],
            mobile: [
              '',
              [
                Validators.pattern('^[0-9]*$'),
                Validators.minLength(6),
                Validators.maxLength(15)
              ]
            ],
            countryId: ['']
          });
          if (this.navState.currentLogId > 0) {
            this.projectSelected({ id: this.masterData?.projects[0]?.id });
          }
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

  countrySelected(country: any) {
    this.selectedCountry = country;
    this.reportedbyForm.controls['countryId']?.setValue(country.mobileCode);
  }

  projectSelected(project: any, resetValue: boolean = false) {
    this.selectedProject = project.id;
    this.projectChanged.emit(this.selectedProject);
    this.apiService
      .GetTaskLog(
        `TaskLog/GetLocationAndResourceMasterData/${this.navState.currentLogId}/${this.selectedProject}`
      )
      .subscribe({
        next: (result: any) => {
          this.masterData = { ...this.masterData, ...result };
          this.filteredData = { ...this.masterData };
          if (resetValue) this.resetForm();
          this.navState = this.navService.getNavigationState();
          this.selectedCountry = result.countryCodes.find(
            (code: any) => code.mobileCode === this.config?.defaultCountryCode
          );
          this.reportedbyForm.controls['countryId']?.setValue(
            this.selectedCountry?.mobileCode
          );
          if (this.navState.currentLogId > 0) {
            let currentLog = {
              project: this.masterData?.projects[0]?.id,
              building:
                this.currentLog?.building ??
                this.masterData?.locationModel?.buildingId,
              floor:
                this.currentLog?.floor ??
                this.masterData?.locationModel?.floorId,
              unit:
                this.currentLog?.unit ?? this.masterData?.locationModel?.unitId,
              room:
                this.currentLog?.room ?? this.masterData?.locationModel?.roomId
            };
            this.locationForm.patchValue(currentLog);
            this.selectLocationChange();
            this.ds.currentTaskLog.subscribe((taskLog: any) => {
              this.currentLog = taskLog;
              if (this.currentLog?.isAutoIssued) {
                this.reportedbyForm?.get('name')?.clearValidators();
                this.reportedbyForm?.get('email')?.clearValidators();
                this.reportedbyForm?.get('mobile')?.clearValidators();
              }
              let reporterType = result.reporterTypes?.find(
                (r: any) => r.id === this.currentLog?.reporterTypeId
              );
              this.userTypeSelected(reporterType ?? result.reporterTypes[0]);
              this.buildingChanged({
                id:
                  this.currentLog?.buildingId ??
                  this.masterData?.locationModel?.buildingId
              });
            });
          } else if (this.navState.currentLogId == 0) {
            this.userTypeSelected(result.reporterTypes[0]);
            this.buildingChanged({
              id:
                this.currentLog?.buildingId ??
                this.masterData?.locationModel?.buildingId
            });
          }
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

  buildingChanged(building: any, resetValues: boolean = false) {
    this.units = [];
    this.rooms = [];
    let buildingId = building.id;
    this.units =
      buildingId === ''
        ? []
        : this.masterData.units?.filter(
            (u: any) => u.buildingId === buildingId
          );
    this.rooms = [];
    this.filteredData['units'] = this.units;
    this.filteredData['rooms'] = this.rooms;
    if (!this.currentLog?.floorId || resetValues) {
      this.locationForm.controls['floor'].setValue(null);
    }
    this.floorChanged(resetValues);
    if (resetValues) this.selectLocationChange();
    this.unitChanged(
      {
        id: this.currentLog?.unitId ?? this.masterData?.locationModel?.unitId
      },
      resetValues
    );
  }

  floorChanged(resetValues: boolean = false) {
    if (!this.currentLog?.floorId || resetValues) {
      this.locationForm.controls['unit'].setValue(null);
      this.locationForm.controls['room'].setValue(null);
      this.selectLocationChange();
    }
  }

  unitChanged(unit: any, resetValues: boolean = false) {
    let unitId = unit.id;
    this.rooms =
      unitId === ''
        ? []
        : this.masterData.rooms.filter((r: any) => r.unitId === unitId);
    this.filteredData['rooms'] = this.rooms;
    if (!this.currentLog?.roomId || resetValues) {
      this.locationForm.controls['room'].setValue(null);
      this.selectLocationChange();
    }
  }

  updateForm(): void {
    let locationForm = this.locationForm.value;
    this.locationForm.patchValue(locationForm.value);
  }

  userTypeSelected(userType: any) {
    this.selectedUserType = userType;
    this.reporterSubTypes = this.masterData?.reporterSubTypes?.filter(
      (u: any) => u.reporterTypeId === parseInt(userType.id)
    );
    let reporterSubType = this.reporterSubTypes?.find(
      (r: any) => r.id === this.currentLog?.reporterSubTypeId
    );
    this.resourceTypeChanged(reporterSubType ?? this.reporterSubTypes[0]);
  }

  resourceTypeChanged(subType: any) {
    this.selectedUserSubType = subType;
    this.selectedCountry = this.masterData?.countryCodes?.find(
      (code: any) =>
        code.mobileCode ===
        (this.currentLog?.mobileCode ?? this.config?.defaultCountryCode)
    );
    this.reportedbyForm.controls['countryId']?.setValue(
      this.selectedCountry?.mobileCode
    );
    this.selectResource({
      id: this.currentLog?.reportedById ?? 0
    });
  }

  selectResource(event: any) {
    let resourceId = event?.id ?? '';
    if (this.isLoggedByCustomer) {
      this.selectedResource = this.masterData?.customer;
    } else {
      this.selectedResource = this.masterData?.resources?.find(
        (r: any) => r.id === resourceId
      );
    }
    let resourceData = this.reportedbyForm.value;
    resourceData.reporter = this.selectedResource?.id;
    resourceData.name = this.selectedResource?.name;
    resourceData.email = this.selectedResource?.email;
    resourceData.mobile = this.selectedResource?.mobileNo;
    this.selectedCountry = this.masterData?.countryCodes?.find(
      (code: any) => code.mobileCode === this.config?.defaultCountryCode
    );
    setTimeout(() => {
      this.reportedbyForm.patchValue(resourceData);
    }, 500);
  }

  getFormData(): any {
    let locationFormValue = this.locationForm.value;
    locationFormValue['countryId'] =
      this.selectedCountry?.mobileCode ?? this.config.defaultCountryCode;
    locationFormValue['reportingUserTypeId'] = this.selectedUserType.id;
    locationFormValue['reportingUserSubTypeId'] = this.selectedUserSubType.id;
    return { ...locationFormValue, ...this.reportedbyForm.value };
  }

  resetForm() {
    this.locationForm.controls['building'].setValue(null);
    this.locationForm.controls['floor'].setValue(null);
    this.locationForm.controls['unit'].setValue(null);
    this.locationForm.controls['room'].setValue(null);
  }

  selectLocationChange() {
    this.updateForm();
    setTimeout(() => {
      this.locationChanged.emit(this.locationForm.value);
    }, 1000);
  }
  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
