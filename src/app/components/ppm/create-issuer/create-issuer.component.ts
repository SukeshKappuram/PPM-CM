import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { PlannedActionType } from 'src/app/models/enums/PlannedActionType.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GridFilterComponent } from 'src/app/shared/grid-filter/grid-filter.component';
import { KendoGridComponent } from 'src/app/shared/kendo-grid/kendo-grid.component';
import { PageHeaderComponent } from 'src/app/shared/page-header/page-header.component';
import buttons from '../../../helpers/buttons.json';
import { LocationsPopupComponent } from '../common-wf-grid/locations-popup/locations-popup.component';

@Component({
  selector: 'app-create-issuer',
  templateUrl: './create-issuer.component.html',
  styleUrls: ['./create-issuer.component.scss']
})
export class CreateIssuerComponent extends CommonComponent implements OnInit {
  filterForm: FormGroup;
  selectedAssets: any = [];
  selectedAll: boolean = false;
  isChecked: boolean = false;
  nonSortableColumns: any[] = [];
  pageLength: number = 15;
  buildings: any[] = [];
  @ViewChild('kgrid') grid!: KendoGridComponent;
  @ViewChild('filter') gridFilter!: GridFilterComponent;
  @ViewChild('header') pageHeader!: PageHeaderComponent;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private navService: NavigationService
  ) {
    super();
    this.filterForm = this.fb.group({
      projectGroup: [],
      projectReffCode: ['', Validators.required],
      masterDevelopment: [],
      building: [''],
      system: [],
      tag: [],
      store: [],
      discipline: [],
      shift: []
    });
    this.config['apiUrl'] = this.route.snapshot.data['url'];
    this.config['apiEndpoint'] = this.route.snapshot.data['api'];
    this.config['title'] = this.route.snapshot.data['title'];
    this.config['items'] = this.route.snapshot.data['items'];
    this.config['isFrequencyProjected'] =
      this.route.snapshot.data['isFrequencyProjected'];
    this.config['isFrequencyMandatory'] =
      this.route.snapshot.data['isFrequencyMandatory'];
    this.config['isFrequencySelected'] =
      this.route.snapshot.data['isFrequencySelected'];
  }

  ngOnInit() {
    this.navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState?.subMenu)
    this.buttons = buttons.ppm.issuer.create;
    if(!this.userAccess.canAdd && !this.userAccess.canUpdate){
      this.buttons = this.buttons.filter(
        (button) =>
          button.id !== 'Build' &&
          button.id !== 'Issue' &&
          button.id !== 'Drop'
      );
    }
  }

  build(filter: any): void {
    this.selectedAssets = [];
    this.gridData = {
      configuration: {
        columns: [],
        systemCodes: [],
        subSystemCodes: [],
        parameterTypeCodes: []
      },
      actions: {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        canSelect: true
      },
      data: []
    };

    if (!filter.projectId) {
      this.alertService.error('Please select valid project / building', {
        id: 'alert-issuer'
      });
      return;
    } else if (
      this.config.isFrequencyMandatory &&
      (filter.frequencyTypeIds == '' ||
        filter.frequencyTypeIds == undefined ||
        filter.frequencyTypeIds == null)
    ) {
      this.alertService.error('Please Select Frequency !!', {
        id: 'alert-issuer'
      });
    } else if (filter.weeksAhead < 0) {
      this.alertService.error('Time ahead should be greater than or equal to 0 !!', {
        id: 'alert-issuer'
      });
      return;
    } else {
      this.apiService
        .GetOrUpdateIssuerData(
          this.config?.apiUrl,
          filter,
          this.config?.apiEndpoint
        )
        .subscribe({
          next: (result) => {
            let gridData = result;
            gridData.actions.canExport = this.userAccess?.canExport;
            let locationColumn = gridData?.configuration?.columns?.find(
              (col: any) => col.mappingColumn == 'locationId'
            );
            gridData.data?.forEach((row: any) => {
              row[
                'assetCode,assetName'
              ] = `<div><a class="text-body font-weight-semibold">${row.assetCode}</a>
                <div class="text-muted font-size-sm">${row.assetName}</div></div>`;
              row['assetCode-assetName'] = `${row.assetCode ?? ''}, ${
                row.assetName ?? ''
              }`;
              row[
                'systemName,tagName'
              ] = `<div><a class="text-body font-weight-semibold">${
                row.systemName
              }</a>
              <div class="text-muted font-size-sm">${
                row.tagName ?? 'NA'
              }</div></div>`;
              row[
                'typeName-subTypeName'
              ] = `${row.typeName}, ${row.subTypeName}`;
              row[
                'buildingName,locationName'
              ] = `<div><a class="text-body font-weight-semibold">${row.buildingName}</a>
            <div class="text-muted font-size-sm">${row.locationName}</div></div>`;
              row[
                'buildingName-locationName'
              ] = `${row.buildingName}, ${row.locationName}`;
              row[
                'taskInstructionCode,taskInstructionName'
              ] = `<div><a class="text-body font-weight-semibold">${
                row.taskInstructionCode
              }</a>
              <div class="text-muted font-size-sm">${
                row.taskInstructionName ?? 'NA'
              }</div></div>`;
              row[
                'taskInstructionCode-taskInstructionName'
              ] = `${row.taskInstructionCode}, ${row.taskInstructionName}`;
              if (
                locationColumn &&
                locationColumn?.columnFormat === this.ColumnFormat.HTML
              ) {
                row['locationDetailsId'] = row.locationId;
                row['locationId'] =
                  row.locationId === 0
                    ? ''
                    : `<div class="position-relative w-100 text-center">
                <i class="bi bi-geo-alt-fill cursor-pointer"></i>`;
              }
            });
            this.gridFilter.toggleShow();
            this.dataService.filterApplied({
              isFilterApplied: true,
              noOfFiltersApplied: 1
            });
            this.gridData = gridData;
          },
          error: (e) => {
            this.alertService.error('Error Retrieving Issuer !!', {
              id: 'alert-issuer'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  openLocation(columnSelected: any): void {
    if (
      columnSelected.name === 'locationId' &&
      columnSelected?.value?.locationDetailsId > 0
    ) {
      this.dialog
        .open(LocationsPopupComponent, {
          data: {
            taskId: columnSelected.value?.locationDetailsId,
            title: 'Locations'
          },
          autoFocus: true,
          maxHeight: '85vh',
          width: '80vw',
          disableClose: true
        })
        .afterClosed();
    }
  }

  protected override buttonClicked(buttonType: any): void {
    if (buttonType == 'Build') {
      this.gridFilter.setFilter();
    } else if (buttonType == 'Issue') {
      this.updateStatus(PlannedActionType.Issue);
    } else if (buttonType == 'Drop') {
      this.updateStatus(PlannedActionType.Dropped);
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.PPM_ISSUER_GRID]);
    }
  }

  updateStatus(status: PlannedActionType): void {
    this.selectedAssets = this.grid.selectedRows;
    if (this.selectedAssets.length > 0) {
      let updateData = {
        selectedItemIds: this.selectedAssets.join(),
        actionId: status
      };
      this.apiService
        .UpdatePPMStatus(
          'Issuer/UpdateIssuerStatus',
          updateData,
          this.config?.apiEndpoint
        )
        .subscribe({
          next: (result) => {
            if (result) {
              this.alertService
                .success('Issuer Updated Successfully', {
                  id: 'alert-issuer'
                })
                .then(() => {
                  this.gridFilter?.setFilter();
                });
            } else {
              this.alertService.error('Error Updating Issuer !!', {
                id: 'alert-issuer'
              });
            }
          },
          error: (e) => {
            this.alertService.error('Error Updating Issuer !!', {
              id: 'alert-issuer'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    } else {
      this.alertService.error('No records selected !!', {
        id: 'alert-issuer'
      });
    }
  }
  selectionChange(isChecked: any): void {
    this.grid.selectedRows = isChecked;
  }
}
