import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from 'src/app/components/common/common.component';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { FormatHelper } from 'src/app/helpers/FormatHelper';
import { InputType } from 'src/app/models/enums/InputType.enum';
import { IColumn } from 'src/app/models/interfaces/IColumn';
import { IEditConfig } from 'src/app/models/interfaces/IEditConfig';
import { IFormField } from 'src/app/models/interfaces/IFormField';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DataTableComponent } from 'src/app/shared/data-table/data-table.component';
import buttons from '../../../../../helpers/buttons.json';
import locations from '../../../../../helpers/locations.json';
import others from '../../../../../helpers/otherMasters.json';
import resources from '../../../../../helpers/resources.json';
import { AddMasterPopupComponent } from '../add-master-popup/add-master-popup.component';

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.scss']
})
export class MasterListComponent extends CommonComponent implements OnInit {
  @ViewChild('assetGrid') assetDetailsGrid!: DataTableComponent;
  pageDescription?: string = '';
  formFieldBuilder: IFormField[] = [];
  assetForm: any = {};
  dataList: any[] = [];
  data: any[] = [];
  selectedSubSystem: number = 1;
  isFormModified: boolean = false;
  override formData: any = { subSystemId: 0, parameterIds: [] };
  menuItems: string[] = [];
  selectedModule: any;
  menuList: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private navService: NavigationService,
    private apiService: ApiService,
    public dialog: MatDialog,
    public alertService: SweetAlertService,
    private router: Router
  ) {
    super();
    let masterType = this.route.snapshot.data['masterType'];
    this.buttons = buttons.core.masterList.header;
    switch (masterType) {
      case 'Locations':
        this.menuList = locations;
        this.selectedModule = locations[0];
        break;
      case 'Resources':
        this.menuList = resources;
        this.selectedModule = resources[0];
        break;
      default:
        this.menuList = [];
        this.selectedModule = others.find((m) => m.name === masterType);
        break;
    }
    let dropdownBtn = this.buttons.find(
      (button) => button.id === 'masterTypes'
    );
    if (dropdownBtn && this.menuList.length > 0) {
      dropdownBtn.label = masterType;
      dropdownBtn.icon = this.selectedModule?.icon;
      dropdownBtn.dropdownList = this.menuList.map((item) => item.name);
    } else if (dropdownBtn) {
      this.buttons = this.buttons.filter(
        (button) => button.id !== 'masterTypes'
      );
    }
    let navState = navService.getNavigationState();
    this.pageTitle = navState.subMenu?.tabName ?? '';
    this.pageDescription = navState.subMenu?.pageDescription;
    this.menuItems = [navState.selectedGroup, navState.selectedMenu];
    if (this.menuList.length > 0) {
      this.menuItems.push(this.pageTitle);
    }
    let selectedModule = navState.currentMaster;
    if (selectedModule) {
      this.selectedModule = this.menuList.find(
        (menu) => menu.name === selectedModule
      );
      navState.currentMaster = undefined;
      this.navService.setNavigationState(navState);
    }
    this.userAccess = this.convertToUserAccess(navState.subMenu);
  }

  ngOnInit(): void {
    this.getAssets();
  }

  getAssets(): void {
    if (this.gridData?.configuration?.columns?.length > 0) {
      this.gridData.configuration.columns = [];
    }
    this.apiEndpoint = this.route.snapshot.data['apiEndpoint'];
    let apiUrl = this.navService.getNavigationState().subMenu?.url;
    if (apiUrl) {
      apiUrl = apiUrl.split('/')[0];
    }

    this.apiService
      .GetAssetList(
        apiUrl +
          (this.selectedModule?.listUrl
            ? '/' + this.selectedModule?.listUrl
            : ''),
        this.apiEndpoint
      )
      .subscribe({
        next: (result: any) => {
          if (result) {
            let gridData = result;
            gridData.actions = this.mapUserAccess(gridData.actions, this.userAccess);
            gridData.data = result[this.selectedModule.type];
            if(!gridData?.actions?.canAdd){
              this.buttons = this.buttons.filter(
                (button) => button.id !== 'Add-New'
              );
            }
            gridData.data?.forEach((element: any) => {
              element['statusName'] = element.statusName
                ? '<span class="badge badge-success badge-pill">' +
                  element.statusName +
                  '</span>'
                : '';
              element['statusName-'] = element.statusName;
              element['unitStatusName'] = element.unitStatusName
                ? '<span class="badge ' +
                  this.getUnitStatusBadge(
                    element.unitStatusName.toLowerCase()
                  ) +
                  ' badge-pill">' +
                  element.unitStatusName +
                  '</span>'
                : '';
              element['customerTypeName'] = element.customerTypeName
                ? '<span class="badge ' +
                  this.getTypeBadge(element.customerTypeName.toLowerCase()) +
                  ' badge-pill">' +
                  element.customerTypeName +
                  '</span>'
                : '';
              element.id =
                this.selectedModule.referenceId +
                FormatHelper.pad(element.id, 4);

              element.imageUrl =
                '<img class="card-img img-fluid" src="' +
                element.imageUrl +
                '"width="50px" loading="lazy" />';
            });
            this.gridData = gridData;
            setTimeout(() => {
              // this.assetDetailsGrid?.filterChanged('', '');
            }, 100);
          } else {
            this.alertService.warn('Could not retreve data !!', {
              id: 'alert-assetsList'
            });
          }
        },
        error: (e) => {
          this.alertService.error('Error retreving data !!', {
            id: 'alert-assetsList'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  getUnitStatusBadge(status: string): string {
    let badge = '';
    switch (status) {
      case 'vacant':
        badge = 'badge-warning';
        break;
      case 'legal':
        badge = 'badge-secondary';
        break;
      case 'reserved':
        badge = 'badge-purple';
        break;
      case 'occupied':
        badge = 'badge-success';
        break;
      case 'offered':
        badge = 'badge-info';
        break;
    }
    return badge;
  }

  getTypeBadge(status: string): string {
    let badge = '';
    switch (status) {
      case 'owner':
        badge = 'badge-warning';
        break;
      case 'others':
        badge = 'badge-purple';
        break;
      case 'tenant':
        badge = 'badge-success';
        break;
      case 'managing agent':
        badge = 'badge-info';
        break;
    }
    return badge;
  }

  deleteAsset(item: any): void {
    this.apiService
      .DeleteAsset(
        this.navService.getNavigationState().subMenu?.url +
          '/' +
          this.selectedModule.addUpdateUrl ?? '',
        item.id,
        this.apiEndpoint
      )
      .subscribe({
        next: (result) => {
          if (result) {
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
          });
          console.error(e);
        },
        complete: () => this.getAssets()
      });
  }

  buttonClicked(item?: any): void {
    if (item === 'Add-New') {
      let navState = this.navService.getNavigationState();
      navState.currentMasterId = 0;
      this.navService.setNavigationState(navState);
      if (this.selectedModule?.routeEnabled) {
        if (this.selectedModule?.hasCustomComponent) {
          this.router.navigate([this.selectedModule.customComponent]);
        } else {
          this.router.navigate([
            '/core/administration/add/' + this.selectedModule?.masterType
          ]);
        }
      } else {
        this.modifyAsset();
      }
      return;
    }
    this.selectedModule = this.menuList.filter((menu) => menu.name === item)[0];
    this.getAssets();
  }

  edit(item: any) {
    if (this.selectedModule?.routeEnabled) {
      let navState = this.navService.getNavigationState();
      navState.currentMasterId = parseInt(
        item.id.replace(this.selectedModule.referenceId, '')
      );
      navState.isEditable = true;
      this.navService.setNavigationState(navState);
      if (this.selectedModule?.hasCustomComponent) {
        this.router.navigate([this.selectedModule.editCustomComponent]);
      } else {
        this.router.navigate([
          '/core/administration/edit/' + this.selectedModule?.masterType
        ]);
      }
    } else {
      this.modifyAsset(item);
    }
  }

  modifyAsset(item?: any): void {
    if (this.selectedModule.hasCustomComponent) {
      let config: any = this.gridData.configuration;
      let fieldListData: any = this.gridData;
      if (
        this.selectedModule.name === 'Cities' ||
        this.selectedModule.name === 'Rooms'
      ) {
        this.dialog
          .open(AddMasterPopupComponent, {
            data: {
              isDynamicForm: false,
              asset: item,
              dataLists: fieldListData,
              assetTitle:
                (item ? 'Update ' : 'Add ') +
                this.selectedModule.name.slice(0, -1),
              masterType: this.selectedModule.name
            },
            autoFocus: true,
            maxHeight: '80vh',
            width: '500px',
            disableClose: true
          })
          .afterClosed()
          .subscribe((asset) => {
            if (asset) {
              this.addOrUpdate(asset);
            }
          });
      }
    } else {
      this.buildForm(this.gridData.configuration.columns, item);
      const dialogRef = this.dialog
        .open(AddMasterPopupComponent, {
          data: {
            isDynamicForm: true,
            formGroup: this.assetForm,
            formBuilder: this.formFieldBuilder,
            asset: item,
            assetTitle:
              (item ? 'Update ' : 'Add ') +
              this.selectedModule.name.slice(0, -1)
          },
          autoFocus: true,
          maxHeight: '80vh',
          width: '500px',
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
  }

  addOrUpdate(item: any): void {
    this.apiService
      .AddOrUpdateAsset(
        this.navService.getNavigationState().subMenu?.url +
          '/' +
          this.selectedModule.addUpdateUrl ?? '',
        item,
        this.apiEndpoint
      )
      .subscribe({
        next: (result) => {
          if (result > 0) {
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
          });
          console.error(e);
        },
        complete: () => this.getAssets()
      });
  }

  updateGrid(selectedSubsystem: any): void {
    this.selectedSubSystem = parseInt(selectedSubsystem.value);
    this.formData.subSystemId = this.selectedSubSystem;
    this.data.forEach((p) => {
      if (p.subSytemIds.includes(this.selectedSubSystem)) {
        this.formData.parameterIds.push(p.paramterId);
      }
    });
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

  isChecked(subSystemsIds: number[]): boolean {
    return subSystemsIds.includes(this.selectedSubSystem);
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
    let fieldListData: any = this.gridData;

    let propertyName = CommonHelper.getNonNullValue(
      editConfig.mappingField ?? '',
      fieldName
    );
    let value = assetData
      ? assetData[propertyName]
      : editConfig?.fieldType === InputType.Toggle
      ? false
      : '';
    if (editConfig?.showField && !editConfig?.isReadOnly) {
      this.assetForm[fieldName] = new FormControl(
        typeof value === 'boolean' ? value : value?.toString(),
        [Validators.required]
      );
    } else {
      value = value === '' ? '0' : value;
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
      value: value
        ? value
        : editConfig?.fieldType === InputType.Toggle
        ? true
        : value,
      isRequired: !(editConfig?.isReadOnly ?? false),
      fieldData: fieldListData[editConfig?.mappingData] ?? [],
      fieldType: editConfig?.fieldType ?? InputType.Text,
      propertyName: editConfig?.mappingField
    });
  }

  getType(id: number): string {
    return this.gridData.configuration.parameterTypeCodes.find(
      (p: any) => p.id === id
    ).name;
  }
}
