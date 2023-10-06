import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common/common-popup/common-popup.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent extends CommonPopupComponent {

  constructor(dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      super(dialogRef);
     }
    
  close() {
    this.dialogRef.close();
  }

}
