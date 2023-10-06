import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CommonPopupComponent } from '../../common/common-popup/common-popup.component';

@Component({
  selector: 'app-popup-hrms',
  templateUrl: './popup-hrms.component.html',
  styleUrls: ['./popup-hrms.component.css']
})
export class PopupHrmsComponent extends CommonPopupComponent {
  recepientsForm!: FormGroup
  constructor(dialogRef: MatDialogRef<PopupHrmsComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private alertService: SweetAlertService) { 
      super(dialogRef);
    }
}
