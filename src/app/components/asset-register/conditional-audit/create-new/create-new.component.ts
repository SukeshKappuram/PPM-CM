import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import buttons from '../../../../helpers/buttons.json';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})
export class CreateNewComponent extends CommonComponent {
  @ViewChild('buildng') buildingsDD!: DropdownComponent;
  @ViewChild('unitSpace') unitOrSpaceDD!: DropdownComponent;
  @ViewChild('assetId') assetIdDD!: DropdownComponent;
  @ViewChild('assetName') assetNameDD!: DropdownComponent;
  caId: number = 0;
  createdBy: string = '';
  auditDate: Date = new Date();
  assetIdSelected: any = '';
  auditStatus: any[] = [
    { id: 0, name: 'Inactive' },
    { id: 1, name: 'Active' }
  ];
  cAudit: any = {};
  caForm!: FormGroup;
  cAuditForm!: FormGroup;
  caDetailsForm!: FormGroup;
  buildings: any[] = [];
  unitOrSpaces: any[] = [];
  selectedBuildingId: any = 0;
  resources: any[] = [];
  cAuditDetailsList: any[] = [];
  assets: any[] = [];
  activePage: string = 'Create';

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private navService: NavigationService,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private router: Router,
    public datepipe: LocalizedDatePipe
  ) {
    super();
    this.isEditable = false;
    let navState = this.navService.getNavigationState();
    this.caId = navState.currentAuditId ?? 0;
    this.userAccess = this.convertToUserAccess(navState.subMenu);
    this.apiService
      .GetMasterData(
        `ConditionalAudit/GetConditionalAuditDataById?auditId=${navState.currentAuditId}`
      )
      .subscribe({
        next: (result) => {
          this.masterData = result;
          this.masterData['status'] = this.auditStatus;
          this.cAudit = result.conditionalAudit ?? {};
          this.isEditable = this.caId === 0;
          this.activePage =
            this.caId == 0 ? 'Create' : 'CA:' + this.pad(this.caId, 3);
          this.cAudit['auditDate'] =
            this.cAudit?.conditionalDate ?? this.auditDate;
          this.cAuditDetailsList = this.cAudit?.auditDetails;
          if (
            this.cAuditDetailsList == undefined ||
            this.cAuditDetailsList == null
          ) {
            this.cAuditDetailsList = [];
          }
          let user = this.auth.getUser();
          this.createdBy = user?.userName;
          this.caForm = this.fb.group({
            cAId: [this.caId],
            auditStatus: [
              this.cAudit?.auditStatus ? 1 : 0,
              Validators.required
            ],
            auditDate: [this.cAudit?.auditDate ?? this.auditDate],
            createdBy: [this.cAudit?.createdBy ?? this.createdBy]
          });
          this.cAuditForm = this.fb.group({
            project: [this.cAudit?.projectId, Validators.required],
            building: [this.cAudit?.buildingId, Validators.required],
            assetId: [this.cAudit?.assetId, Validators.required],
            assetName: [this.cAudit?.assetId],
            unitOrSpace: [this.cAudit?.unitId]
          });
          this.caDetailsForm = this.fb.group({
            caDetails: this.fb.array([])
          });
          this.caForm.valueChanges.subscribe((changes) => {
            let savebutton = this.buttons.find((b: any) => b.id === 'Save');
            if (savebutton) {
              savebutton.isDisabled = !this.cAuditForm?.valid;
            }
          });
          this.cAuditForm.valueChanges.subscribe((changes) => {
            let savebutton = this.buttons.find((b: any) => b.id === 'Save');
            if (savebutton) {
              savebutton.isDisabled = !this.cAuditForm?.valid;
            }
          });
          this.siteSelected({ id: this.cAudit?.projectId });
          this.cAudit?.auditDetails?.forEach((details: any) => {
            let ad = {
              id: details.id,
              condAuditId: this.caId,
              auditDate: details.auditDate,
              categoryId: details.categoryId,
              remarks: details.remarks,
              exactLocations: details.exactLocations,
              beforeFile: details.beforeFile,
              afterFile: details.afterFile,
              beforeImageUrl: details.beforeImageUrl,
              afterImageUrl: details.afterImageUrl,
              actionBy: details.resourceId,
              actionTaken: details.actionTaken,
              status: details.status
            };
            this.addCaDetails(ad);
          });
          this.buttons = buttons.assetRegister.conditionalAudit.create;
          if ((this.caId === 0 && !this.userAccess.canAdd) || (this.caId > 0 && !this.userAccess.canUpdate)) {
            this.buttons = this.buttons.filter((btn: any)=> btn.id !== 'Save');
          }
          this.updateButtons();
          this.isDataLoaded = true;
        },
        error: (e) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-conditionalAudit'
          },e);
          console.error(e);
        },
        complete: () => {}
      });
  }

  get caDetails() {
    return this.caDetailsForm?.controls['caDetails'] as FormArray;
  }

  cAuditDetails(form: any): FormGroup {
    return form;
  }

  addCaDetails(caDetails?: any) {
    if (!caDetails) {
      this.cAuditDetailsList.push({});
    }
    const caDetailsForm = this.fb.group({
      id: [caDetails?.id ?? 0],
      condAuditId: [this.caId],
      auditDate: [caDetails?.auditDate ?? ''],
      categoryId: [caDetails?.categoryId],
      remarks: [caDetails?.remarks ?? ''],
      exactLocations: [caDetails?.exactLocations ?? ''],
      beforeFile: [caDetails?.beforeFile ?? ''],
      afterFile: [caDetails?.afterFile ?? ''],
      beforeImageUrl: [caDetails?.beforeImageUrl ?? ''],
      afterImageUrl: [caDetails?.afterImageUrl ?? ''],
      actionBy: [caDetails?.actionBy],
      actionTaken: [caDetails?.actionTaken ?? ''],
      status: [caDetails?.status ?? 1]
    });
    this.caDetails.push(caDetailsForm);
  }

  deleteCaDetails(caDetailsIdx: number, details: any) {
    if (details.value.id > 0) {
      this.apiService
        .DeleteAudit(
          'ConditionalAudit/DeleteConditionalAuditDetails?id=' +
            details.value.id
        )
        .subscribe({
          next: (result) => {
            if (result.isSuccess) {
              this.caDetails.removeAt(caDetailsIdx);
              this.alertService.success(result.message + '!!', {
                id: 'alert-assetsList'
              });
            } else {
              // this.alertService.warn(result.message + '!!', {
              //   id: 'alert-assetsList'
              // });
              this.alertService.warn('Deleted audit successfully !!', {
                id: 'alert-assetsList'
              });
            }
          },
          error: (e) => {
            this.alertService.error('Error deleting audit !!', {
              id: 'alert-assetsList'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    } else {
      this.caDetails.removeAt(caDetailsIdx);
    }
  }

  siteSelected(selectedId: any): void {
    this.buildings = this.masterData?.buildings.filter(
      (building: any) => building.projectId == selectedId.id
    );
    this.resources = this.masterData?.resources
      .filter((resource: any) => resource.projectId == selectedId.id)
      .filter(
        (resource: any, i: number, arr: any) =>
          arr.findIndex((t: any) => t.id === resource.id) === i
      );
    this.buildingsDD?.setToDefault();
    this.unitOrSpaceDD?.setToDefault();
    this.buildingSelected({ id: this.cAudit?.buildingId });
  }

  buildingSelected(selectedId: any): void {
    this.selectedBuildingId = selectedId.id;
    this.unitOrSpaces = this.masterData?.units.filter(
      (us: any) => us.buildingId == this.selectedBuildingId
    );
    this.assets = this.masterData?.assets.filter(
      (a: any) => a.buildingId == this.selectedBuildingId
    );
    this.unitOrSpaceDD?.setToDefault();
    this.assetIdSelected = '';
    this.assetIdDD?.setToDefault();
    this.assetNameDD?.setToDefault();
  }

  unitOrSpaceSelected(selectedId: any): void {
    if (selectedId && selectedId.id) {
      this.assets = this.masterData?.assets.filter(
        (a: any) =>
          a.unitId == selectedId.id && a.buildingId == this.selectedBuildingId
      );
    }
    this.assetIdSelected = '';
    this.assetIdDD?.setToDefault();
    this.assetNameDD?.setToDefault();
  }

  assetSelected(selectedId: any): void {
    this.assetIdSelected = this.masterData?.assets.find(
      (asset: any) => asset.assetId === selectedId.assetId
    ).assetId;
    this.cAuditForm.controls['assetId'].setValue(this.assetIdSelected);
    this.cAuditForm.controls['assetName'].setValue(this.assetIdSelected);
  }

  buttonClicked(buttonType: any): void {
    if (buttonType == 'Save') {
      this.saveOrEdit();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.VIEW_CA_GRID]);
    }
  }

  override save(): void {
    if (this.caForm.valid) {
      let caForm = this.caForm.value;
      let cAuditForm = this.cAuditForm.value;
      let caData = {
        id: this.caId,
        conditionalDate: this.datepipe.transform(
          caForm.auditDate,
          'dd-MMM-yyyy',
          true
        ),
        auditStatus: caForm.auditStatus,
        createdBy: this.createdBy,
        projectId: cAuditForm.project?.id,
        buildingId: cAuditForm.building?.id,
        unitId: cAuditForm.unitOrSpace?.id,
        assetId: cAuditForm.assetId,
        assetNo: cAuditForm.assetId,
        assetName: this.masterData?.assets.find(
          (asset: any) => asset.assetId == cAuditForm.assetId
        ).assetName,
        isActive: true,
        auditDetails: ''
      };
      this.apiService
        .SaveAsset('ConditionalAudit/SaveConditionalAudit', caData)
        .subscribe({
          next: (result) => {
            if (result > 0) {
              this.caId = result;
              this.alertService.success('Audit Updated Successfully!!', {
                id: 'alert-conditionalAudit'
              });
            } else {
              this.alertService.error('Could not update audit details!!', {
                id: 'alert-conditionalAudit'
              });
            }
          },
          error: (e) => {
            this.alertService.error('Error updating audit details!!', {
              id: 'alert-conditionalAudit'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  updateAsCompleted(index: number, details: any): void {
    if (details.value.id > 0) {
      this.updateAuditStatus(details, 2, index);
    } else {
      details.controls['status'].patchValue(2);
    }
  }

  updateAuditStatus(details: any, status: number, index: number): void {
    this.apiService
      .UpdateAuditStatus(
        `ConditionalAudit/UpdateConditionalAuditDetailsStatus?id=${details.value.id}&status=${status}`
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.cAuditDetailsList[index].status = 2;
            this.cAuditDetails(details).value.status = 2;
            details.controls['status'].patchValue(2);
            this.alertService.success('Audit Updated Successfully!!', {
              id: 'alert-conditionalAudit'
            });
          } else {
            this.alertService.error('Could not update audit details!!', {
              id: 'alert-conditionalAudit'
            });
          }
        },
        error: (e) => {
          this.alertService.error('Error updating audit details!!', {
            id: 'alert-conditionalAudit'
          },e);
          console.error(e);
        },
        complete: () => {}
      });
  }

  onChange(event: any, fileType: any, details: any, index: number): void {
    details.controls[fileType].patchValue(event.addedFiles[0]);
    const reader = new FileReader();
    reader.readAsDataURL(event.addedFiles[0]);
    reader.onload = () => {
      this.cAuditDetailsList[index][
        fileType === 'beforeFile' ? 'beforeImageUrl' : 'afterImageUrl'
      ] = reader.result?.toString();
    };
  }

  saveDetails(idx: number, detailsForm: any): void {
    detailsForm = detailsForm as FormGroup;
    if (detailsForm.valid) {
      let caDetailsForm = detailsForm.value;
      let caDetails = {
        id: caDetailsForm.id,
        condAuditId: this.caId,
        auditDate: this.datepipe.transform(
          caDetailsForm.auditDate,
          'dd-MMM-yyyy',
          true
        ),
        categoryId: caDetailsForm.categoryId?.id ?? caDetailsForm.categoryId,
        remarks: caDetailsForm.remarks,
        exactLocations: caDetailsForm.exactLocations,
        beforeFile: caDetailsForm.beforeFile,
        afterFile: caDetailsForm.afterFile,
        beforeImageUrl: caDetailsForm.beforeImageUrl,
        afterImageUrl: caDetailsForm.afterImageUrl,
        actionBy: caDetailsForm.actionBy?.id ?? caDetailsForm.actionBy,
        actionTaken: caDetailsForm.actionTaken,
        status: caDetailsForm.status
      };
      this.cAuditDetailsList.push(caDetails);
      this.apiService
        .SaveAuditDetails(
          'ConditionalAudit/SaveConditionalAuditDetails',
          caDetails
        )
        .subscribe({
          next: (result) => {
            if (result > 0) {
              let currentForm = this.caDetails.at(idx) as FormGroup;
              currentForm.controls['id'].patchValue(result);
              this.alertService
                .success('Audit Updated Successfully!!', {
                  id: 'alert-conditionalAudit'
                })
                .then(() => {});
            } else {
              this.alertService.error('Could not update audit details!!', {
                id: 'alert-conditionalAudit'
              });
            }
          },
          error: (e) => {
            this.alertService.error('Error updating audit details!!', {
              id: 'alert-conditionalAudit'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    }
  }
}
