import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common/common-popup/common-popup.component';
import { FormatHelper } from 'src/app/helpers/FormatHelper';
import { InputType } from 'src/app/models/enums/InputType.enum';
import { IFormField } from 'src/app/models/interfaces/IFormField';

@Component({
  selector: 'app-add-master-popup',
  templateUrl: './add-master-popup.component.html',
  styleUrls: ['./add-master-popup.component.scss']
})
export class AddMasterPopupComponent extends CommonPopupComponent implements OnInit {
  assetForm: any;
  formFieldBuilder: IFormField[] = [];
  formData: any;
  InputType = InputType;
  countries: any[] = [];
  buildings: any[] = [];
  floors: any[] = [];
  currentStates: any[] = [];
  currentUnits: any[] = [];
  curentMaster: any;

  constructor(
    dialogRef: MatDialogRef<AddMasterPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    super(dialogRef);
    this.formData = data;
  }

  ngOnInit() {
    if (this.formData.isDynamicForm) {
      this.assetForm = new FormGroup(this.formData.formGroup);
      this.formFieldBuilder = this.formData.formBuilder;
    } else if (this.formData?.masterType === 'Cities') {
      this.countries = this.formData?.dataLists['countries'];
      if (this.formData.asset) {
        this.curentMaster = this.formData.asset;
        this.onCountryChange({ value: this.curentMaster?.countryId });
      }
      this.assetForm = this.fb.group({
        refNo: [this.curentMaster?.id],
        code: [this.curentMaster?.code, Validators.required],
        country: [this.curentMaster?.countryId, Validators.required],
        state: [this.curentMaster?.stateId, Validators.required],
        city: [this.curentMaster?.name, Validators.required],
        pinCode: [this.curentMaster?.pinCode, Validators.required],
        latitude: [this.curentMaster?.latitude],
        longitude: [this.curentMaster?.longitude]
      });
    } else if (this.formData?.masterType === 'Rooms') {
      this.buildings = this.formData?.dataLists['buildings'];
      this.floors = this.formData?.dataLists['floors'];
      if (this.formData.asset) {
        this.curentMaster = this.formData.asset;
        this.onBuildingChange({ value: this.curentMaster?.buildingId });
      }
      this.assetForm = this.fb.group({
        refNo: [this.curentMaster?.id],
        code: [this.curentMaster?.code, Validators.required],
        name: [this.curentMaster?.name, Validators.required],
        building: [this.curentMaster?.buildingId, Validators.required],
        floor: [this.curentMaster?.floorId, Validators.required],
        unit: [this.curentMaster?.unitId, Validators.required],
        description: [this.curentMaster?.description, Validators.required],
        isStockLocation: [this.curentMaster?.isStockLocation ?? false]
      });
    }
  }

  pad(num: number, size: number): string {
    return FormatHelper.pad(num, size);
  }

  save(): void {
    if (this.assetForm?.valid) {
      let formData = this.assetForm.value;
      if (this.formData.isDynamicForm) {
        if (!formData.id) {
          formData['id'] = this.data.asset?.id ?? 0;
        }
        this.dialogRef.close(formData);
      } else if (this.formData?.masterType === 'Cities') {
        let city = {
          id: this.curentMaster?.id
            ? parseInt(this.curentMaster?.id.replace('CTY', ''))
            : 0,
          name: formData.city,
          code: formData.code,
          dialCode: '',
          latitude: formData.latitude,
          longitude: formData.longitude,
          countryId: formData.country,
          countryName: '',
          stateId: formData.state,
          stateName: '',
          pinCode: formData.pinCode
        };
        this.dialogRef.close(city);
      } else if (this.formData?.masterType === 'Rooms') {
        let room = {
          id: this.curentMaster?.id
            ? parseInt(this.curentMaster?.id.replace('RM', ''))
            : 0,
          name: formData.name,
          code: formData.code,
          description: formData.description,
          buildingId: formData.building,
          buildingName: '',
          floorId: formData.floor,
          floorName: '',
          unitId: formData.unit,
          unitName: '',
          isStockLocation: formData.isStockLocation
        };
        this.dialogRef.close(room);
      }
    }
  }

  onSeletionChange(obj: any, fieldName: string | undefined): void {
    if (fieldName) {
      this.assetForm.get(fieldName).setValue(obj.value);
    }
  }

  onCountryChange(selectedCountry: any): void {
    let states = this.formData?.dataLists['states'];
    this.currentStates = states?.filter(
      (state: any) => state.countryId === parseInt(selectedCountry.value)
    );
  }

  onBuildingChange(selectedBuilding: any): void {
    let units = this.formData?.dataLists['units'];
    this.currentUnits = units?.filter(
      (unit: any) => unit.buildingId === parseInt(selectedBuilding.value)
    );
  }
}
