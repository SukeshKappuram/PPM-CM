import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import { IAssetData } from 'src/app/models/interfaces/IAssetData';
import { IUserAccess } from 'src/app/models/interfaces/auth/IUserAccess';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {

  parameters: any[] = [];
  parameterData: any[] = [];
  availableParameters: any[] = [];
  selectedParameter: any;
  subSuystemId: number = 0;
  formData: any[] = [];
  selectedParameters: any[] = [];
  paraForm: FormGroup = new FormGroup({});

  @Input() selectedSubSystem: number = 0;
  @Input() masterData: any;
  @Input() isEditable: boolean = false;
  @ViewChild('parameters') parameterDD!: DropdownComponent;
  @Input() userAccess !: IUserAccess;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private navService: NavigationService,
    private alertService: SweetAlertService
  ) {
    let assetDetails: IAssetData =
      this.navService.getNavigationState().assetData;
    this.parameterData = assetDetails?.parameters ?? [];
    this.subSuystemId = assetDetails?.generals.subSystemId;
  }

  ngOnInit(): void {
    this.parameters = this.masterData?.subSystemParameters?.filter(
      (p: any) => p.subSystemId === this.subSuystemId
    );

    this.paraForm = this.fb.group({
      additionalField: [],
      parameterValues: this.fb.array([])
    });

    this.availableParameters = this.parameters?.filter((p) => {
      return (
        this.parameterData?.filter((pd: any) => {
          return pd.parameterId == p.id;
        }).length == 0
      );
    });

    this.parameterData?.forEach((param) => {
      let p = {
        id: param.parameterId,
        name: this.parameters.find((p: any) => p.id == param.parameterId)?.name,
        value: param.parameterValue,
        type: this.parameters.find((p: any) => p.id == param.parameterId)?.type
      };
      this.addParameter(p);
    });
  }

  getParaForm(form: any): FormGroup {
    return form;
  }

  onSubSystemChanged(selectedSubSystem: any) {
    this.selectedSubSystem = selectedSubSystem;
    if (this.selectedSubSystem) {
      this.parameters = this.masterData?.subSystemParameters?.filter(
        (p: any) => p.subSystemId == this.selectedSubSystem
      );
      this.availableParameters = this.parameters?.filter((p) => {
        return (
          this.parameterData?.filter((pd: any) => {
            return pd.parameterId == p.id;
          }).length == 0
        );
      });
    }
  }

  onChange(parameter: any): void {
    if (parameter.value) {
      this.selectedParameter = this.availableParameters.find(
        (p: any) => p.id == parameter.value
      );
      this.parameterDD.setToDefault();
    }
  }

  get parameterValuesFieldAsFormArray(): any {
    return this.paraForm.get('parameterValues') as FormArray;
  }

  parameterValue(name: string, value?: string): any {
    return this.fb.group({
      name: [name],
      value: [value, Validators.required]
    });
  }

  addParameter(parameter: any) {
    if (!this.selectedParameters.some((p) => p.id === parameter.id)) {
      this.selectedParameters.push(parameter);
      this.parameterValuesFieldAsFormArray.push(
        this.parameterValue(parameter.name, parameter.value ?? '')
      );
      this.availableParameters = this.parameters?.filter((p) => {
        return (
          this.selectedParameters?.filter((pd: any) => {
            return pd.id == p.id;
          }).length == 0
        );
      });
    }
  }

  remove(i: any): void {
    this.parameterValuesFieldAsFormArray.removeAt(i);
    this.availableParameters.push(
      this.parameters.find((p) => p.id === this.selectedParameters[i].id)
    );
    this.selectedParameters.splice(i, 1);
  }

  save(): void {
    let parameters = this.paraForm.value;
    let navState = this.navService.getNavigationState();
    this.formData = [];
    parameters.parameterValues.forEach((param: any) => {
      this.formData.push({
        assetId: navState.currentAssertId,
        parameterId: this.parameters.find((p) => p.name === param.name).id,
        parameterValue: param.value
      });
    });
    this.apiService
      .SaveAsset('Activity/SaveAssetParameters', this.formData)
      .subscribe({
        next: (result: any) => {
          if (result > 0) {
            navState.assetData = { parameters: this.formData };
            this.navService.setNavigationState(navState);
            this.alertService.success('Asset saved  successfully!!', {
              id: 'alert-asset'
            });
          } else {
            this.alertService.error('Could not update asset details!!', {
              id: 'alert-asset'
            });
          }
        },
        error: (e: any) => {
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

  public defaultItem(text : string): any{
    return {
      code: "Select",
      name: text,
    };
  }
}
