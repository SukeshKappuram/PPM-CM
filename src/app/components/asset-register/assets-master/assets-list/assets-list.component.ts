import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from 'src/app/components/common/common.component';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { AdditionalFieldsType } from 'src/app/models/enums/AdditionalFieldsType.enum';
import { DataFormat } from 'src/app/models/enums/DataFormat.enum';
import { InputType } from 'src/app/models/enums/InputType.enum';
import { IColumn } from 'src/app/models/interfaces/IColumn';
import { IEditConfig } from 'src/app/models/interfaces/IEditConfig';
import { IFormField } from 'src/app/models/interfaces/IFormField';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import buttons from '../../../../helpers/buttons.json';
import { AddAssetComponent } from '../add-asset/add-asset.component';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent extends CommonComponent implements OnInit {
  dataFormat: number = DataFormat.Grid;
  pageDescription?: string = '';
  formFieldBuilder: IFormField[] = [];
  assetForm: any = {};
  dataList: any[] = [];
  data: any[] = [];
  selectedSystemOrGroup: number = 1;
  isFormModified: boolean = false;
  override formData: any = { subSystemId: 0, subGroupId: 0, parameterIds: [] };
  menuItems: string[] = [];
  additionalFieldsType: AdditionalFieldsType = AdditionalFieldsType.SUBSYSTEMS;
  AdditionalFieldsType = AdditionalFieldsType;
  isUnderDevelopment: boolean = false;
  DataFormat = DataFormat;

  @ViewChild('subSystemCodes') subSystemDropdown!: DropdownComponent;

  DemoUrls: string[] = [
    'Procurement/CreateMR',
    'UserManagement/LogInUsers',
    'GRN'
  ];

  constructor(
    private route: ActivatedRoute,
    private navService: NavigationService,
    private apiService: ApiService,
    public dialog: MatDialog,
    public alertService: SweetAlertService,
    private router: Router
  ) {
    super();
    this.navState = navService.getNavigationState();
    this.pageTitle = this.navState.subMenu?.tabName ?? '';
    this.pageDescription = this.navState.subMenu?.pageDescription;
    this.dataFormat = this.navState.subMenu?.dataFormat ?? DataFormat.Grid;
    this.menuItems = [this.navState.selectedGroup, this.navState.selectedMenu];
  }

  ngOnInit(): void {
    this.getAssets();
    this.userAccess = this.convertToUserAccess(this.navState.subMenu);
  }

  getAssets(): void {
    if (this.gridData?.configuration?.columns?.length > 0) {
      this.gridData.configuration.columns = [];
    }
    if (
      this.DemoUrls.includes(
        this.navService.getNavigationState().subMenu?.url ?? ''
      )
    ) {
      this.isUnderDevelopment = true;
    } else {
      this.apiEndpoint = this.route.snapshot.data['apiEndpoint'];
      this.apiService
        .GetAssetList(
          this.navService.getNavigationState().subMenu?.url ?? '',
          this.apiEndpoint
        )
        .subscribe({
          next: (result) => {
            if (result) {
              this.gridData = result;
              this.gridData.actions = this.mapUserAccess(this.gridData.actions, this.userAccess);
              if (this.gridData.actions.canAdd) {
                this.buttons = buttons.assetRegister.assetMaster.assetlist;
              }
              if (this.dataFormat === DataFormat.Table) {
                this.additionalFieldsType = this.gridData.configuration
                  ?.subSystemCodes
                  ? AdditionalFieldsType.SUBSYSTEMS
                  : AdditionalFieldsType.SUBGROUPS;
                this.dataList =
                  this.gridData.configuration?.subSystemCodes ??
                  this.gridData.configuration?.subGroups;
                this.updateGrid(this.dataList[0].id);
              }
            } else {
              this.alertService.warn('Could not retreve data !!', {
                id: 'alert-assetsList'
              });
            }
          },
          error: (e) => {
            this.alertService.error('Error retreving data !!', {
              id: 'alert-assetsList'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  deleteAsset(item: any): void {
    this.apiService
      .DeleteAsset(
        this.navService.getNavigationState().subMenu?.editUrl ?? '',
        item.id,
        this.apiEndpoint
      )
      .subscribe({
        next: (result) => {
          if (result === true || result.isSuccess) {
            this.alertService.success(
              (result.message ?? 'Deleted Successfully') + ' !!',
              { id: 'alert-assetsList' }
            );
          } else {
            this.alertService.warn(
              (result.message ?? 'Could not delete ' + this.pageTitle) + ' !!',
              { id: 'alert-assetsList' }
            );
          }
        },
        error: (e) => {
          this.alertService.error('Error deleting asset !!', {
            id: 'alert-assetsList'
          },e);
          console.error(e);
        },
        complete: () => this.getAssets()
      });
  }

  modifyAsset(item?: any): void {
    let routeEnabled = this.route.snapshot.data['routeEnabled'];
    let masterType = this.route.snapshot.data['masterType'];
    if (routeEnabled) {
      this.router.navigate(['/core/Administration/Add/' + masterType]);
    } else {
      const serviceDataEnabled = this.route.snapshot.data['serviceCallEnabled'];
      if (serviceDataEnabled) {
        this.apiService
          .getAssetDataById(
            this.route.snapshot.data['addOrEditEndpoint'] ?? '',
            item == undefined ? 0 : item.id,
            this.apiEndpoint
          )
          .subscribe({
            next: (result) => {
              if (result) {
                const grid: any = this.gridData;
                Object.keys(result).forEach((key: string) => {
                  if (grid.configuration.columns.find((x: any) => x.editConfig?.mappingData == key)) {
                    grid.configuration[key] = result[key];
                  }
                });
                this.gridData = grid;
                this.getAssetsData(item);
              } else {
                this.alertService.warn(
                  (result.message ?? 'Could not get ' + this.pageTitle) +
                    +' !!',
                  { id: 'alert-assetsList' }
                );
              }
            },
            error: (e) => {
              this.alertService.error('Error getting data ', {
                id: 'alert-assetsList'
              },e);
              console.error(e);
            },
            complete: () => this.getAssets()
          });
      } else {
        this.getAssetsData(item);
      }
    }
  }

  getAssetsData(item?: any): void {
    this.buildForm(this.gridData.configuration.columns, item);
    const dialogRef = this.dialog
      .open(AddAssetComponent, {
        data: {
          formGroup: this.assetForm,
          formBuilder: this.formFieldBuilder,
          asset: item,
          assetTitle: this.pageTitle
        },
        autoFocus: true,
        maxHeight: '90vh',
        disableClose: true
      })
      .afterClosed()
      .subscribe((asset) => {
        if (asset) {
          this.addOrUpdate(asset);
        }
        this.formFieldBuilder = [];
      });
  }

  addOrUpdate(item: any): void {
    this.apiService
      .AddOrUpdateAsset(
        this.navService.getNavigationState().subMenu?.editUrl ?? '',
        item,
        this.apiEndpoint
      )
      .subscribe({
        next: (result) => {
          if (result.isSuccess || result > 0) {
            this.alertService.success(
              (result.message ?? 'Saved Successfully') + ' !!',
              { id: 'alert-assetsList' }
            );
          } else {
            this.alertService.warn(
              (result.message ?? 'Could not save ' + this.pageTitle) + +' !!',
              { id: 'alert-assetsList' }
            );
          }
        },
        error: (e) => {
          this.alertService.error('Error updating ' + this.pageTitle + ' !!', {
            id: 'alert-assetsList'
          },e);
          console.error(e);
        },
        complete: () => this.getAssets()
      });
  }

  updateGrid(selected: any): void {
    this.selectedSystemOrGroup = parseInt(selected.value);
    if (this.additionalFieldsType === AdditionalFieldsType.SUBSYSTEMS) {
      this.formData.subSystemId = this.selectedSystemOrGroup;
      this.formData.subGroupId = null;
      this.data.forEach((p) => {
        if (p.subSytemIds?.includes(this.selectedSystemOrGroup)) {
          this.formData.parameterIds.push(p.paramterId);
        }
      });
    } else {
      this.formData.subGroupId = this.selectedSystemOrGroup;
      this.formData.subSystemId = null;
      this.data.forEach((p) => {
        if (p.subGroupIds?.includes(this.selectedSystemOrGroup)) {
          this.formData.parameterIds.push(p.paramterId);
        }
      });
    }
  }

  updateStatus(event: any, paramterId: number): void {
    this.isFormModified = true;
    if (event.target.checked) {
      this.formData.parameterIds.push(paramterId);
    } else {
      this.formData.parameterIds = this.formData.parameterIds.filter(
        (p: any) => p !== paramterId
      );
    }
  }

  saveData(): void {
    this.apiService
      .AddOrUpdateParameterLink(
        this.navService.getNavigationState().subMenu?.editUrl ?? '',
        this.formData,
        this.apiEndpoint
      )
      .subscribe({
        next: (result) => {
          if (result.isSuccess || result > 0) {
            this.alertService.success(
              (result.message ?? 'Saved Successfully') + ' !!',
              { id: 'alert-assetsList' }
            );
            this.subSystemDropdown.setToDefault();
            this.isFormModified = false;
          } else {
            this.alertService.warn(
              (result.message ?? 'Could not save ' + this.pageTitle) + ' !!',
              { id: 'alert-assetsList' }
            );
          }
        },
        error: (e) => {
          this.alertService.error('Error updating ' + this.pageTitle + ' !!', {
            id: 'alert-assetsList'
          },e);
          console.error(e);
        },
        complete: () => this.getAssets()
      });
  }

  isChecked(selectedIds: number[]): boolean {
    return selectedIds?.includes(this.selectedSystemOrGroup);
  }

  buildForm(formFields: IColumn[], assetData?: any): void {
    formFields.forEach((field) => {
      this.buildFormField(
        field.mappingColumn,
        field.editConfig,
        field.displayText,
        assetData
      );
    });
  }

  buildFormField(
    fieldName: string,
    editConfig: IEditConfig,
    displayText: string,
    assetData?: any
  ): void {
    let config: any = this.gridData.configuration;
    let propertyName = CommonHelper.getNonNullValue(
      editConfig?.mappingField ?? '',
      fieldName
    );
    let value = assetData ? assetData[propertyName] : '';
    if (editConfig?.showField && !editConfig?.isReadOnly) {
      this.assetForm[fieldName] = new FormControl(value?.toString(), [
        Validators.required
      ]);
    } else {
      value = value === '' ? '' : value;
      this.assetForm[fieldName] = new FormControl(value ?? '', []);
    }
    this.formFieldBuilder.push({
      fieldName: fieldName,
      formControl: this.assetForm[fieldName],
      isEditable: !(
        (fieldName === 'code' && value !== '') ||
        (editConfig?.isReadOnly ?? false)
      ),
      isHidden: !(editConfig?.showField ?? true),
      displayText: displayText,
      value: value,
      isRequired: !(editConfig?.isReadOnly ?? false),
      fieldData: config[editConfig?.mappingData] ?? [],
      fieldType: editConfig?.fieldType ?? InputType.Text,
      propertyName: editConfig?.mappingField
    });
  }

  getType(id: number): string {
    return this.gridData.configuration.parameterTypeCodes.find(
      (p: any) => p.id === id
    ).name;
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
