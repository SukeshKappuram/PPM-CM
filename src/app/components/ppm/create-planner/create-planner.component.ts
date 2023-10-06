import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concatMap, groupBy, map, mergeMap, of, toArray } from 'rxjs';

import { ApiService } from 'src/app/services/api.service';
import { CommonComponent } from 'src/app/components/common/common.component';
import { DatePipe } from '@angular/common';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import { GridFilterComponent } from 'src/app/shared/grid-filter/grid-filter.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { NavigationService } from 'src/app/services/navigation.service';
import { PlannedActionType } from '../../../models/enums/PlannedActionType.enum';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import buttons from '../../../helpers/buttons.json';

@Component({
  selector: 'app-create-planner',
  templateUrl: './create-planner.component.html',
  styleUrls: ['./create-planner.component.scss']
})
export class CreatePlannerComponent extends CommonComponent implements OnInit {
  @ViewChild('buildng') buildingsDD!: DropdownComponent;
  @ViewChild('unitSpace') unitOrSpaceDD!: DropdownComponent;
  plannerForm!: FormGroup;
  planner: any = {};
  auditDate: any;
  createdBy: any;
  paId: any;
  plannedDates: any = [];
  months: any = [];
  weeks: any = [];
  startDate: any;
  endDate: any;
  selectedAssets: any = [];
  isCollapsed: boolean = false;

  buildings: any[] = [];

  @ViewChild('filter') filterGrid!: GridFilterComponent;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    public datepipe: DatePipe,
    private router: Router,
    private navService: NavigationService
  ) {
    super();
    let startDate = new Date();
    let endDate = new Date(2024, 0, 24);
    this.startDate = this.datepipe.transform(startDate, 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');
    this.plannerForm = this.fb.group({
      cAId: [this.paId],
      projectGroup: ['', Validators.required],
      building: [this.planner?.building],
      system: [this.planner?.system],
      tag: [this.planner?.tag],
      startDate: [this.startDate ?? this.auditDate],
      endDate: [this.endDate ?? this.createdBy]
    });
    this.navState = this.navService.getNavigationState();
  }

  ngOnInit() {
    this.buttons = buttons.ppm.planner.create;
    this.userAccess = this.convertToUserAccess(this.navState?.subMenu);
    if(!this.userAccess.canAdd ){
      this.buttons = this.buttons.filter(
        (button) =>
          button.id !== 'Build' &&
          button.id !== 'Block' &&
          button.id !== 'OmitByFreq' &&
          button.id !== 'Omit' &&
          button.id !== 'Unblock'
      );
    }
  }

  build(filter?: any) {
    if (!filter?.projectId) {
      this.alertService.error('Please select valid project ', {
        id: 'alert-issuer'
      });
      return;
    }

    this.apiService
      .GetDataByFilter('Planner/GetPlannerReportingData', filter)
      .subscribe({
        next: (result) => {
          let gridData = result;
          of(gridData?.data)
            .pipe(
              concatMap((res) => res),
              groupBy((item: any) => item.schedulerId),
              mergeMap((obs) => {
                return obs.pipe(
                  toArray(),
                  map((items) => {
                    let currentStatus = items.map((item) =>
                      item.isBlocked
                        ? 'Blocked'
                        : item.isCancelled
                        ? 'Cancelled'
                        : item.isDropped
                        ? 'Dropped'
                        : item.isIssued
                        ? 'Issued'
                        : item.isOmit
                        ? 'Omitted'
                        : 'Planned'
                    );
                    return {
                      schedulerId: obs.key,
                      pmReference: items.map((item) => item.pmReference)[0],
                      ppmCode: items.map((item) => item.ppmCode)[0],
                      projectName: items.map((item) => item.projectName)[0],
                      buildingName: items.map((item) => item.buildingName)[0],
                      assetName: `<div><a class="text-body font-weight-semibold">${
                        items.map((item) => item.assetCode)[0]
                      }</a>
                                  <div class="text-muted font-size-sm">${
                                    items.map((item) => item.assetName)[0]
                                  }</div></div>`,
                      locationName: items.map((item) => item.locationName)[0],
                      systemName: `<div><a class="text-body font-weight-semibold">${
                        items.map((item) => item.systemName)[0]
                      }</a>
                                  <div class="text-muted font-size-sm">${
                                    items.map((item) => item.tagName)[0]
                                  }</div></div>`,
                      nextServiceDate: items.map(
                        (item) => item.nextServiceDate
                      )[0],
                      taskInstruction: `<div><a class="text-body font-weight-semibold">${
                        items.map((item) => item.taskInstructionCode)[0]
                      }</a>
                                      <div class="text-muted font-size-sm">${
                                        items.map(
                                          (item) => item.taskInstructionName
                                        )[0]
                                      }</div></div>`,
                      serviceFrequency: items.map(
                        (item) => item.serviceFrequencyCode
                      ),
                      status: items.map((item) =>
                        item.isBlocked
                          ? 'blockBtn'
                          : item.isCancelled
                          ? 'cancelledBtn'
                          : item.isDropped
                          ? 'droppedBtn'
                          : item.isIssued
                          ? 'issuedBtn'
                          : item.isOmit
                          ? 'omitBtn'
                          : ''
                      ),
                      currentStatus: this.getStatusText(currentStatus.toString()),
                      categoryName: items.map((item) => item.categoryName)[0],
                      yearWeek: items.map((item) => item.yearWeek)
                    };
                  })
                );
              }),
              toArray()
            )
            .subscribe((res) => {
              gridData.data = res;
            });
          this.isCollapsed = true;
          this.gridData = gridData;
          let months = result.months;
          let lastWeek = 0;
          months.forEach((month: any) => {
            if (month.weeks.includes(lastWeek)) {
              month.weeks = month.weeks.filter((w: any) => w !== lastWeek);
            }
            lastWeek = month.weeks[month.weeks.length - 1];
          });
          this.months = months;
          this.weeks = this.months
            .map((month: any) =>
              month.weeks.map(
                (w: any) => new Date(month.monthValue).getFullYear() + '-' + w
              )
            )
            .flat(1);
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Asset !!', {
            id: 'alert-planner'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  projectChanged(project: any): void {
    this.buildings = this.masterData.buildings.filter(
      (building: any) => building.projectId === parseInt(project.value)
    );
  }

  onSelectionChange(item: any, index: number) {
    if (this.selectedAssets.includes(item.schedulerId)) {
      this.selectedAssets = this.selectedAssets.filter(
        (asset: any) => asset != item.schedulerId
      );
    } else {
      this.selectedAssets.push(item.schedulerId);
    }
    let selectedAssets = this.gridData.data.filter((item: any) =>
      this.selectedAssets.includes(item.schedulerId)
    );
    let issuedExists = selectedAssets.some(
      (item: any) =>
        item.status.includes('issuedBtn') ||
        item.status.includes('omitBtn') ||
        item.status.includes('droppedBtn')
    );
    let blockedButton = this.buttons.find((b: any) => b.id === 'Block');
    if (issuedExists && blockedButton) {
      blockedButton.isDisabled = true;
    } else if (blockedButton) {
      blockedButton.isDisabled = false;
    }
    let blockedExists = selectedAssets.some((item: any) =>
      item.status.includes('blockBtn')
    );
    let unblockedButton = this.buttons.find((b: any) => b.id === 'Unblock');
    if (blockedExists && unblockedButton) {
      unblockedButton.isDisabled = false;
    } else if (unblockedButton) {
      unblockedButton.isDisabled = true;
    }
  }

  buttonClicked(buttonType: any): void {
    if (buttonType == 'Build') {
      this.filterGrid.setFilter();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.PPM_PLANNER_GRID]);
    } else if (buttonType == 'Block') {
      this.updateStatus(PlannedActionType.Block);
    } else if (buttonType == 'Unblock') {
      this.updateStatus(PlannedActionType.Unblock);
    } else if (buttonType == 'Issued') {
      this.updateStatus(PlannedActionType.Issue);
    } else if (buttonType == 'Omit') {
      this.updateStatus(PlannedActionType.Omit);
    } else if (buttonType == 'OmitByFreq') {
      this.updateStatus(PlannedActionType.OmitByFrequency);
    } else if (buttonType == 'Drop') {
      this.updateStatus(PlannedActionType.Dropped);
    }
  }

  updateStatus(status: PlannedActionType): void {
    if (this.selectedAssets.length > 0) {
      let updateData = {
        selectedItemIds: this.selectedAssets.join(),
        actionId: status
      };
      this.apiService
        .UpdatePPMStatus('Planner/UpdatePpmStatus', updateData)
        .subscribe({
          next: (result) => {
            if (result) {
              this.selectedAssets = [];
              this.alertService
                .success('Planner Updated Successfully', {
                  id: 'alert-planner'
                })
                .then(() => this.filterGrid.setFilter());
            }
          },
          error: (e) => {
            this.alertService.error('Error Retrieving Asset !!', {
              id: 'alert-planner'
            });
            console.error(e);
          },
          complete: () => {}
        });
    } else {
      this.alertService.error('Please select any checkbox!!', {
        id: 'alert-planner'
      });
    }
  }
}
