import { ApiService } from 'src/app/services/api.service';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Component } from '@angular/core';
import { FormatHelper } from './../../../helpers/FormatHelper';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-conditional-audit',
  templateUrl: './conditional-audit.component.html',
  styleUrls: ['./conditional-audit.component.scss']
})
export class ConditionalAuditComponent extends CommonComponent{
  Navigate = Navigate;

  constructor(
    private apiService: ApiService,
    private navService: NavigationService,
    private alertService: SweetAlertService,
    private router: Router,
    public datepipe: LocalizedDatePipe
  ) {
    super();
    this.isEditable = false;
    this.getAudits();
    this.navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState.subMenu);
  }

  getAudits(): void {
    this.apiService
      .GetAllConditionalAudits('ConditionalAudit/GetAllConditionalAudits')
      .subscribe({
        next: (result) => {
          result.data?.forEach((element: any) => {
            element.id = 'CA:' + FormatHelper.pad(element.id, 3);
            element.conditionalDate = this.datepipe.transform(
              new Date(element.conditionalDate)
            );
            element.auditStatus = element.auditStatus ? 'Active' : 'Inactive';
          });
          this.gridData = result;
          this.gridData.actions = this.mapUserAccess(this.gridData.actions, this.userAccess);
        },
        error: (e) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-conditionalAudit'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  modifyAudit(item: any): void {
    let navState = this.navService.getNavigationState();
    navState.currentAuditId = item
      ? item.id?.replace('CA:', '').replace(/^0+/, '')
      : undefined;
    navState.editUrl = 'ConditionalAudit/GetConditionalAuditDataById';
    this.navService.setNavigationState(navState);
    this.router.navigate([Navigate.EDIT_AUDIT]);
  }

  deleteAudit(item: any): void {}

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
