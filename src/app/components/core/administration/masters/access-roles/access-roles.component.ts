import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import buttons from '../../../../../helpers/buttons.json';
import { SweetAlertService } from './../../../../../services/sweet-alert.service';

@Component({
  selector: 'app-access-roles',
  templateUrl: './access-roles.component.html',
  styleUrls: ['./access-roles.component.scss']
})
export class AccessRolesComponent extends CommonComponent {
  roleInfo!: FormGroup;
  roleAccessDetailsForm!: FormGroup;

  roleAccessDetails: any;
  roleData: any;
  roleAccesses: any[] = [];

  all: boolean = true;

  access: any = {
    canApprove: true,
    canCreate: true,
    canDelete: true,
    canDownload: true,
    canExport: true,
    canPrint: true,
    canUpdate: true,
    canUpload: true,
    fullAccess: true,
    viewOnly: true
  };

  @ViewChild('md_roles') md_rolesDD!: DropdownComponent;

  constructor(
    private fb: FormBuilder,
    private navService: NavigationService,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private router: Router
  ) {
    super();
    this.buttons = buttons.core.accessroles.create;
    let navState = this.navService.getNavigationState();
    this.getData({ id: navState.currentMasterId }, true);
  }

  getData(roleAccess: any, isDefault: boolean = false): void {
    this.apiService
      .GetMasterInfo('UserManagement/GetRoleAccessDetails', roleAccess.id)
      .subscribe({
        next: (result) => {
          this.roleAccessDetails = result.roleAccessDetails;
          this.validatePermissions(result.roleAccessDetails);
          if (isDefault) {
            this.masterData['roles'] = result.roles;
            this.masterData['roleAccess'] = result.roleAccess;
            if ((roleAccess.id) > 0) {
              this.roleData = {
                role: this.masterData.roleAccess.find(
                  (access: any) => access.id === (roleAccess.id)
                )?.roleId,
                roleAccess: (roleAccess.id)
              };
              this.rolesSelected({ id: this.roleData?.role });
            }
            this.roleInfo = this.fb.group({
              role: [this.roleData?.role, Validators.required],
              roleAccess: [this.roleData?.roleAccess, Validators.required]
            });
            this.isDataLoaded = true;
          }
        },
        error: (e) => {
          this.alertService.error('Error retreving access role details !!', {
            id: 'alert-accessroles'
          },e);
          console.error(e);
        },
        complete: () => {}
      });
  }

  validatePermissions(roleAccessDetails: any) {
    if (roleAccessDetails) {
      Object.keys(this.access).forEach((access) => {
        let pem = this.access[access] || true;
        for (let i = 0; i < this.roleAccessDetails.length; i++) {
          pem = pem && this.roleAccessDetails[i][access];
        }
        this.access[access] = pem;
      });
    }
  }

  buttonClicked(buttonType: any) {
    if (buttonType == 'Save') {
      this.save();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.VIEW_ACCESS_ROLES]);
    }
  }

  updateRoleAccess(index: number, access: string) {
    if (access === 'fullAccess') {
      let currentAccess = this.roleAccessDetails[index][access];
      Object.keys(this.access).forEach((acs) => {
        this.roleAccessDetails[index][acs] = !currentAccess;
      });
    } else {
      this.roleAccessDetails[index][access] =
        !this.roleAccessDetails[index][access];
      this.roleAccessDetails[index]['fullAccess'] =
        this.roleAccessDetails[index]['canApprove'] &&
        this.roleAccessDetails[index]['canCreate'] &&
        this.roleAccessDetails[index]['canDelete'] &&
        this.roleAccessDetails[index]['canDownload'] &&
        this.roleAccessDetails[index]['canExport'] &&
        this.roleAccessDetails[index]['canPrint'] &&
        this.roleAccessDetails[index]['canUpdate'] &&
        this.roleAccessDetails[index]['canUpload'] &&
        this.roleAccessDetails[index]['viewOnly'];
    }
    this.validatePermissions(this.roleAccessDetails);
  }

  selectAll(access: any, event: any) {
    if (access === 'fullAccess') {
      Object.keys(this.access).forEach((acs) => {
        this.roleAccessDetails.forEach((roleAccess: any) => {
          roleAccess[acs] = event.target.checked;
        });
      });
    } else {
      this.roleAccessDetails.forEach((roleAccess: any) => {
        roleAccess[access] = event.target.checked;
      });
    }
    this.validatePermissions(this.roleAccessDetails);
  }

  rolesSelected(selectedRole: any) {
    this.roleAccesses = this.masterData?.roleAccess?.filter(
      (role: any) => role.roleId === (selectedRole.id)
    );
    this.md_rolesDD?.setToDefault();
  }

  override save(): void {
    let role = this.roleInfo.value;
    this.roleAccessDetails.map((pm: any) => {
      pm.roleAccessId = role.roleAccess;
    });
    let roleAccess = this.roleAccessDetails.filter(
      (pm: any) =>
        pm['canApprove'] ||
        pm['canCreate'] ||
        pm['canDelete'] ||
        pm['canDownload'] ||
        pm['canExport'] ||
        pm[' canPrint'] ||
        pm['canUpdate'] ||
        pm['canUpload'] ||
        pm['viewOnly']
    );
    this.apiService
      .AddOrUpdateMaster('UserManagement/AddOrUpdateRoleMenuAccess', roleAccess)
      .subscribe({
        next: (result) => {
          this.alertService.success('Role saved successfully  !!', {
            id: 'alert-accessroles'
          });
        },
        error: (err) => {
          this.alertService.error('Error saving Role Access !!', {
            id: 'alert-accessroles'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }
}
