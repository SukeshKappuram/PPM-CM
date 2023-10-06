import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { IAssetData } from 'src/app/models/interfaces/IAssetData';
import { IMasterData } from 'src/app/models/interfaces/IMasterData';
import { INavaigationState } from 'src/app/models/interfaces/INavaigationState';
import { IUserAccess } from 'src/app/models/interfaces/auth/IUserAccess';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent
  extends CommonComponent
  implements OnInit, OnChanges
{
  generalForm: FormGroup = new FormGroup({});
  othersForm: FormGroup = new FormGroup({});
  locationForm: FormGroup = new FormGroup({});

  maintainanceCarriers: any[] = [
    { id: 1, name: 'Inhouse' },
    { id: 2, name: 'Outsourced' }
  ];

  subSystems: any[] | undefined = [];
  states: any[] | undefined = [];
  cities: any[] | undefined = [];
  sites: any[] | undefined = [];
  zones: any[] | undefined = [];
  buildings: any[] | undefined = [];
  unitOrSpaces: any[] | undefined = [];
  existingAssets: any[] | undefined = [];
  rooms: any[] | undefined = [];

  generals: any;
  selectedBuildingId: any;

  isCritical: boolean = false;
  isChildAsset: boolean = false;
  isOutSourced: boolean = false;

  @Input() override isEditable: boolean = false;
  @Input() override masterData!: IMasterData;
  @Input() saveAt: string = '';
  @Input() override userAccess!: IUserAccess;

  @Output() formValidated: EventEmitter<any> = new EventEmitter();
  @Output() subSystemChanged = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private navService: NavigationService,
    private alertService: SweetAlertService,
    private router: Router
  ) {
    super();
    this.retriveData();
  }

  ngOnInit() {
    let isEditable = this.isEditable;
    this.isEditable = true;
    this.masterData = {
      ...this.masterData,
      ...{ maintainanceCarriers: this.maintainanceCarriers }
    };
    this.filteredData = { ...this.masterData };
    if (this.navState.currentAssertId > 0) {
      this.subSystems = this.masterData?.subSystemCodes.filter(
        (subSystem) => subSystem.systemId === this.generals?.systemId
      );
      this.filteredData['subSystems'] = this.subSystems;
    }

    if (this.navState.currentAssertId == 0) {
      this.generalForm = this.fb.group({
        assetName: [this.generals?.assetName, Validators.required],
        assetCode: [this.generals?.assetCode, Validators.required],
        type: [this.generals?.typeId, Validators.required],
        system: [this.generals?.systemId, Validators.required],
        subSystem: [this.generals?.subSystemId, Validators.required],
        tag: [this.generals?.tagId, Validators.required],
        manufacturer: [this.generals?.manufacturer ?? ''],
        productCode: [this.generals?.productCode ?? ''],
        model: [this.generals?.model ?? ''],
        serialNo: [this.generals?.serialNo ?? ''],
        group: [this.generals?.group ?? ''],
        drawing: [this.generals?.drawing ?? ''],
        description: [this.generals?.description ?? '', Validators.required],
        assetCriticalityType: [this.generals?.assetCriticalityTypeId ?? ''],
        locationOrAssetDescription: [
          this.generals?.criticalityDescription ?? ''
        ],
        capacity: [this.generals?.capacity ?? ''],
        uOM: [this.generals?.uomId],
        maintainabilityType: [
          this.generals?.maintainabilityTypeId,
          Validators.required
        ],
        maintainanceCarriedOutBy: [, Validators.required],
        subContractor: [this.generals?.vendorId]
      });
    } else {
      this.generalForm = this.fb.group({
        assetName: [this.generals?.assetName, Validators.required],
        assetCode: [this.generals?.assetCode, Validators.required],
        type: [this.generals?.typeId, Validators.required],
        system: [this.generals?.systemId, Validators.required],
        subSystem: [this.generals?.subSystemId, Validators.required],
        tag: [this.generals?.tagId, Validators.required],
        manufacturer: [this.generals?.manufacturer ?? ''],
        productCode: [this.generals?.productCode ?? ''],
        model: [this.generals?.model ?? ''],
        serialNo: [this.generals?.serialNo ?? ''],
        group: [this.generals?.group ?? ''],
        drawing: [this.generals?.drawing ?? ''],
        description: [this.generals?.description ?? '', Validators.required],
        assetCriticalityType: [this.generals?.assetCriticalityTypeId ?? ''],
        locationOrAssetDescription: [
          this.generals?.criticalityDescription ?? ''
        ],
        capacity: [this.generals?.capacity ?? ''],
        uOM: [this.generals?.uomId],
        maintainabilityType: [
          this.generals?.maintainabilityTypeId,
          Validators.required
        ],
        maintainanceCarriedOutBy: [
          this.isOutSourced ? 2 : 1,
          Validators.required
        ],
        subContractor: [this.generals?.vendorId]
      });
    }

    this.othersForm = this.fb.group({
      quantity: [this.generals?.quantity ?? 1],
      pack: [this.generals?.pack ?? 1],
      isChildAsset: [this.generals?.isChildAsset],
      parentAssetCode: [this.generals?.assetParentId],
      comments: [this.generals?.comments ?? '']
    });

    this.locationForm = this.fb.group({
      country: [this.generals?.countryId, Validators.required],
      state: [this.generals?.stateId, Validators.required],
      city: [this.generals?.cityId, Validators.required],
      masterDevelopment: [
        this.generals?.masterDevelopmentId,
        Validators.required
      ],
      sectorOrZone: [this.generals?.zoneId],
      building: [this.generals?.buildingId, Validators.required],
      floor: [this.generals?.floorId, Validators.required],
      unitOrSpace: [this.generals?.unitId, Validators.required],
      roomName: [this.generals?.roomId, Validators.required],
      comments: [this.generals?.locationComments ?? '']
    });

    this.generalForm.valueChanges.subscribe(() => this.validateForm());
    this.othersForm.valueChanges.subscribe(() => this.validateForm());
    this.locationForm.valueChanges.subscribe(() => this.validateForm());

    this.isEditable = isEditable;
    // this.systemSelected({ id: this.generals?.systemId }, true);
    this.countrySelected({ id: this.generals?.countryId });
    this.floorSelected({ id: this.generals?.unitId });
    this.selectedBuildingId = this.generals?.buildingId;
    this.childAssetSelected({ id: this.generals?.isChildAsset });
  }

  ngOnChanges(): void {
    if (this.generals !== undefined && this.generals !== null) {
      this.subSystemChanged.emit(this.generals?.subSystemId);
    }
  }

  public retriveData(): void {
    this.navState = this.navService.getNavigationState();
    if (this.navState.currentAssertId > 0) {
      this.navState.isAssetIdValid = true;
      let assetDetails: IAssetData = this.navState.assetData;
      this.generals = assetDetails?.generals;
      if (this.generals) {
        this.isCritical = this.generals?.isAssetCritical;
        this.isOutSourced = this.generals?.isMaintainedOutsourced;
        this.generals['maintainanceCarriedOutBy'] = this.isOutSourced ? 2 : 1;
        this.isChildAsset =
          assetDetails?.generals?.isChildAsset === 1 ? true : false;
      }
    } else {
      this.navState.isAssetIdValid = false;
    }
    this.navService.setNavigationState(this.navState);
  }

  override save(): void {
    if (this.generalForm.valid) {
      const general = this.generalForm.value;
      this.formData.assetName = general.assetName;
      this.formData.assetCode = general.assetCode;
      this.formData.typeId = general.type?.id ?? general.type;
      this.formData.systemId = general.system?.id ?? general.system;
      this.formData.subSystemId = general.subSystem?.id ?? general.subSystem;
      this.formData.tagId = general.tag?.id ?? general.tag;
      this.formData.manufacturer = general.manufacturer;
      this.formData.productCode = general.productCode;
      this.formData.model = general.model;
      this.formData.capacity = general.capacity;
      this.formData.serialNo = general.serialNo;
      this.formData.group = general.group;
      this.formData.drawing = general.drawing;
      this.formData.description = general.description;
      this.formData.isAssetCritical = this.isCritical;
      this.formData.assetCriticalityTypeId = general.assetCriticalityType;
      this.formData.uomId = CommonHelper.isEmptyOrNull(
        general.uOM?.id ?? general.uOM
      )
        ? general.uOM?.id ?? general.uOM
        : parseInt(general.uOM?.id ?? general.uOM);
      this.formData.criticalityDescription = general.locationOrAssetDescription;

      this.formData.maintainabilityTypeId = parseInt(
        CommonHelper.isEmptyOrNull(
          general.maintainabilityType?.id ?? general.maintainabilityType
        )
          ? 0
          : general.maintainabilityType?.id ?? general.maintainabilityType
      );
      this.formData.isMaintainedOutsourced =
        general.maintainanceCarriedOutBy?.id === 2 ??
        general.maintainanceCarriedOutBy === 2
          ? true
          : false;
      this.formData.vendorId =
        general.subContractor?.id ?? general.subContractor;
    } else {
      this.alertService.error('Error updating asset details!!', {
        id: 'alert-asset'
      });
      return;
    }
    if (this.othersForm.valid) {
      const others = this.othersForm.value;
      this.formData.quantity = parseInt(
        CommonHelper.isEmptyOrNull(others.quantity) ? 0 : others.quantity
      );
      this.formData.pack = parseInt(
        CommonHelper.isEmptyOrNull(others.pack) ? 0 : others.pack
      );
      this.formData.isChildAsset =
        others.isChildAsset?.id ?? others.isChildAsset;
      this.formData.assetParentId =
        others.parentAssetCode?.id ?? others.parentAssetCode;
      this.formData.comments = others.comments;
    } else {
      this.alertService.error('Error updating asset details!!', {
        id: 'alert-asset'
      });
      return;
    }

    if (this.locationForm.valid) {
      const location = this.locationForm.value;
      this.formData.countryId = location.country?.id ?? location.country;
      this.formData.stateId = location.state?.id ?? location.state;
      this.formData.cityId = location.city?.id ?? location.city;
      this.formData.masterDevelopmentId =
        location.masterDevelopment?.id ?? location.masterDevelopment;
      this.formData.zoneId = location.sectorOrZone?.id ?? location.sectorOrZone;
      this.formData.buildingId = location.building?.id ?? location.building;
      this.formData.floorId = location.floor?.id ?? location.floor;
      this.formData.unitId = location.unitOrSpace?.id ?? location.unitOrSpace;
      this.formData.roomId = location.roomName?.id ?? location.roomName;
      this.formData.locationComments = location.comments;
    } else {
      this.alertService.error('Error updating asset details!!', {
        id: 'alert-asset'
      });
      return;
    }
    let navState: INavaigationState = this.navService.getNavigationState();
    this.formData.assetId = navState.currentAssertId ?? 0;
    let currentAssertId = this.formData.assetId;
    this.apiService
      .SaveAsset(this.saveAt + 'General', this.formData)
      .subscribe({
        next: (result) => {
          if (result > 0) {
            this.formData.assetId = result;
            navState.assetData = { generals: this.formData };
            navState.currentAssertId = result;
            navState.isAssetIdValid = true;
            this.navService.setNavigationState(navState);
            this.subSystemChanged.emit(this.formData.subSystemId);
            this.alertService
              .success('Saved asset Successfully!!', {
                id: 'alert-asset'
              })
              .then(() => {
                if (currentAssertId === 0) {
                  this.router.navigate([Navigate.EDIT_ASSET]);
                }
              });
          } else if (result === -3) {
            this.alertService.error(
              'Asset Code Already Exists. Please Enter Unique Asset Code',
              {
                id: 'alert-asset'
              }
            );
          } else {
            this.alertService.error('Could not update asset details!!', {
              id: 'alert-asset'
            });
          }
        },
        error: (e) => {
          this.alertService.error('Error updating asset details!!', {
            id: 'alert-asset'
          });
          console.error(e);
        },
        complete: () => {
          this.navService.setNavigationState(navState);
        }
      });
  }

  maintainanceChanged(selectedId: any): void {
    this.isOutSourced = selectedId.id == 2 ? true : false;
  }

  systemSelected(selectedId: any, isDefaultCall = false): void {
    this.navState = this.navService.getNavigationState();
    let asset = this.navState.assetData;
    if (!isDefaultCall && asset?.parameters?.length > 0) {
      this.generals.systemId = '';
      this.alertService.error(
        'Please clear the parameters if you wish to change the subsystem',
        { id: 'alert-asset' }
      );
      setTimeout(() => {
        this.generals.systemId = asset.generals?.systemId;
      }, 100);
    }

    if (
      asset?.parameters === undefined ||
      asset?.parameters?.length == 0 ||
      isDefaultCall
    ) {
      this.subSystems = this.masterData?.subSystemCodes.filter(
        (subSystem) => subSystem.systemId === selectedId.id
      );
      this.filteredData['subSystems'] = this.subSystems;
      let isEditable = this.isEditable;
      this.isEditable = true;
      if (!this.generals?.subsystemId) {
        this.generalForm.controls['subSystem'].setValue(null);
      } else if (this.generals?.subsystemId) {
        this.generalForm.controls['subSystem'].setValue(
          this.generals?.subSystemId
        );
      }
      this.isEditable = isEditable;
    }
  }

  childAssetSelected(selectedId: any): void {
    this.isChildAsset = selectedId.id == 1 ? true : false;
    if (this.isChildAsset && this.selectedBuildingId > 0) {
      this.apiService
        .GetMasterData(
          `Activity/GetAssetBasicDetailsByBuilding/${this.selectedBuildingId}`
        )
        .subscribe({
          next: (result) => {
            this.masterData['existingAssets'] = result;
            this.existingAssets = this.masterData?.existingAssets.filter(
              (u) => u.buildingId == this.selectedBuildingId
            );
          },
          error: (e) => {
            this.alertService.error('Error retreving assets !!', {
              id: 'alert-asset'
            });
            console.error(e);
          },
          complete: () => {}
        });
    } else if (this.isChildAsset) {
      this.alertService
        .error('Please Select Building !!', {
          id: 'alert-asset'
        })
        .then(() => {
          this.othersForm.controls['isChildAsset'].setValue(null);
        });
    } else {
      this.existingAssets = [];
    }
  }

  countrySelected(selectedId: any): void {
    this.states = this.masterData?.states.filter(
      (state) => state.countryId == selectedId.id
    );
    if (!this.generals?.stateId) {
      this.locationForm.controls['state'].setValue(null);
    }
    this.stateSelected({ id: this.generals?.stateId });
  }

  stateSelected(selectedId: any): void {
    this.cities = this.masterData?.cities.filter(
      (city) => city.stateId == selectedId.id
    );
    if (!this.generals?.cityId) {
      this.locationForm.controls['city'].setValue(null);
    }
    this.citySelected({ id: this.generals?.cityId });
  }

  citySelected(selectedId: any): void {
    this.sites = this.masterData?.masterDevelopments.filter(
      (site) => site.cityId == selectedId.id
    );
    if (!this.generals?.masterDevelopmentId) {
      this.locationForm.controls['masterDevelopment'].setValue(null);
    }
    this.siteSelected({ id: this.generals?.masterDevelopmentId });
  }

  siteSelected(selectedId: any): void {
    this.zones = this.masterData?.zones.filter(
      (zone) => zone.masterDevelopmentId == selectedId.id
    );
    if (!this.generals?.zoneId) {
      this.locationForm.controls['sectorOrZone'].setValue(null);
    }
    this.zoneSelected({ id: this.generals?.zoneId }, selectedId.id);
  }

  zoneSelected(selectedId: any, masterDevId: any = null): void {
    const masterDevelopmentId =
      this.generals?.masterDevelopmentId ?? masterDevId;
    const zoneId = selectedId.id ?? null;
    if (zoneId == null || zoneId == undefined) {
      this.buildings = this.masterData?.buildings.filter(
        (building) => building.masterDevelopmentId === masterDevelopmentId
      );
    } else {
      this.buildings = this.masterData?.buildings.filter(
        (building) =>
          building.masterDevelopmentId === masterDevelopmentId &&
          building.zoneId == zoneId
      );
    }
    if (!this.generals?.buildingId) {
      this.locationForm.controls['building'].setValue(null);
    }
    this.buildingSelected({ id: this.generals?.buildingId });
  }

  buildingSelected(selectedId: any): void {
    this.selectedBuildingId = selectedId.id;
    this.othersForm.controls['isChildAsset'].setValue(
      this.generals?.isChildAsset ?? null
    );
    this.childAssetSelected({ id: this.generals?.isChildAsset ?? false });
    this.unitOrSpaces = this.masterData?.unitsORSpaces.filter(
      (u) => u.buildingId == selectedId.id
    );
    if (!this.generals?.unitId) {
      this.locationForm.controls['unitOrSpace'].setValue(null);
    }
    this.floorSelected({ id: this.generals?.unitId });
  }

  floorSelected(selectedId: any): void {
    this.rooms = this.masterData?.rooms.filter(
      (room) => room.unitId == selectedId.id
    );
    if (!this.generals?.roomId) {
      this.locationForm.controls['roomName'].setValue(null);
    }
  }

  validateSubSystem(event: any): void {
    this.navState = this.navService.getNavigationState();
    let asset = this.navState.assetData;
    if (asset?.parameters?.length == 0) {
      this.subSystemChanged.emit(event);
    } else {
      this.generals.subSystemId = '';
      this.alertService.error(
        'Please clear the parameters if you wish to change the subsystem',
        { id: 'alert-asset' }
      );
      setTimeout(() => {
        this.generals.systemId = asset.generals?.subSystemId;
      }, 100);
    }
  }

  private validateForm(): void {
    let isFormValid =
      this.generalForm.valid &&
      this.othersForm.valid &&
      this.locationForm.valid;
    if (this.isFormValid !== isFormValid) {
      this.isFormValid = isFormValid;
      this.formValidated.emit(this.isFormValid);
    }
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
