import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeoLocationsComponent } from './geo-locations/geo-locations.component';

import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { AttachmentLinkGroup } from 'src/app/models/enums/AttachmentLinkGroup.enum';
import { AttachmentType } from 'src/app/models/enums/AttachmentType.enum';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import buttons from '../../../../../helpers/buttons.json';
import { MasterComponentTypes } from './../../../../../models/enums/MasterComponentTypes.enum';

@Component({
  selector: 'app-tabs-master-view',
  templateUrl: './tabs-master-view.component.html',
  styleUrls: ['./tabs-master-view.component.scss']
})
export class TabsMasterViewComponent extends CommonComponent {
  generalInfo!: FormGroup;
  locations!: FormGroup;
  finance!: FormGroup;
  services!: FormGroup;
  dimensions!: FormGroup;
  otherDetails!: FormGroup;
  builtupArea!: FormGroup;
  plotArea!: FormGroup;
  additionalInfo!: FormGroup;
  otherReferences!: FormGroup;
  govtRefNo!: FormGroup;
  utilitiesInfo!: FormGroup;
  clientDetails!: FormGroup;
  personalInfo!: FormGroup;
  contactInfo!: FormGroup;
  docImagesInfo!: FormGroup;

  activeTabId: number = 1;
  MasterTypes = MasterComponentTypes;
  currentView: MasterComponentTypes = MasterComponentTypes.PROJECTS;

  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  selectedBuilding: any;
  selectedClient: any;
  selectedFacilities: any[] = [];
  selectedSkillSet: any = new Set();
  selectedLanguages: any = new Set();
  selectedResourceTypeId: number = 0;
  developedBy: any;
  buildAreaInSqMtrs: number = 0;
  plotAreaInSqMtrs: number = 0;
  commonAreaInSqMtrs: number = 0;
  currentLocation: any;
  propertyType: string = 'Apartment';
  isEmailRequired: boolean = true;
  isEmailsRequired: boolean = false;
  currentPassword: string = '';

  directions: any[] = [
    { id: 'east', name: 'East' },
    { id: 'west', name: 'West' },
    { id: 'north', name: 'North' },
    { id: 'south', name: 'South' }
  ];

  statuses: any[] = [
    { id: 'new', name: 'New' },
    { id: 'active', name: 'Active' },
    { id: 'in-progress', name: 'In Progress' },
    { id: 'completed', name: 'Completed' }
  ];

  resourceStatuses: any[] = [
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' }
  ];

  serviceTypes: any[] = [
    { id: 1, name: 'Service Lines' },
    { id: 2, name: 'Utilities' },
    { id: 3, name: 'Others' }
  ];
  issuanceList: any[] = [
    { id: 1, name: 'Days in advance' },
    { id: 2, name: 'On dayof the month' }
  ];

  facilities: any[] = [
    'Gym',
    'SwimmingPool',
    'BadmintonCourt',
    'PlayArea',
    'Clinic',
    'ATM',
    'SuperMarket'
  ];
  states: any[] = [];
  cities: any[] = [];
  departments: any[] = [];
  roleAccesses: any[] = [];
  utilitiesList: any = new Set();
  resourceSubTypes: any[] = [];

  @Output() modified = new EventEmitter<any>();

  @ViewChild('md_states') md_statesDD!: DropdownComponent;
  @ViewChild('md_cities') md_citiesDD!: DropdownComponent;
  @ViewChild('md_dept') md_deptsDD!: DropdownComponent;
  @ViewChild('md_roles') md_rolesDD!: DropdownComponent;
  @ViewChild('rs_source') md_sourceDD!: DropdownComponent;
  @ViewChild('geoLocation') geoLocations!: GeoLocationsComponent;
  @Output() assetDefaultImageChanged = new EventEmitter<any>();

  assetImages: any[] = [];
  files: any[] = [];
  identifications: any[] = [];

  progressInfos: any;
  documents: any[] = [];
  docImages: any[] = [];

  selectedFiles: FileList[] = [];
  linkGroupID: any;
  imageUrl: any = 'assets/images/empty-profile.png';
  image: any;
  IssuanceType: number = 0;
  isMyProfile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private datePipe: LocalizedDatePipe
  ) {
    super();
    this.docImagesInfo = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required]
    });

    this.buttons = buttons.core.tabMaster.create;
    let navState = this.navService.getNavigationState();
    if (this.router.url.includes('add')) {
      navState.currentMasterId = 0;
      navState.currentMaster = undefined;
      this.navService.setNavigationState(navState);
    }
    if (this.router.url.includes(MasterComponentTypes.PROJECTS)) {
      this.currentView = MasterComponentTypes.PROJECTS;
      this.getData('Project/GetProjectDetails');
    } else if (this.router.url.includes(MasterComponentTypes.ZONES)) {
      this.currentView = MasterComponentTypes.ZONES;
      this.linkGroupID = AttachmentLinkGroup.ZONE;
      this.getData('Locations/GetZoneDetails');
    } else if (this.router.url.includes(MasterComponentTypes.BUILDINGS)) {
      this.currentView = MasterComponentTypes.BUILDINGS;
      this.linkGroupID = AttachmentLinkGroup.BUILDINGS;
      this.getData('Locations/GetBuildingDetails');
    } else if (
      this.router.url.includes(
        MasterComponentTypes.MASTER_DEVELOPMENT.slice(0, -1).replace(' ', '')
      )
    ) {
      this.currentView = MasterComponentTypes.MASTER_DEVELOPMENT;
      this.linkGroupID = AttachmentLinkGroup.MASTERDEVELOPMENT;
      this.getData('Locations/GetMasterDevelopmentDetails');
    } else if (this.router.url.includes(MasterComponentTypes.UNITS)) {
      this.currentView = MasterComponentTypes.UNITS;
      this.linkGroupID = AttachmentLinkGroup.UNIT;
      this.getData('Locations/GetUnitDetails');
    } else if (this.router.url.includes(MasterComponentTypes.CLIENTS)) {
      this.currentView = MasterComponentTypes.CLIENTS;
      this.linkGroupID = AttachmentLinkGroup.CLIENTS;
      this.getData('Client/GetClientInfo');
    } else if (
      this.router.url.includes(MasterComponentTypes.MAN_POWER.replace(' ', ''))
    ) {
      this.currentView = MasterComponentTypes.MAN_POWER;
      this.linkGroupID = AttachmentLinkGroup.RESOURCE;
      this.pageTitle = 'Add New Man Power';
      this.isMyProfile = sessionStorage.getItem('isMyProfile') === 'true';
      if (this.isMyProfile)
        this.getData('Resources/GetResourceProfile', this.isMyProfile);
      else this.getData('Resources/GetResource');
    } else if (this.router.url.includes(MasterComponentTypes.VENDORS)) {
      this.currentView = MasterComponentTypes.VENDORS;
      this.linkGroupID = AttachmentLinkGroup.VENDORS;
      this.getData('Vendor/GetVendorInfo');
    }
    this.pageTitle =
      this.pageTitle === ''
        ? 'Add New ' + this.currentView.slice(0, -1)
        : this.pageTitle;
    this.config.defaultCountryCode =
      navState?.currentAccount?.mainMobileCode ??
      this.config.defaultCountryCode;
  }

  onMasterDevelopmentChange(selectedMD: any): void {
    let master: any = {};
    if (this.currentView === MasterComponentTypes.ZONES) {
      master = this.masterData?.masterDevelopments?.find(
        (md: any) => md.id === parseInt(selectedMD.value)
      );
    } else if (this.currentView === MasterComponentTypes.PROJECTS) {
      this.linkGroupID = AttachmentLinkGroup.PROJECTS;
      master = this.masterData?.clients?.find(
        (c: any) => c.id === parseInt(selectedMD.value)
      );
      this.selectedClient = master;
      this.selectedClient['countryName'] = this.masterData?.countries?.find(
        (country: any) => country.id === master?.countryId
      )?.name;
      this.selectedClient['stateName'] = this.masterData?.states?.find(
        (state: any) => state.id === master?.stateId
      )?.name;
      this.selectedClient['cityName'] = this.masterData?.cities?.find(
        (city: any) => city.id === master?.cityId
      )?.name;
    } else if (this.currentView === MasterComponentTypes.MAN_POWER) {
      this.resourceSubTypes = this.masterData?.resourceSubTypes?.filter(
        (res: any) => res.resourceTypeId === selectedMD.value
      );
      this.selectedResourceTypeId = selectedMD.value;
      this.personalInfo?.controls['resourceSubType'].setValue(
        this.resourceSubTypes[0]?.id
      );
      this.resourceSubTypeChanged(this.resourceSubTypes[0]?.name);
    } else {
      master = this.masterData?.buildings?.find(
        (bd: any) => bd.id === parseInt(selectedMD.value)
      );
      this.selectedBuilding = master;
    }
    this.selectedCountry = this.masterData?.countries?.find(
      (country: any) => country.id === master?.countryId
    );
    this.selectedState = this.masterData?.states?.find(
      (state: any) => state.id === master?.stateId
    );
    this.selectedCity = this.masterData?.cities?.find(
      (city: any) => city.id === master?.cityId
    );
    this.developedBy = this.masterData?.developers?.find(
      (dev: any) => dev.id === master?.developerId
    );

    if (this.currentView === MasterComponentTypes.ZONES) {
      let general = this.generalInfo?.value;
      if (general) {
        general.country = this.selectedCountry?.name;
        general.state = this.selectedState?.name;
        general.city = this.selectedCity?.name;
        this.generalInfo.patchValue(general);
      }
    }
  }

  countrySelected(selectedCountry: any, stateId?: any) {
    this.states = this.masterData?.states?.filter(
      (state: any) => state.countryId === parseInt(selectedCountry.value)
    );
    this.md_statesDD?.setToDefault(stateId ?? '');
    this.stateSelected({ value: stateId?.toString() });
  }

  stateSelected(selectedState: any) {
    this.cities = this.masterData?.cities?.filter(
      (city: any) => city.stateId === parseInt(selectedState.value)
    );
    this.md_citiesDD?.setToDefault();
  }

  divisionSelected(selectedDivision: any) {
    this.departments = this.masterData?.departments?.filter(
      (dept: any) => dept.divisionId === parseInt(selectedDivision.value)
    );
    this.md_deptsDD?.setToDefault();
  }

  rolesSelected(selectedRole: any) {
    this.roleAccesses = this.masterData?.roleAccesses?.filter(
      (role: any) => role.roleId === parseInt(selectedRole.value)
    );
    this.md_rolesDD?.setToDefault();
  }

  facilitiesSelected(facility: any): void {
    this.selectedFacilities.push(facility);
  }

  skillSetSelected(skillSet: any): void {
    this.selectedSkillSet.add(skillSet);
  }

  languagesSelected(language: any): void {
    this.selectedLanguages.add(language);
  }

  resourceSubTypeChanged(resourceSubType: string): void {
    if (resourceSubType.toLowerCase() === 'vendor') {
      this.generalInfo?.get('source')?.addValidators(Validators.required);
      this.masterData['sources'] = this.masterData?.vendors;
    } else if (resourceSubType.toLowerCase() === 'client') {
      this.generalInfo?.get('source')?.addValidators(Validators.required);
      this.masterData['sources'] = this.masterData?.clients;
    } else {
      this.generalInfo?.get('source')?.clearValidators();
      this.masterData['sources'] = null;
    }
    this.md_sourceDD?.setToDefault();
  }

  convertToMeters(event: any, areaType: number): void {
    let value = event.value;
    let sqfts = parseFloat(value);
    switch (areaType) {
      case 1:
        this.buildAreaInSqMtrs = sqfts * 0.0929;
        break;
      case 2:
        this.plotAreaInSqMtrs = sqfts * 0.0929;
        break;
      case 3:
        this.commonAreaInSqMtrs = sqfts * 0.0929;
    }
  }

  buttonClicked(buttonType: any) {
    if (buttonType === 'Save') {
      this.save();
    } else {
      this.navigateBack();
    }
  }

  navigateBack(): void {
    if (this.currentView === MasterComponentTypes.PROJECTS) {
      this.router.navigate(['core/administration/projects']);
    } else if (this.currentView === MasterComponentTypes.CLIENTS) {
      this.router.navigate(['core/administration/clients']);
    } else if (this.currentView === MasterComponentTypes.VENDORS) {
      this.router.navigate(['core/administration/vendors']);
    } else {
      let navState = this.navService.getNavigationState();
      navState.currentMaster = this.currentView;
      this.navService.setNavigationState(navState);
      if (this.currentView === MasterComponentTypes.MAN_POWER) {
        if (this.isMyProfile) {
          this.router.navigate(['GetDashBoard']);
        } else {
          this.router.navigate(['core/administration/resources']);
        }
      } else {
        this.router.navigate(['core/administration/locations']);
      }
    }
  }

  override save(): void {
    let formData: any = {};
    if (this.currentView === MasterComponentTypes.PROJECTS) {
      formData = {
        ...this.generalInfo.value,
        ...this.finance.value,
        ...this.services.value,
        ...this.locations.value,
        ...this.otherDetails.value,
        ...this.builtupArea.value,
        ...this.plotArea.value,
        ...this.otherReferences.value,
        ...this.geoLocations?.getFormData()
      };
      let clientData = this.clientDetails.value;
      let project = {
        id: this.currentLocation?.id ?? 0,
        accountId: parseInt(formData.accountProfile),
        code: formData.communityCode,
        title: formData.communityTitle,
        refNo: formData.mainRefNo,
        statusId: parseInt(formData.status),
        statusName: '',
        projectTypeId: parseInt(formData.projectType),
        projectTypeName: '',
        projectAlias: formData.projectAlias,
        countryId: parseInt(formData.country),
        countryName: '',
        stateId: parseInt(formData.state),
        stateName: '',
        cityId: parseInt(formData.city),
        cityName: '',
        masterDevelopmentId: parseInt(formData.masterDevelopment),
        masterDevelopmentName: '',
        zoneId: parseInt(formData.zone),
        zoneName: '',
        streetNo: formData.streetNo,
        streetName: formData.streetName,
        zipCode: formData.zipCode,
        projectValue: formData.projectValue,
        latitude: this.getNonEmptyOrUndefinedValue(formData.latitude) ?? '',
        longitude: this.getNonEmptyOrUndefinedValue(formData.longitude) ?? '',
        builtUpAreaSqFt: parseFloat(formData.builtupAreaSft),
        plotAreaSqFt: parseFloat(formData.plotAreaSft),
        comments: formData.comment,
        refCode1: formData.reference1,
        refCode2: formData.reference2,
        profitCentre: formData.profitCenter,
        glAccount: formData.glCode,
        clientId: parseInt(clientData.client),
        clientName: '',
        vendorId: parseInt(formData.developedBy),
        vendorName: '',
        serviceId: 0,
        serviceName: formData.serviceType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reviewDate: formData.reviewDate,
        isOverrideWO: formData.isOveridden,
        isLatest: true,
        issuanceTypeId: formData.frequencyType,
        autoIssuanceValue: formData.frequency
      };
      this.updateData('Project/AddOrUpdateProject', project);
    } else if (this.currentView === MasterComponentTypes.ZONES) {
      formData = {
        ...this.generalInfo.value,
        ...this.otherDetails.value,
        ...this.builtupArea.value,
        ...this.plotArea.value,
        ...this.geoLocations?.getFormData()
      };
      let zone = {
        id: formData.refNo ?? 0,
        name: formData.zone,
        code: formData.code,
        description: formData.description,
        masterDevelopmentId: parseInt(formData.masterDevelopment),
        masterDevelopmentName: '',
        developerId: parseInt(formData.developedBy),
        developerName: '',
        communityTypeId: parseInt(formData.category),
        communityTypeName: '',
        stateId: this.selectedState?.id,
        stateName: '',
        cityId: this.selectedCity?.id,
        cityName: '',
        direction: formData.direction,
        dimension: formData.dimension,
        builtUpAreaSqFt: parseFloat(formData.builtupAreaSft),
        plotAreaSqFt: parseFloat(formData.plotAreaSft),
        qrCodeUrl: '',
        latitude: this.getNonEmptyOrUndefinedValue(formData.latitude) ?? '',
        longitude: this.getNonEmptyOrUndefinedValue(formData.longitude) ?? ''
      };
      this.updateData('Locations/AddOrUpdateZone', zone);
    } else if (this.currentView === MasterComponentTypes.MASTER_DEVELOPMENT) {
      formData = {
        ...this.generalInfo.value,
        ...this.builtupArea.value,
        ...this.plotArea.value,
        ...this.geoLocations?.getFormData()
      };
      let masterDevelopment = {
        id: formData.refNo ?? 0,
        name: formData.name,
        code: formData.code,
        communityTypeId: parseInt(formData.category),
        communityTypeName: '',
        developerId: parseInt(formData.developedBy),
        developerName: '',
        builtUpAreaSqFt: parseFloat(formData.builtupAreaSft),
        builtUpAreaSqMeter: 0, //formData.builtupAreaSmt,
        plotAreaSqFt: parseFloat(formData.plotAreaSft),
        plotAreaSqMeter: 0, //formData.plotAreaSmt,
        latitude: this.getNonEmptyOrUndefinedValue(formData.latitude) ?? '',
        longitude: this.getNonEmptyOrUndefinedValue(formData.longitude) ?? '',
        countryId: parseInt(formData.country),
        countryName: '',
        stateId: parseInt(formData.state),
        stateName: '',
        cityId: parseInt(formData.city),
        cityName: '',
        description: formData.description,
        qrCodeUrl: '',
        documents: [],
        images: []
      };
      this.updateData(
        'Locations/AddOrUpdateMasterDevelopment',
        masterDevelopment
      );
    } else if (this.currentView === MasterComponentTypes.BUILDINGS) {
      formData = {
        ...this.locations.value,
        ...this.builtupArea.value,
        ...this.plotArea.value,
        ...this.generalInfo.value,
        ...this.dimensions.value,
        ...this.additionalInfo.value,
        ...this.otherReferences.value,
        ...this.utilitiesInfo.value,
        ...this.geoLocations?.getFormData()
      };

      let building = {
        id: this.currentLocation?.id ?? 0,
        name: formData.bulidingName,
        code: formData.code,
        description: formData.description,
        buildingStatus: formData.status,
        communityTypeId: parseInt(formData.category),
        communityTypeName: '',
        developerId: parseInt(formData.developedBy),
        developerName: '',
        countryId: parseInt(formData.country),
        countryName: '',
        stateId: parseInt(formData.state),
        stateName: '',
        cityId: parseInt(formData.city),
        cityName: '',
        masterDevelopmentId: parseInt(formData.masterDevelopment),
        masterDevelopmentName: '',
        zoneId: parseInt(formData.zone),
        zoneName: '',
        streetNo: formData.streetNo,
        streetName: formData.streetName,
        pinCode: formData.zipCode,
        builtUpAreaSqFt: parseFloat(formData.builtupAreaSft),
        plotAreaSqFt: parseFloat(formData.plotAreaSft),
        commonAreaSqft: parseFloat(formData.commonAreaSft),
        propertyNo: formData.propertyNo,
        makaniNo: parseFloat(formData.makaniNo),
        noOfUnits: parseInt(formData.noofUnits),
        parkingLots: parseInt(formData.noofParkingLots),
        ratePerSqft: parseFloat(formData.rateperSqFt),
        buildingAge: parseInt(formData.buildingAge),
        handOverDate: CommonHelper.convertDateToUTC(formData.handoverDate),
        dlpPeriod: formData.dLPPeriod,
        constructionValue: parseFloat(formData.constructionValue),
        referenceNo1: formData.reference1,
        referenceNo2: formData.reference2,
        latitude: this.getNonEmptyOrUndefinedValue(formData.latitude) ?? '',
        longitude: this.getNonEmptyOrUndefinedValue(formData.longitude) ?? '',
        qrCodeUrl: '',
        documents: [],
        images: [],
        electricity: formData.electricity,
        telecom: formData.telecom
      };
      this.updateData('Locations/AddOrUpdateBuilding', building);
    } else if (this.currentView === MasterComponentTypes.UNITS) {
      formData = {
        ...this.locations.value,
        ...this.builtupArea.value,
        ...this.plotArea.value,
        ...this.generalInfo.value,
        ...this.otherDetails.value,
        ...this.govtRefNo.value,
        ...this.otherReferences.value,
        ...this.geoLocations?.getFormData()
      };

      let unit = {
        id: this.currentLocation?.id ?? 0,
        name: formData.bulidingName,
        code: formData.code,
        description: formData.description,
        propertyTypeName: formData.propertyTypeName,
        unitSpaceTypeId: formData.unitSpaceType,
        unitSpaceTypeName: '',
        propertyNumber: formData.propertyNumber,
        unitTypeId: parseInt(formData.unitType),
        unitTypeName: '',
        rentalStatusId: parseInt(formData.rentalStatus),
        rentalStatusName: '',
        unitStatusId: parseInt(formData.unitStatus),
        unitStatusName: '',
        floorId: parseInt(formData.floor),
        floorName: '',
        buildingId: parseInt(formData.buildingCode),
        buildingName: '',
        countryId: this.selectedCountry?.id,
        countryName: '',
        stateId: this.selectedState?.id,
        stateName: '',
        cityId: this.selectedCity?.id,
        cityName: '',
        landMark: formData.landMark,
        builtUpAreaSqFt: parseFloat(formData.builtupAreaSft),
        plotAreaSqFt: parseFloat(formData.plotAreaSft),
        unitBedRoomId: parseInt(formData.bedrooms),
        unitBedRoomName: '',
        unitBathRoomId: parseInt(formData.bathrooms),
        unitBathRoomName: '',
        noOfRooms: parseInt(formData.noOfRooms),
        noOfParkings: parseInt(formData.noOfParkings),
        unitValue: 0,
        notes: formData.notes,
        isFurnished: formData.isFurnished,
        arePetsAllowed: formData.isPetsAllowed,
        isSwimmingPool: formData.isPoolAvailable,
        hasBalcony: formData.hasBalcony,
        unitView: formData.unitView,
        refCode1: formData.reference1,
        refCode2: formData.reference2,
        govtReferenceNo: formData.tawtheeqNo,
        latitude: this.getNonEmptyOrUndefinedValue(formData.latitude) ?? '',
        longitude: this.getNonEmptyOrUndefinedValue(formData.longitude) ?? '',
        qrCodeUrl: ''
      };
      this.updateData('Locations/AddOrUpdateUnit', unit);
    } else if (this.currentView === MasterComponentTypes.MAN_POWER) {
      formData = {
        ...this.personalInfo.value,
        ...this.generalInfo.value,
        ...this.locations.value,
        ...this.otherDetails.value
      };

      let manPower = {
        id: this.currentLocation?.id ?? 0,
        firstName: formData.firstName,
        middleName: '',
        lastName: formData.lastName,
        mobileCode: this.mobileCode?.dialCode,
        mobileNo: formData.mobileNo,
        email: formData.email,
        isAssignWork: formData.isAssignWork,
        isMobileLoginAllowed: formData.isMobileLogin,
        isWebLoginAllowed: formData.isWebLogin,
        status: this.currentLocation?.id ? formData.status : 'Inactive',
        code: formData.code,
        resourceUserId: formData.userId,
        isBlueColler: formData.isBlueColler,
        supervisorId: formData.supervisor?.id ?? formData.supervisor ?? '',
        accountProfileId: parseInt(formData.accountProfile),
        designationId: parseInt(formData.designation),
        designationName: '',
        departmentId: parseInt(formData.department),
        departmentName: '',
        divisionId: parseInt(formData.division),
        divisionName: '',
        skillSetIds: Array.from(this.selectedSkillSet).join(),
        languageIds: Array.from(this.selectedLanguages).join(),
        roleId: parseInt(formData.role),
        roleName: '',
        roleAccessId: parseInt(formData.roleAccess),
        resourceTypeId: parseInt(formData.resourceType),
        resourceTypeName: '',
        resourceSubTypeId: parseInt(formData.resourceSubType),
        resourceSubTypeName: '',
        password: this.currentPassword === formData?.password ? '' : formData?.password,
        countryId: parseInt(formData.country),
        stateId: parseInt(formData.state),
        cityId: parseInt(formData.city),
        streetNo: formData.streetNo,
        streetName: formData.streetName,
        landMark: formData.landMark,
        postalCode: formData.zipCode,
        imageUrl: '',
        image: this.image ?? '',
        clientOrVendorSourceId: formData.source,
        hasAdditionalEmails: formData.hasAdditionalEmails,
        additionalEmails: formData.additionalEmails,
        resourceWorkTypeId: formData.workType
      };

      this.updateData(
        'Resources/AddOrUpdateResource',
        manPower,
        true,
        MasterComponentTypes.MAN_POWER
      );
    } else if (this.currentView === MasterComponentTypes.CLIENTS) {
      formData = {
        ...this.generalInfo.value,
        ...this.locations.value
      };
      let client = {
        id: this.currentLocation?.id ?? 0,
        name: formData.clientName,
        code: formData.code,
        taxNo: formData.vatRegNumber,
        countryId: parseInt(formData.country),
        countryName: '',
        stateId: parseInt(formData.state),
        stateName: '',
        cityId: parseInt(formData.city),
        cityName: '',
        streetNo: formData.streetNo,
        streetName: formData.streetName,
        landmark: formData.landMark,
        zipCode: formData.zipCode,
        emailAddress: formData.mainEmail,
        mobileCode: this.mobileCode?.dialCode,
        mobileNo: formData.mobileNo,
        faxCode: this.faxNoCode?.dialCode,
        faxNo: formData.faxNo,
        telePhoneNo: formData.telePhoneNo,
        statusId: 1,
        statusName: formData.status === 'NEW' ? 'Active' : formData.status
      };

      this.updateData('Client/AddOrUpdateClient', client);
    } else if (this.currentView === MasterComponentTypes.VENDORS) {
      formData = {
        ...this.generalInfo.value,
        ...this.locations.value,
        ...this.otherDetails.value,
        ...this.contactInfo.value,
        ...this.geoLocations?.getFormData()
      };
      let contact = this.personalInfo.value;
      let vendor = {
        id: this.currentLocation?.id ?? 0,
        uniqueId: '',
        accountId: '',
        imageUrl: '',
        serviceTypeIds: Array.from(this.selectedSkillSet).join(),
        vendorTypeId: formData.vendorType,
        vendorTypeName: '',
        code: formData.code,
        statusId: formData.status,
        statusName: '',
        taxNo: formData.trn,
        name: formData.name,
        isPrimayVendor: formData.isPrimary,
        contactPerson: contact.name,
        contactPersonEmail: contact.emailAddress,
        alternateMobileCode: this.alternateMobileCode?.dialCode,
        contactPersonMobileNumber: contact.mobileNo,
        countryId: parseInt(formData.country),
        countryName: '',
        stateId: parseInt(formData.state),
        stateName: '',
        cityId: parseInt(formData.city),
        cityName: '',
        streetNo: formData.streetNo,
        streetName: formData.streetName,
        landmark: formData.landMark,
        zipCode: formData.zipCode,
        mainEmail: formData.emailAddress,
        mobileCode: this.mobileCode?.dialCode,
        mobileNumber: formData.mobileNo,
        landLineCode: this.landLineCode?.dialCode,
        landLineNumber: formData.landlineNo,
        faxNoCode: this.faxNoCode?.dialCode,
        faxNumber: formData.faxNo,
        tollFreeNumber: formData.tollFreeNo,
        latitude: this.getNonEmptyOrUndefinedValue(formData.latitude) ?? '',
        longitude: this.getNonEmptyOrUndefinedValue(formData.longitude) ?? '',
        isActive: true,
        image: this.image ?? ''
      };
      this.updateData(
        'Vendor/AddOrUpdateVendor',
        vendor,
        true,
        MasterComponentTypes.VENDORS
      );
    }
  }

  getData(path: string, isMyProfile: any = null) {
    let navState = this.navService.getNavigationState();
    this.apiService
      .GetLocationDetailsById(path, navState.currentMasterId ?? 0, isMyProfile)
      .subscribe({
        next: (result: any) => {
          this.masterData = result;
          this.filteredData = { ...this.masterData };
          if (this.masterData?.countries) {
            this.mobileCode = this.masterData?.countries?.find(
              (country: any) =>
                country.dialCode === this.config?.defaultCountryCode
            );
          }
          let dataKey =
            this.currentView === 'Manpower'
              ? 'Resources'
              : this.currentView.replace(' ', '');
          let data =
            this.masterData[dataKey.charAt(0).toLowerCase() + dataKey.slice(1)];
          this.buildForm(
            navState.currentMasterId ?? 0,
            data && data?.length > 0 ? data[0] : null
          );
          this.isDataLoaded = true;
          sessionStorage.removeItem('isMyProfile');
        },
        error: (e: any) => {
          this.alertService.error('Error retreving additional information !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  buildForm(currentMasterId: number, formData?: any): void {
    this.currentLocation = formData;
    if (this.currentView === MasterComponentTypes.PROJECTS) {
      if (formData?.clientId) {
        this.onMasterDevelopmentChange({
          value: formData?.clientId?.toString()
        });
      }
      this.generalInfo = this.fb.group({
        accountProfile: [formData?.accountId, Validators.required],
        projectType: [formData?.projectTypeId],
        refNo: [currentMasterId],
        status: [formData?.statusId, Validators.required],
        communityCode: [formData?.code, Validators.required],
        communityTitle: [formData?.title, Validators.required],
        mainRefNo: [formData?.refNo, Validators.required],
        projectAlias: [formData?.projectAlias]
      });

      this.generalInfo.valueChanges.subscribe(() => this.validateForm());

      this.finance = this.fb.group({
        projectValue: [formData?.projectValue, Validators.required]
      });

      this.finance.valueChanges.subscribe(() => this.validateForm());

      this.services = this.fb.group({
        serviceType: [
          formData?.serviceName ?? this.serviceTypes[0].name,
          Validators.required
        ],
        startDate: [formData?.startDate, Validators.required],
        endDate: [formData?.endDate, Validators.required],
        reviewDate: [formData?.reviewDate, Validators.required],
        isOveridden: [formData?.isOverrideWO, Validators.required],
        frequencyType: [formData?.issuanceTypeId, Validators.required],
        frequency: [
          formData?.autoIssuanceValue,
          [
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(0),
            Validators.maxLength(2)
          ]
        ]
      });

      if (formData?.issuanceTypeId) {
        this.changeIssuance({
          value: formData?.issuanceTypeId
        });
      }

      if (formData?.startDate) {
        formData.startDate = this.datePipe.transform(
          new Date(formData?.startDate),
          'yyyy-MM-dd'
        );
      }

      if (formData?.endDate) {
        formData.endDate = this.datePipe.transform(
          new Date(formData?.endDate),
          'yyyy-MM-dd'
        );
      }

      if (formData?.reviewDate) {
        formData.reviewDate = this.datePipe.transform(
          new Date(formData?.reviewDate),
          'yyyy-MM-dd'
        );
      }

      this.services.valueChanges.subscribe(() => this.validateForm());

      this.otherDetails = this.fb.group({
        developedBy: [formData?.vendorId, Validators.required],
        comment: [formData?.comments, Validators.required]
      });

      this.otherDetails.valueChanges.subscribe(() => this.validateForm());

      this.mobileCode = this.masterData?.countries.find(
        (country: any) =>
          country.dialCode ===
          (this.selectedClient?.mobileCode ?? this.config?.defaultCountryCode)
      );

      this.clientDetails = this.fb.group({
        client: [formData?.clientId],
        vatRegNumber: [this.selectedClient?.taxNo],
        country: [this.selectedClient?.countryName],
        state: [this.selectedClient?.stateName],
        city: [this.selectedClient?.cityName],
        streetNo: [this.selectedClient?.streetNo],
        streetName: [this.selectedClient?.streetName],
        email: [this.selectedClient?.emailAddress, [Validators.email]],
        alternativeEmail: [formData?.alternativeEmail, [Validators.email]],
        mobileNo: [this.selectedClient?.mobileNo]
      });
      this.clientDetails.valueChanges.subscribe(() => this.validateForm());
    }

    if (this.currentView === MasterComponentTypes.ZONES) {
      if (formData?.masterDevelopmentId) {
        this.onMasterDevelopmentChange({
          value: formData?.masterDevelopmentId?.toString()
        });
      }
      this.generalInfo = this.fb.group({
        refNo: [currentMasterId, Validators.required],
        zone: [formData?.name, Validators.required],
        code: [formData?.code, Validators.required],
        category: [formData?.communityTypeId, Validators.required],
        masterDevelopment: [formData?.masterDevelopmentId, Validators.required],
        country: [this.selectedCountry?.name, Validators.required],
        state: [this.selectedState?.name],
        city: [this.selectedCity?.name],
        developedBy: [formData?.developerId],
        description: [formData?.description]
      });
      this.generalInfo.valueChanges.subscribe(() => this.validateForm());

      this.otherDetails = this.fb.group({
        direction: [formData?.direction],
        dimension: [formData?.dimension]
      });
      this.otherDetails.valueChanges.subscribe(() => this.validateForm());
    }

    if (
      this.currentView === MasterComponentTypes.PROJECTS ||
      this.currentView === MasterComponentTypes.BUILDINGS
    ) {
      this.locations = this.fb.group({
        country: [formData?.countryId, Validators.required],
        state: [formData?.stateId, Validators.required],
        city: [formData?.cityId],
        masterDevelopment: [formData?.masterDevelopmentId],
        zone: [formData?.zoneId],
        streetName: [formData?.streetName],
        streetNo: [formData?.streetNo],
        zipCode: [formData?.pinCode ?? formData?.zipCode, Validators.required]
      });
      this.locations.valueChanges.subscribe(() => this.validateForm());
      if (formData?.countryId) {
        this.countrySelected({ value: formData.countryId }, formData.stateId);
      }
    }

    if (this.currentView === MasterComponentTypes.MASTER_DEVELOPMENT) {
      this.generalInfo = this.fb.group({
        refNo: [currentMasterId, Validators.required],
        name: [formData?.name, Validators.required],
        code: [formData?.code, Validators.required],
        category: [formData?.communityTypeId, Validators.required],
        developedBy: [formData?.developerId, Validators.required],
        country: [formData?.countryId, Validators.required],
        state: [formData?.stateId, Validators.required],
        city: [formData?.cityId],
        description: [formData?.description]
      });
      this.generalInfo.valueChanges.subscribe(() => this.validateForm());
      if (formData?.countryId) {
        this.countrySelected({ value: formData.countryId }, formData.stateId);
      }
    }

    if (this.currentView === MasterComponentTypes.UNITS) {
      if (formData?.buildingId) {
        this.onMasterDevelopmentChange({
          value: formData?.buildingId?.toString()
        });
      }
      this.generalInfo = this.fb.group({
        code: [formData?.code, Validators.required],
        propertyNumber: [formData?.propertyNumber],
        propertyTypeName: [formData?.propertyTypeName ?? 'apartment'],
        unitType: [formData?.unitTypeId, Validators.required],
        rentalStatus: [formData?.rentalStatusId, Validators.required],
        unitStatus: [formData?.unitStatusId, Validators.required],
        floor: [formData?.floorId, Validators.required],
        buildingCode: [formData?.buildingId, Validators.required],
        bulidingName: [this.selectedBuilding?.name],
        unitSpaceType: [
          formData?.unitSpaceTypeId ?? this.masterData?.unitSpaceTypes[0]?.id
        ]
      });
      this.generalInfo.valueChanges.subscribe(() => this.validateForm());

      this.locations = this.fb.group({
        country: [this.selectedCountry?.name],
        state: [this.selectedState?.name],
        city: [this.selectedCity?.name],
        streetName: [this.selectedBuilding?.streetName],
        streetNo: [this.selectedBuilding?.streetNo],
        landMark: [formData?.landMark],
        pinCode: [this.selectedBuilding?.pinCode],
        buildingStatus: [this.selectedBuilding?.buildingStatus],
        description: [formData?.description]
      });
      this.locations.valueChanges.subscribe(() => this.validateForm());

      this.otherDetails = this.fb.group({
        bedrooms: [formData?.unitBedRoomId, Validators.required],
        bathrooms: [formData?.unitBathRoomId, Validators.required],
        noOfRooms: [formData?.noOfRooms],
        noOfParkingLots: [formData?.noOfParkings],
        unitView: [formData?.unitView],
        developedBy: [this.developedBy?.name],
        notes: [formData?.notes],
        isFurnished: [formData?.isFurnished],
        isPetsAllowed: [formData?.arePetsAllowed],
        isPoolAvailable: [formData?.isSwimmingPool],
        hasBalcony: [formData?.hasBalcony]
      });
      this.otherDetails.valueChanges.subscribe(() => this.validateForm());

      this.govtRefNo = this.fb.group({
        tawtheeqNo: [formData?.govtReferenceNo]
      });
      this.govtRefNo.valueChanges.subscribe(() => this.validateForm());
    }

    if (
      this.currentView === MasterComponentTypes.PROJECTS ||
      this.currentView === MasterComponentTypes.ZONES ||
      this.currentView === MasterComponentTypes.MASTER_DEVELOPMENT ||
      this.currentView === MasterComponentTypes.BUILDINGS ||
      this.currentView === MasterComponentTypes.UNITS
    ) {
      this.builtupArea = this.fb.group({
        builtupAreaSft: [formData?.builtUpAreaSqFt],
        builtupAreaSmt: ['']
      });
      this.builtupArea.valueChanges.subscribe(() => this.validateForm());

      this.plotArea = this.fb.group({
        plotAreaSft: [formData?.plotAreaSqFt],
        plotAreaSmt: ['']
      });
      this.plotArea.valueChanges.subscribe(() => this.validateForm());
      if (formData?.builtUpAreaSqFt) {
        this.convertToMeters({ value: formData.builtUpAreaSqFt.toString() }, 1);
      }
      if (formData?.plotAreaSqFt) {
        this.convertToMeters({ value: formData.plotAreaSqFt.toString() }, 2);
      }
    }

    if (this.currentView === MasterComponentTypes.BUILDINGS) {
      this.generalInfo = this.fb.group({
        code: [formData?.code, Validators.required],
        category: [formData?.communityTypeId],
        bulidingName: [formData?.name, Validators.required],
        status: [formData?.buildingStatus, Validators.required],
        description: [formData?.description]
      });
      this.generalInfo.valueChanges.subscribe(() => this.validateForm());

      this.dimensions = this.fb.group({
        commonAreaSft: [formData?.commonAreaSqft, Validators.required],
        commonAreaSmt: [''],
        unitAreaSft: [''],
        unitAreaSmt: ['']
      });
      this.dimensions.valueChanges.subscribe(() => this.validateForm());

      if (formData?.handOverDate) {
        formData.handOverDate = new Date(formData?.handOverDate);
      }

      if (formData?.commonAreaSqft) {
        this.convertToMeters({ value: formData.commonAreaSqft.toString() }, 3);
      }

      this.additionalInfo = this.fb.group({
        propertyNo: [formData?.propertyNo],
        makaniNo: [formData?.makaniNo],
        noofUnits: [formData?.noOfUnits],
        noofParkingLots: [formData?.parkingLots],
        rateperSqFt: [formData?.ratePerSqft],
        buildingAge: [formData?.buildingAge],
        handoverDate: [formData?.handoverDate],
        dLPPeriod: [formData?.dlpPeriod],
        constructionValue: [formData?.constructionValue],
        developedBy: [formData?.developerId, Validators.required]
      });
      this.additionalInfo.valueChanges.subscribe(() => this.validateForm());
    }

    if (
      this.currentView === MasterComponentTypes.BUILDINGS ||
      this.currentView === MasterComponentTypes.UNITS ||
      this.currentView === MasterComponentTypes.PROJECTS
    ) {
      this.otherReferences = this.fb.group({
        reference1: [formData?.refCode1],
        reference2: [formData?.refCode2],
        profitCenter: [formData?.profitCentre],
        glCode: [formData?.glAccount]
      });
      this.otherReferences.valueChanges.subscribe(() => this.validateForm());

      if (this.currentView !== MasterComponentTypes.PROJECTS) {
        this.utilitiesInfo = this.fb.group({
          electricity: ['', Validators.required],
          telecom: ['', Validators.required],
          tse: ['', Validators.required],
          gas: ['', Validators.required]
        });
        this.utilitiesInfo.valueChanges.subscribe(() => this.validateForm());
      }
    }

    if (this.currentView === MasterComponentTypes.CLIENTS) {
      this.generalInfo = this.fb.group({
        refNo: [currentMasterId],
        code: [formData?.code, Validators.required],
        status: [formData?.statusId ?? 'NEW'],
        clientName: [formData?.name, Validators.required],
        vatRegNumber: [formData?.taxNo]
      });

      this.generalInfo.valueChanges.subscribe(() => this.validateForm());

      this.locations = this.fb.group({
        country: [formData?.countryId, Validators.required],
        state: [formData?.stateId, Validators.required],
        city: [formData?.cityId],
        streetNo: [formData?.streetNo],
        streetName: [formData?.streetName],
        landMark: [formData?.landmark],
        zipCode: [formData?.zipCode],
        mainEmail: [formData?.emailAddress, [Validators.email]],
        mobileNo: [
          formData?.mobileNo,
          [
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(6),
            Validators.maxLength(15)
          ]
        ],
        faxNo: [formData?.faxNo],
        telePhoneNo: [formData?.telePhoneNo]
      });
      this.locations.valueChanges.subscribe(() => this.validateForm());
      if (formData?.countryId) {
        this.countrySelected({ value: formData.countryId }, formData.stateId);
      }
      this.mobileCode = this.masterData?.countries.find(
        (country: any) =>
          country.dialCode ===
          (formData?.mobileCode ?? this.config?.defaultCountryCode)
      );
      this.faxNoCode = this.masterData?.countries.find(
        (country: any) =>
          country.dialCode ===
          (formData?.faxNoCode ?? this.config?.defaultCountryCode)
      );
    }

    if (this.currentView === MasterComponentTypes.MAN_POWER) {
      if (formData?.divisionId) {
        this.divisionSelected({
          value: formData?.divisionId?.toString()
        });
      }

      this.onMasterDevelopmentChange({
        value: formData?.resourceTypeId ?? 1
      });

      this.mobileCode = this.masterData?.countries.find(
        (country: any) =>
          country.dialCode ===
          (formData?.mobileCode ?? this.config?.defaultCountryCode)
      );
      if (formData?.imageUrl != null) {
        this.imageUrl = formData?.imageUrl;
      }
      this.personalInfo = this.fb.group({
        code: [formData?.code, Validators.required],
        userId: [formData?.resourceUserId, Validators.required],
        firstName: [formData?.firstName, Validators.required],
        lastName: [formData?.lastName, Validators.required],
        mobileNo: [formData?.mobileNo, Validators.required],
        email: [formData?.email, Validators.required],
        isBlueColler: [formData?.isBlueColler ?? false],
        supervisor: [formData?.supervisorId],
        resourceType: [
          formData?.resourceTypeId ?? this.masterData?.resourceTypes[1]?.id
        ],
        resourceSubType: [
          formData?.resourceSubTypeId ??
            this.masterData?.resourceSubTypes.find(
              (res: any) => res.resourceTypeId === 1
            )?.id
        ],
        isAssignWork: [formData?.isAssignWork ?? false],
        isMobileLogin: [formData?.isMobileLoginAllowed ?? false],
        isWebLogin: [formData?.isWebLoginAllowed ?? false],
        hasAdditionalEmails: [formData?.hasAdditionalEmails ?? false],
        additionalEmails: [formData?.additionalEmails ?? ''],
        workType: [formData?.resourceWorkTypeId ?? '']
      });
      this.personalInfo.valueChanges.subscribe(() => this.validateForm());

      this.validateEmail({
        checked: formData?.isBlueColler,
        supervisorId: formData?.supervisorId
      });
      this.validateEmails({ checked: formData?.hasAdditionalEmails });

      this.currentPassword = formData?.password;

      this.generalInfo = this.fb.group({
        accountProfile: [formData?.accountProfileId, Validators.required],
        status: [formData?.status],
        password: [formData?.password, Validators.required],
        source: [formData?.clientOrVendorSourceId ?? ''],
        division: [formData?.divisionId, Validators.required],
        department: [formData?.departmentId, Validators.required],
        designation: [formData?.designationId, Validators.required],
        cost: [500, Validators.required]
      });
      this.generalInfo.valueChanges.subscribe(() => this.validateForm());

      this.otherDetails = this.fb.group({
        skillSet: [this.masterData?.resourceSkillSets[0]?.id],
        language: [this.masterData?.resourceLanguages[0]?.id],
        role: [formData?.roleId, Validators.required],
        roleAccess: [formData?.roleAccessId, Validators.required]
      });
      this.otherDetails.valueChanges.subscribe(() => this.validateForm());

      this.locations = this.fb.group({
        country: [formData?.countryId, Validators.required],
        state: [formData?.stateId, Validators.required],
        city: [formData?.cityId, Validators.required],
        streetName: [formData?.streetName],
        streetNo: [formData?.streetNo],
        landMark: [formData?.landMark],
        zipCode: [formData?.postalCode]
      });

      this.locations.valueChanges.subscribe(() => this.validateForm());

      if (formData?.countryId) {
        this.countrySelected({ value: formData.countryId }, formData.stateId);
        this.rolesSelected({ value: formData.roleId });
        formData.skillSetIds
          ?.split(',')
          .forEach((item: any) => this.selectedSkillSet.add(parseInt(item)));
        formData.languageIds
          ?.split(',')
          .forEach((item: any) => this.selectedLanguages.add(parseInt(item)));
      }
    }

    if (this.currentView === MasterComponentTypes.VENDORS) {
      if (formData?.imageUrl != null) {
        this.imageUrl = formData?.imageUrl;
      }
      this.mobileCode = this.masterData?.countries.find(
        (country: any) =>
          country.dialCode ===
          (formData?.mobileCode ?? this.config?.defaultCountryCode)
      );
      this.alternateMobileCode = this.masterData?.countries.find(
        (country: any) =>
          country.dialCode ===
          (formData?.contactPersonMobileCode ?? this.config?.defaultCountryCode)
      );
      this.landLineCode = this.masterData?.countries.find(
        (country: any) =>
          country.dialCode ===
          (formData?.landLineCode ?? this.config?.defaultCountryCode)
      );
      this.faxNoCode = this.masterData?.countries.find(
        (country: any) =>
          country.dialCode ===
          (formData?.faxNoCode ?? this.config?.defaultCountryCode)
      );

      this.generalInfo = this.fb.group({
        refNo: [currentMasterId],
        code: [formData?.code, Validators.required],
        status: [formData?.statusId],
        name: [formData?.name, Validators.required],
        trn: [formData?.taxNo],
        vendorType: [
          formData?.vendorTypeId ?? this.masterData.vendorTypes[0].id
        ],
        isPrimary: [formData?.isPrimayVendor]
      });

      this.generalInfo.valueChanges.subscribe(() => this.validateForm());

      this.personalInfo = this.fb.group({
        name: [formData?.contactPerson],
        emailAddress: [formData?.contactPersonEmail, Validators.required],
        mobileNo: [formData?.contactPersonMobileNumber]
      });

      this.personalInfo.valueChanges.subscribe(() => this.validateForm());

      this.otherDetails = this.fb.group({
        serviceType: [
          this.masterData?.serviceTypeIds ??
            this.masterData.vendorServices[0].id
        ]
      });

      this.otherDetails.valueChanges.subscribe(() => this.validateForm());

      this.locations = this.fb.group({
        country: [formData?.countryId, Validators.required],
        state: [formData?.stateId, Validators.required],
        city: [formData?.cityId],
        streetNo: [formData?.streetNo],
        streetName: [formData?.streetName],
        landMark: [formData?.landmark],
        zipCode: [formData?.zipCode]
      });
      this.locations.valueChanges.subscribe(() => this.validateForm());
      if (formData?.countryId) {
        this.countrySelected({ value: formData.countryId }, formData.stateId);
        this.rolesSelected({ value: formData.roleId });
        formData.serviceTypeIds
          ?.split(',')
          .forEach((item: any) => this.selectedSkillSet.add(parseInt(item)));
      }

      this.contactInfo = this.fb.group({
        emailAddress: [formData?.mainEmail, [Validators.email]],
        mobileNo: [
          formData?.mobileNumber,
          [
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(6),
            Validators.maxLength(15)
          ]
        ],
        landlineNo: [
          formData?.landLineNumber,
          [
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(6),
            Validators.maxLength(15)
          ]
        ],
        faxNo: [formData?.faxNumber],
        tollFreeNo: [formData?.tollFreeNumber]
      });
      this.contactInfo.valueChanges.subscribe(() => this.validateForm());
    }
  }

  validateEmail(event: any) {
    if (event.checked) {
      this.personalInfo?.get('email')?.clearValidators();
      this.personalInfo?.get('email')?.addValidators([]);
      this.personalInfo?.get('email')?.setValue('');
      this.masterData['email'] = null;
      this.personalInfo
        ?.get('supervisor')
        ?.setValue(event.supervisorId ?? null);
      this.isEmailRequired = false;
    } else {
      this.isEmailRequired = true;
      this.personalInfo
        ?.get('email')
        ?.addValidators([Validators.required, Validators.email]);
      this.personalInfo?.get('supervisor')?.setValue('');
    }
    this.personalInfo.valueChanges.subscribe(() => this.validateForm());
  }

  validateEmails(event: any) {
    if (event.checked) {
      this.personalInfo
        ?.get('additionalEmails')
        ?.addValidators([Validators.required]);
      this.isEmailsRequired = true;
    } else {
      this.isEmailsRequired = false;
      this.personalInfo?.get('additionalEmails')?.clearValidators();
    }
    this.personalInfo.valueChanges.subscribe(() => this.validateForm());
  }

  validateForm(): void {
    let isFormValid: boolean = false;
    switch (this.currentView) {
      case MasterComponentTypes.PROJECTS:
        isFormValid =
          this.generalInfo?.valid &&
          this.finance?.valid &&
          this.services?.valid &&
          this.locations?.valid &&
          this.otherDetails?.valid &&
          this.builtupArea?.valid &&
          this.clientDetails?.valid &&
          this.otherReferences?.valid;
        break;
      case MasterComponentTypes.ZONES:
        isFormValid =
          this.generalInfo?.valid &&
          this.otherDetails?.valid &&
          this.builtupArea?.valid &&
          this.plotArea?.valid;
        break;
      case MasterComponentTypes.MASTER_DEVELOPMENT:
        isFormValid =
          this.generalInfo?.valid &&
          this.builtupArea?.valid &&
          this.plotArea?.valid;
        break;
      case MasterComponentTypes.BUILDINGS:
        isFormValid =
          this.generalInfo?.valid &&
          this.locations?.valid &&
          this.builtupArea?.valid &&
          this.plotArea?.valid &&
          this.dimensions?.valid &&
          this.additionalInfo?.valid &&
          this.otherReferences?.valid;
        break;
      case MasterComponentTypes.UNITS:
        isFormValid =
          this.generalInfo?.valid &&
          this.locations?.valid &&
          this.builtupArea?.valid &&
          this.plotArea?.valid &&
          this.otherDetails?.valid &&
          this.govtRefNo?.valid &&
          this.otherReferences?.valid;
        break;
      case MasterComponentTypes.CLIENTS:
        isFormValid = this.generalInfo?.valid && this.locations?.valid;
        break;
      case MasterComponentTypes.MAN_POWER:
        isFormValid =
          this.generalInfo?.valid &&
          this.locations?.valid &&
          this.personalInfo?.valid &&
          this.otherDetails?.valid;
        break;
      case MasterComponentTypes.VENDORS:
        isFormValid =
          this.generalInfo?.valid &&
          this.locations?.valid &&
          this.personalInfo?.valid &&
          this.otherDetails?.valid &&
          this.contactInfo?.valid;
        break;
    }
    let savebutton = this.buttons.find((b: any) => b.id === 'Save');
    if (savebutton) {
      savebutton.isDisabled = !isFormValid;
    }
  }

  updateData(
    path: string,
    data: any,
    hasImage: boolean = false,
    masterType?: MasterComponentTypes
  ) {
    this.apiService
      .AddOrUpdateMaster(path, data, hasImage, masterType)
      .subscribe({
        next: (result: any) => {
          if (result > 0) {
            this.alertService
              .success(this.currentView + ' Successfully Updated !!', {
                id: 'alert-taskLog'
              })
              .then(() => {
                this.navigateBack();
              });
          } else if (result === -1) {
            if (this.currentView === MasterComponentTypes.MAN_POWER) {
              this.alertService.error(
                'Resource already exists with same User ID !!',
                {
                  id: 'alert-taskLog'
                }
              );
            } else {
              this.alertService.error(`Could not save ${this.currentView} !!`, {
                id: 'alert-taskLog'
              });
            }
          } else if (result === -3) {
            if (this.currentView === MasterComponentTypes.MAN_POWER) {
              this.alertService.error(
                'Resource already exists with same Email address !!',
                {
                  id: 'alert-taskLog'
                }
              );
            } else {
              this.alertService.error(`Could not save ${this.currentView} !!`, {
                id: 'alert-taskLog'
              });
            }
          }
        },
        error: (e: any) => {
          this.alertService.error('Error retreving additional information !!', {
            id: 'alert-taskLog'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  addUtilities(data: any) {
    this.utilitiesList.add(data);
  }

  getDocuments(type: number): void {
    this.documents = [];
    this.assetImages = [];
    let navState = this.navService.getNavigationState();
    if (navState.currentMasterId > 0) {
      this.apiService
        .GetCommonDocuments(
          `Common/GetAttachments?linkId=${navState.currentMasterId}&linkGroupId=` +
            this.linkGroupID +
            `&attachmentGroup=` +
            type
        )
        .subscribe({
          next: (documents) => {
            this.documents = documents;
          },
          error: (err) => {
            this.alertService.error('Error retreving attachments !!', {
              id: 'alert-attachments'
            });
            console.error(err);
          },
          complete: () => {}
        });
    }
  }

  selectDocImages(event: any) {
    let navState = this.navService.getNavigationState();
    this.docImages = [];
    this.progressInfos = [];
    this.files = event.target.files as [];
    let formData: any = {};
    formData = {
      ...this.docImagesInfo.value
    };
    for (let i = 0; i < this.files.length; i++) {
      let data = {
        id: 0,
        title: formData.title,
        subtitle: formData.subtitle,
        linkId: navState.currentMasterId,
        linkGroupId: this.linkGroupID,
        resourceUrl: URL.createObjectURL(this.files[i]),
        attachmentGroup: AttachmentType.DOCUMENTS,
        file: this.files[i]
      };
      this.docImages.push(data);
    }
  }

  selectFiles(event: any) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  uploadFiles() {
    let navState = this.navService.getNavigationState();
    let documentModels: any = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      let data = {
        id: 0,
        linkId: navState.currentMasterId,
        file: this.selectedFiles[i],
        linkGroupId: this.linkGroupID,
        attachmentGroup: AttachmentType.DOCUMENTS
      };
      documentModels.push(data);
    }
    this.uploadDocs(0, documentModels);
  }

  uploadDocs(idx: number, documentModels: any) {
    this.apiService
      .UploadCommonDocs(`Common/SaveAttachments`, documentModels)
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            this.alertService.success('Uploaded successfully !!', {
              id: 'alert-asset'
            });
          }
        },
        error: (err) => {
          this.progressInfos[idx].value = 0;
          this.alertService.error('Error retreving images !!', {
            id: 'alert-asset'
          });

          console.error(err);
        },
        complete: () => {}
      });
  }
  getFileName(file: any) {
    return file.name;
  }

  onChange(event: any): void {
    let navState = this.navService.getNavigationState();
    this.files = event.target.files as [];
    for (let i = 0; i < this.files.length; i++) {
      let img = {
        id: 0,
        linkId: navState.currentMasterId,
        file: this.files[i],
        resourceUrl: URL.createObjectURL(this.files[i]),
        linkGroupId: this.linkGroupID,
        attachmentGroup: AttachmentType.IMAGES,
        title: '',
        subtitle: ''
      };
      this.assetImages.push(img);
      this.documents.push(img);
    }
  }

  onChangeProfile(event: any): void {
    let files = event.target.files as [];
    for (let i = 0; i < files.length; i++) {
      this.image = files[i];
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.image);
    reader.onload = () => {
      this.imageUrl = reader.result?.toString();
    };
  }

  uploadImages() {
    this.apiService
      .UploadCommonDocs('Common/SaveAttachments', this.assetImages)
      .subscribe({
        next: (uploded) => {
          this.alertService.success('Uploaded successfully !!', {
            id: 'alert-asset'
          });
        },
        error: (err) => {
          this.alertService.error('Error retreving images !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  delete(doc: any, type: number) {
    let document = {
      id: doc.id,
      linkId: doc.linkId,
      linkGroupId: this.linkGroupID,
      file: '',
      attachmentType: '',
      attachmentGroup: type,
      resourceUrl: doc.resourceUrl,
      fileName: '',
      extension: ''
    };
    this.apiService
      .DeleteCommonAttachment(`Common/DeleteAttachment`, document)
      .subscribe({
        next: (deleted) => {
          this.alertService.success('Deleted successfully !!', {
            id: 'alert-asset'
          });
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  changeIssuance(issuance: any) {
    this.IssuanceType = parseInt(issuance.value);
  }
}
