import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from 'src/app/services/navigation.service';
import { CommonPopupComponent } from '../../common/common-popup/common-popup.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent extends CommonPopupComponent {
  accounts: any[];
  constructor(
    dialogRef: MatDialogRef<AccountsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private navService: NavigationService
  ) {
    super(dialogRef);
    let navState = navService.getNavigationState();
    this.accounts = navState.accounts;
  }

  onAccountChange(account: any){
    this.dialogRef.close(account);
  }
}
