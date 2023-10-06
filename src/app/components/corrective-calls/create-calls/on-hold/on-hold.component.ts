import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common/common-popup/common-popup.component';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { LocalizedDatePipe } from './../../../../pipes/localized-date.pipe';

@Component({
  selector: 'app-on-hold',
  templateUrl: './on-hold.component.html',
  styleUrls: ['./on-hold.component.scss']
})
export class OnHoldComponent extends CommonPopupComponent {
  reasonForm: FormGroup;
  reasonDate = this.localizedDatePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm', true);
  constructor(dialogRef: MatDialogRef<OnHoldComponent>, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private localizedDatePipe: LocalizedDatePipe, private apiService: ApiService, private alertService: SweetAlertService, private navService: NavigationService) {
    super(dialogRef);
    this.masterData = data;
    this.filteredData = {...this.masterData};
    this.reasonForm = fb.group({
      reason: [, Validators.required],
      reasonDate: [this.reasonDate, Validators.required],
      comments: []
    });
  }

  submitReason() {
    let formData = this.reasonForm.value;
    let navState = this.navService.getNavigationState();
    let reason = {};
    if(this.masterData.contentId === 1){
      reason = {
        taskLogId: navState.currentLogId,
        onHoldReasonId: formData.reason?.id,
        comments: formData.comments
      };
    } else if(this.masterData.contentId === 2 || this.masterData.contentId === 3){
      reason = {
        taskLogId: navState.currentLogId,
        comments: formData.comments
      };
    }
    this.dialogRef.close(reason);
  }

  public defaultItem(text : string): any{
    return {
      code: "Select",
      name: text,
    };
  }
}
