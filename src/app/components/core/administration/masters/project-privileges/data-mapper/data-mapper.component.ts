import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common/common-popup/common-popup.component';
import { ProjectPrivileges } from 'src/app/models/enums/ProjectPrivileges.enum';

@Component({
  selector: 'app-data-mapper',
  templateUrl: './data-mapper.component.html',
  styleUrls: ['./data-mapper.component.scss']
})
export class DataMapperComponent extends CommonPopupComponent {
  customContextComponents: any = [];
  ProjectPrivileges = ProjectPrivileges;

  mappingData: any;
  mapperTitle: string = '';
  mapperForm!: FormGroup;
  searchText: string = '';
  buildings: any[] = [];

  isCustomContext: boolean = false;
  contextType: number = 0;
  selectedPriority: any;

  constructor(
    dialogRef: MatDialogRef<DataMapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    super(dialogRef);
    this.mapperTitle = data.item?.typeName;
    let type = data.item?.mappingObject;
    this.mappingData = data.data[type.replace(/\s/g, '')];
    this.contextType = data.item?.typeId;
    this.masterData = data.data;
    this.mapperForm = fb.group({
      privilage: ['', Validators.required]
    });
    this.mapperForm.valueChanges.subscribe(() => {
      let isFormValid = this.mapperForm.valid;
    });
  }

  getMasterData(data: any): any {
    if (this.contextType === ProjectPrivileges.RESOURCES) {
      return data;
    }
    return null;
  }

  hasCustomContext(): boolean {
    this.isCustomContext = this.customContextComponents.includes(
      this.contextType
    );
    return this.isCustomContext;
  }

  buildingSelected(buildings: any): void {
    this.mapperForm.controls['privilage'].patchValue(buildings);
  }

  save(): void {
    let data = this.mapperForm.value;
    this.dialogRef.close(data);
  }

  priorityChanged(priority: any): void {
    this.selectedPriority = this.mappingData.find(
      (m: any) => m.id === parseInt(priority.value)
    );
    let priorityForm = this.mapperForm.value;
    if (this.selectedPriority) {
      priorityForm.assignTime = this.selectedPriority.assignTimeInMin;
      priorityForm.responseTime = this.selectedPriority.responseTimeInMin;
      priorityForm.completionTime = this.selectedPriority.completionTimeInMin;
    }
    this.mapperForm.patchValue(priorityForm);
  }
}
