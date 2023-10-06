import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api.service';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Component } from '@angular/core';
import { MasterComponentTypes } from 'src/app/models/enums/MasterComponentTypes.enum';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import buttons from '../../../../helpers/buttons.json';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends CommonComponent {
  myProfile!: FormGroup;
  contactInfo!: FormGroup;
  propertyInfo!: FormGroup;
  documents!: FormGroup;
  authentication!: FormGroup;
  interests!: FormGroup;
  tabId: number = 1;
  dateOfBirth = new Date();
  genders: any[] = [
    {
      id: 'male',
      name: 'Male'
    },
    {
      id: 'female',
      name: 'Female'
    },
    {
      id: 'others',
      name: 'Others'
    }
  ];

  selectedCustomerType: any;
  customerSubTypes: any[] = [];
  selectedCustomerSubType: any;
  selectedUnit: any;

  states: any[] = [];
  cities: any[] = [];
  buildings: any[] = [];
  units: any[] = [];
  imageUrl: any = 'assets/images/empty-profile.png';
  image: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private router: Router,
    private navService: NavigationService
  ) {
    super();
    this.pageTitle = 'Add Customer';
    this.buttons = buttons.core.customers.create;
    let navState = this.navService.getNavigationState();
    if (this.router.url === '/core/administration/addcustomers') {
      navState.currentMasterId = 0;
      this.navService.setNavigationState(navState);
    }
    this.config.defaultCountryCode = navState?.currentAccount?.mainMobileCode ?? this.config.defaultCountryCode;
    this.apiService
      .GetMasterInfo('Customer/GetCustomerInfo', navState.currentMasterId)
      .subscribe({
        next: (result) => {
          this.masterData = result;
          this.formData = this.masterData?.customers
            ? this.masterData?.customers[0]
            : null;
            if (this.formData?.imageUrl != null) {
              this.imageUrl = this.formData?.imageUrl;
            }
          if (this.masterData?.countries) {
            this.mobileCode = this.masterData?.countries?.find(
              (c: any) => c.dialCode === this.formData.contactMobileCode?? this.config?.defaultCountryCode
            );
            this.landLineCode = this.masterData?.countries?.find(
              (c: any) => c.dialCode === this.formData.contactLandLineCode??this.config?.defaultCountryCode
            );
            this.faxNoCode = this.masterData?.countries?.find(
              (c: any) => c.dialCode === this.formData.contactFaxNumberCode??this.config?.defaultCountryCode
            );
            this.alternateMobileCode = this.masterData?.countries?.find(
              (c: any) => c.dialCode === this.formData.emergencyContactMobileCode??this.config?.defaultCountryCode
            );
          }
          let customerType = this.masterData?.customerTypes.find(
            (c: any) => c.id === this.formData?.customerTypeId
          );
          this.customerTypeSelected(
            customerType ?? this.masterData?.customerTypes[0]
          );
          this.myProfile = fb.group({
            customerType: [
              this.formData?.customerTypeId ??
                this.masterData?.customerTypes[0].id,
              Validators.required
            ],
            customerSubType: [
              this.formData?.customerSubTypeId ?? this.customerSubTypes[0].id,
              Validators.required
            ],
            customerId: [this.formData?.id ?? 0],
            firstName: [this.formData?.firstName, Validators.required],
            middleName: [this.formData?.middleName, Validators.required],
            lastName: [this.formData?.lastName, Validators.required],
            dob: [this.formData?.dob, Validators.required],
            nationality: [this.formData?.nationalityId, Validators.required],
            gender: [this.formData?.gender, Validators.required],
            country: [this.formData?.countryId, Validators.required],
            state: [this.formData?.stateId, Validators.required],
            city: [this.formData?.cityId, Validators.required],
            streetNo: [this.formData?.streetNo, Validators.required],
            streetName: [this.formData?.streetName, Validators.required],
            landMark: [this.formData?.landMark, Validators.required],
            zipCode: [this.formData?.postalCode, Validators.required]
          });
          this.countrySelected({ value: this.formData?.countryId.toString() });

          this.contactInfo = fb.group({
            mobileNo: [
              this.formData?.contactMobileNumber,
              [Validators.minLength(6), Validators.maxLength(15)]
            ],
            emailAddress: [this.formData?.contactEmail, Validators.required],
            landNo: [this.formData?.contactLandLineNumber, Validators.required],
            fax: [this.formData?.contactFaxNumberNumber, Validators.required],
            name: [this.formData?.emergencyContactName, Validators.required],
            lastName: [
              this.formData?.emergencyContactLastName,
              Validators.required
            ],
            relationship: [
              this.formData?.emergencyContactRelationShip,
              Validators.required
            ],
            emergencyMobileNo: [
              this.formData?.emergencyContactMobileNumber,
              Validators.required
            ],
            emergencyEmail: [
              this.formData?.emergencyContactEmail,
              Validators.required
            ]
          });

          this.unitSelected({value: this.formData?.unitId});

          this.propertyInfo = fb.group({
            unitDetails: [this.formData?.unitId, Validators.required],
            building: [this.formData?.buildingId, Validators.required],
            floor: [this.formData?.floorId, Validators.required],
            unit: [this.formData?.unitId, Validators.required],
            unitType: [this.selectedUnit?.unitTypeName, Validators.required],
            areaSqft: [this.selectedUnit?.builtUpAreaSqFt, Validators.required],
            areaSqmt: ['', Validators.required],
            isOccupant: [true, Validators.required]
          });

          this.authentication = fb.group({
            refCode1: [this.formData?.refCode1, Validators.required],
            refCode2: [this.formData?.refCode2, Validators.required]
          });

          this.isDataLoaded = true;
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

  customerTypeSelected(customerType: any) {
    this.selectedCustomerType = customerType;
    this.customerSubTypes = this.masterData?.customerSubTypes?.filter(
      (c: any) => c.customerTypeId === customerType.id
    );
  }

  customerSubTypeSelected(customerSubType: any) {
    this.selectedCustomerSubType = customerSubType;
  }

  addCustomer() {
    let formData = {
      ...this.myProfile.value,
      ...this.contactInfo.value,
      ...this.propertyInfo.value,
      ...this.authentication.value
    };
    let customer = {
      id: formData.customerId,
      accountId: 0,
      uniqueId: 0,
      imageUrl: '',
      code: '',
      customerTypeId: parseInt(formData.customerType),
      customerTypeName: '',
      customerSubTypeId: parseInt(formData.customerSubType),
      customerSubTypeName: '',
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dob: formData.dob,
      nationalityId: parseInt(formData.nationality),
      nationalityName: '',
      gender: formData.gender,
      isMobileLoginAllowed: true,
      isWebLoginAllowed: true,
      countryId: parseInt(formData.country),
      countryName: '',
      stateId: parseInt(formData.state),
      stateName: '',
      cityId: parseInt(formData.city),
      cityName: '',
      streetNo: formData.streetNo,
      streetName: formData.streetName,
      landmark: formData.landMark,
      postalCode: formData.zipCode,
      contactMobileCode: this.mobileCode.dialCode,
      contactMobileNumber: formData.mobileNo,
      contactEmail: formData.emailAddress,
      contactMobileCode1: '',
      contactMobileNumber1: '',
      alternativeEmail1: 'dummyemail1@gmail.com',
      contactMobileCode2: '',
      contactMobileNumber2: '',
      alternativeEmail2: 'dummyemail2@gmail.com',
      contactLandLineCode: this.landLineCode.dialCode,
      contactLandLineNumber: formData.landNo,
      contactFaxNumberCode: this.faxNoCode.dialCode,
      contactFaxNumberNumber: formData.fax,
      emergencyContactName: formData.name,
      emergencyContactLastName: formData.lastName,
      emergencyContactRelationShip: formData.relationship,
      emergencyContactMobileCode: this.alternateMobileCode.dialCode,
      emergencyContactMobileNumber: formData.mobileNo,
      emergencyContactEmail: formData.emailAddress,
      zoneId: isNaN(formData.zone) ? '' : parseInt(formData.zone),
      zoneName: '',
      buildingId: parseInt(formData.building),
      buildingName: '',
      floorId: parseInt(formData.floor),
      floorName: '',
      unitId: parseInt(formData.unit),
      unitName: '',
      isOccupant: formData.isOccupant,
      customerAccessMethodId: 0,
      refCode1: formData.refCode1,
      refCode2: formData.refCode2,
      interests: '',
      status: 'dummystatus',
      isVIP: true,
      image: this.image ?? ''
    };
    this.apiService
      .AddOrUpdateMaster(
        'Customer/AddOrUpdateCustomer',
        customer,
        true,
        MasterComponentTypes.CUSTOMERS
      )
      .subscribe({
        next: (result) => {
          this.alertService
            .success('Customer saved successfully  !!', {
              id: 'alert-customer'
            })
            .then(() => {
              this.router.navigate(['core/administration/customers']);
            });
        },
        error: (err) => {
          this.alertService.error('Error saving customer !!', {
            id: 'alert-customer'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  buttonClicked(buttonType: any) {
    if (buttonType == 'Save') {
      this.addCustomer();
    } else {
      this.router.navigate(['core/administration/customers']);
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

  countrySelected(country: any) {
    this.states = this.masterData?.states?.filter(
      (s: any) => s.countryId === parseInt(country.value)
    );
    this.stateSelected({ value: this.formData?.stateId.toString() });
  }

  stateSelected(state: any) {
    this.cities = this.masterData?.cities?.filter(
      (c: any) => c.stateId === parseInt(state.value)
    );
    this.citySelected({ value: this.formData?.cityId.toString() });
  }

  citySelected(city: any) {
    this.buildings = this.masterData?.buildings?.filter(
      (b: any) => b.cityId === parseInt(city.value)
    );
    this.buildingSelected({ value: this.formData?.buildingId.toString() });
  }

  buildingSelected(building: any) {
    this.units = this.masterData?.units?.filter(
      (u: any) => u.buildingId === parseInt(building.value)
    );
  }

  unitSelected(unit: any) {
    this.selectedUnit = this.units?.find(
      (u: any) => u.id === parseInt(unit.value)
    );
  }
}
