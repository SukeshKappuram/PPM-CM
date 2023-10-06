import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common/common-popup/common-popup.component';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent
  extends CommonPopupComponent
  implements OnInit
{
  formData: any;
  changePasswordForm!: FormGroup;

  constructor(
    dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: SweetAlertService
  ) {
    super(dialogRef);
    this.formData = data;
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      let passwordInfo = this.changePasswordForm.value;
      let updatePassword = {
        oldPassword: passwordInfo?.oldPassword,
        newPassword: passwordInfo?.newPassword,
        confirmPassword: passwordInfo?.confirmPassword
      };
      this.authService
        .accountChangePassword('Account/ChangePassword', updatePassword)
        .subscribe({
          next: (result: any) => {
            if (result > 0) {
              this.alertService.success('Password changed').then(() => {
                this.changePasswordForm.reset();
                this.dialogRef.close();
              });
            } else if (result === -1) {
              this.alertService.error(
                'New Password and Confirm Password are not matching'
              );
            } else if (result === -2) {
              this.alertService.error('Old Password entered is incorrect');
            } else if (result === -3) {
              this.alertService.error('Old Password and New Password are same');
            }
          },
          error: (e) => {
            this.alertService.error('Error updating password');
            console.error(e);
          },
          complete: () => {}
        });
    } else {
      this.changePasswordForm.markAllAsTouched();
      this.alertService.error('Enter valid credentials');
    }
  }
}
