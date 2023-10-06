import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common/common-popup/common-popup.component';
import { InputType } from 'src/app/models/enums/InputType.enum';
import { IFormField } from 'src/app/models/interfaces/IFormField';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent extends CommonPopupComponent implements OnInit {
  assetForm: any;
  formFieldBuilder: IFormField[] = [];
  formData: any;
  InputType = InputType;

  constructor(
    dialogRef: MatDialogRef<AddAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dialogRef);
    this.formData = data;
  }

  ngOnInit() {
    this.assetForm = new FormGroup(this.formData.formGroup);
    switch (this.formData.assetTitle) {
      case "Shifts":
        if (!this.formData.asset && this.formData.formBuilder.find((x: any) => x.fieldName == 'colorCode')) {
          this.assetForm.get('colorCode').setValue('#2d6186');
        }
        break;
    }
    this.formFieldBuilder = this.formData.formBuilder;
  }

  save(): void {
    if (this.assetForm.valid) {
      let formData = this.assetForm.value;
      if (!formData.id) {
        formData['id'] = this.data.asset?.id ?? 0;
      }
      this.dialogRef.close(formData);
    }
  }

  onSeletionChange(obj: any, fieldName: string | undefined): void {
    if (fieldName) {
      this.assetForm.get(fieldName).setValue(obj.value);
    }
  }

  onColorChange(value: any, fieldName: string | undefined): void {
    if (fieldName) {
      this.assetForm.get(fieldName).setValue(value);
    }
  }
}
