import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Popups } from 'src/app/models/enums/Popups.enum';
import { ServiceType } from 'src/app/models/enums/ServiceType.enum';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss']
})
export class CommonPopupComponent {
  protected dialogRef:any;
  protected Popups = Popups;
  protected ServiceType = ServiceType;
  protected PasswordView: any = {
    password : 'password',
    newPassword : 'password',
    confirmPassword : 'password'
  };
  masterData: any;
  filteredData: any;
  constructor(private dialog:MatDialogRef<CommonPopupComponent>) {
    this.dialogRef = this.dialog;
    this.dialogRef?.keydownEvents().subscribe((event:any) => {
      if (event.key === "Escape") {
        this.dialogRef?.close();
      }
    });
  }

  handleFilter(value: any, type: any, key: string = 'name'): void {
    this.filteredData[type] = this.masterData[type].filter(
      (s: any) => s[key]?.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  protected togglePassword(key: string): void {
    this.PasswordView[key] = this.PasswordView[key] === 'password' ? 'text' : 'password';
  }
}
