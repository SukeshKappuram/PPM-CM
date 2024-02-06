import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common/common-popup/common-popup.component';
import { IGridData } from 'src/app/models/interfaces/IGridData';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { WorkStatus } from '../../../../models/enums/WorkStatus.enum';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent extends CommonPopupComponent {
  gridData: IGridData = {
    configuration: {
      columns: [],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: true,
      canEdit: true,
      canDelete: true
    },
    data: []
  };
  selectedResource: any = 0;
  selectedHseq: number = 0;
  selectedCheckList: number = 0;
  selectedLoc: number = 0;
  loadAllResources: boolean = false;
  loadAllResourcesByDefault: boolean = false;
  defaultResources: any[] = [];
  query: string = '';
  assetDetailsForm!: FormGroup;
  inputData: any;
  isBuildingSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private datePipe: LocalizedDatePipe
  ) {
    super(dialogRef);
    this.inputData = data.data;
    if (data.contentName === 'Resources') {
      this.gridData = this.inputData?.resources ?? this.gridData;
      this.defaultResources = this.inputData?.resources?.data;
      this.loadAllResourcesByDefault = this.inputData?.loadAllResources;
      if (this.loadAllResourcesByDefault) {
        this.gridData.configuration.columns = [
          {
            displayText: 'Resource Id',
            showSort: true,
            mappingColumn: 'id',
            showColumn: false,
            editConfig: {
              fieldType: '',
              mappingData: '',
              showField: false,
              isReadOnly: false
            },
            columnFormat: 0
          },
          {
            displayText: 'Resource Code',
            showSort: true,
            mappingColumn: 'code',
            showColumn: true,
            editConfig: {
              fieldType: '',
              mappingData: '',
              showField: false,
              isReadOnly: false
            },
            columnFormat: 0
          },
          {
            displayText: 'Name',
            showSort: true,
            mappingColumn: 'name',
            showColumn: true,
            editConfig: {
              fieldType: '',
              mappingData: '',
              showField: false,
              isReadOnly: false
            },
            columnFormat: 0
          },
          {
            displayText: 'Mobile',
            showSort: true,
            mappingColumn: 'mobileNo',
            showColumn: false,
            editConfig: {
              fieldType: '',
              mappingData: '',
              showField: false,
              isReadOnly: false
            },
            columnFormat: 0
          },
          {
            displayText: 'Email',
            showSort: false,
            mappingColumn: 'email',
            showColumn: true,
            editConfig: {
              fieldType: '',
              mappingData: '',
              showField: false,
              isReadOnly: false
            },
            columnFormat: 0
          }
        ];
        this.getAllResources(true);
      }
    } else if (data.contentName === 'Assets') {
      this.isBuildingSelected = this.inputData['isBuildingSelected'];
      this.assetDetailsForm = fb.group({
        building: [this.inputData.selectedBuilding]
      });
      this.gridData.data = this.inputData.assets;
      this.gridData.configuration.columns = [
        {
          displayText: 'Asset Code',
          showSort: true,
          mappingColumn: 'code',
          showColumn: true,
          editConfig: {
            fieldType: '',
            mappingData: '',
            showField: false,
            isReadOnly: false
          },
          columnFormat: 0
        },
        {
          displayText: 'Asset Name',
          showSort: true,
          mappingColumn: 'name',
          showColumn: true,
          editConfig: {
            fieldType: '',
            mappingData: '',
            showField: false,
            isReadOnly: false
          },
          columnFormat: 0
        },
        {
          displayText: 'System Name',
          showSort: true,
          mappingColumn: 'systemName',
          showColumn: true,
          editConfig: {
            fieldType: '',
            mappingData: '',
            showField: false,
            isReadOnly: false
          },
          columnFormat: 0
        }
      ];
    } else if (data.contentName === 'TaskInstructions') {
      this.gridData.configuration.columns = [
        {
          displayText: 'Code',
          showSort: true,
          mappingColumn: 'id',
          showColumn: true,
          editConfig: {
            fieldType: '',
            mappingData: '',
            showField: false,
            isReadOnly: false
          },
          columnFormat: 0
        },
        {
          displayText: 'Name',
          showSort: true,
          mappingColumn: 'name',
          showColumn: true,
          editConfig: {
            fieldType: '',
            mappingData: '',
            showField: false,
            isReadOnly: false
          },
          columnFormat: 0
        },
        {
          displayText: 'Category Name',
          showSort: true,
          mappingColumn: 'categoryName',
          showColumn: true,
          editConfig: {
            fieldType: '',
            mappingData: '',
            showField: false,
            isReadOnly: false
          },
          columnFormat: 0
        }
      ];
      this.gridData.data = this.inputData.taskInstructions;
    } else {
      this.masterData = {};
      this.masterData['locs'] = this.inputData.resources;
      this.filteredData = { ...this.masterData };
    }
  }

  // common

  select(option: any): void {
    if (this.data.contentName === 'Assets') {
      this.assetSelected(option.id);
    } else if (this.data.contentName === 'TaskInstructions') {
      this.instructionSelected(option.id);
    }
  }

  // common ends

  // Resources Start

  addResource(resource: any): void {
    this.selectedResource = resource.id;
  }

  AssignResource(): void {
    let resources = {
      taskLogId: this.data?.data?.taskLogId,
      resourceId: this.selectedResource,
      actionId: WorkStatus.ASSIGNED,
      actionDate: this.datePipe.transform('new', 'dd-MMM-yyyy HH:mm', true)
    };
    if (this.loadAllResourcesByDefault) {
      this.dialogRef.close({ resourceIds: this.selectedResource });
    } else {
      this.apiService
        .AddOrUpdateSubTaskData(
          'TaskLogOperations/SaveTaskLogResourceInfo',
          resources,
          this.data?.api
        )
        .subscribe({
          next: (result) => {
            this.alertService
              .success('Resources Saved Successfully !!', {
                id: 'subTask-added'
              })
              .then(() => this.dialogRef.close(result));
          },
          error: (e) => {
            this.alertService.error('Error Updating Resources', {
              id: 'subTask-added'
            },e);
          },
          complete: () => {}
        });
    }
  }

  getAllResources(loadAllResources: boolean) {
    if (loadAllResources) {
      this.apiService
        .GetTaskLog(
          `TaskLog/GetAllResources/${this.data?.projectId}`,
          this.data?.api
        )
        .subscribe({
          next: (result) => {
            this.gridData.data = this.loadAllResourcesByDefault
              ? result
              : result.filter((m: any) =>
                  this.data.data.existingResources?.every(
                    (r: any) => r.resourceId !== m.id
                  )
                );
          },
          error: (e) => {
            this.alertService.error('Error retreving resource !!', {
              id: 'alert-resource'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    } else {
      this.gridData.data = this.defaultResources ?? [];
    }
  }

  // ResourcesEnd

  // Close WorkOrders Start

  setLoc(loc: any) {
    this.selectedLoc = loc.id;
  }

  closeWorkOrders() {
    if (
      this.selectedHseq > 0 &&
      this.selectedLoc > 0 &&
      (this.data.serviceType !== this.ServiceType.PM ||
        (this.data.serviceType === this.ServiceType.PM &&
          this.selectedCheckList > 0))
    )
      this.dialogRef.close({
        hseq: this.selectedHseq,
        checklist: this.selectedCheckList,
        loc: this.selectedLoc
      });
  }

  // Close WorkOrders End

  // Assets Start

  getAssetData(building: any) {
    this.apiService.GetAssetForScheduler('', building.value).subscribe({
      next: (result) => {
        this.inputData['assets'] = result.assets;
        this.inputData['projects'] = result.projects;
        this.gridData.configuration.columns = [
          {
            displayText: 'Asset Code',
            showSort: true,
            mappingColumn: 'code',
            showColumn: false,
            editConfig: {
              fieldType: '',
              mappingData: '',
              showField: false,
              isReadOnly: false
            },
            columnFormat: 0
          },
          {
            displayText: 'Asset Name',
            showSort: true,
            mappingColumn: 'name',
            showColumn: true,
            editConfig: {
              fieldType: '',
              mappingData: '',
              showField: false,
              isReadOnly: false
            },
            columnFormat: 0
          },
          {
            displayText: 'System Name',
            showSort: true,
            mappingColumn: 'systemName',
            showColumn: false,
            editConfig: {
              fieldType: '',
              mappingData: '',
              showField: false,
              isReadOnly: false
            },
            columnFormat: 0
          }
        ];
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {}
    });
  }

  assetSelected(assetId: any): void {
    this.inputData.assets.forEach((asset: any) => {
      asset['selected'] = false;
    });
    let asset = this.inputData.assets.find(
      (asset: any) => asset.id === assetId
    );
    if (asset) {
      this.inputData.assets.find(
        (asset: any) => asset.id === assetId
      ).selected = true;
      let assetDetails = this.assetDetailsForm.value;
      let res = {
        contentId: this.data.contentId,
        contentName: this.data.contentName,
        assets: this.inputData.assets,
        projects: this.inputData.projects,
        selectedBuilding: assetDetails.building,
        selectedAsset: asset
      };
      this.dialogRef.close(res);
    }
  }

  // Assets End

  // Instruction Start

  instructionSelected(instructionId: any): void {
    this.inputData.taskInstructions.forEach((instruction: any) => {
      instruction['selected'] = false;
    });
    let instruction = this.inputData.taskInstructions.find(
      (instruction: any) => instruction.id === instructionId
    );
    if (instruction) {
      this.inputData.taskInstructions.find(
        (instruction: any) => instruction.id === instructionId
      ).selected = true;
      let res = {
        contentId: this.data.contentId,
        contentName: this.data.contentName,
        selectedInstruction: instruction
      };
      this.dialogRef.close(res);
    }
  }

  searchLocation(): void{
    let  searchType = '';
    let searchText = '';
    this.apiService
        .getProjects(
          `Common/GetLocationDetailsBySearchText/${searchType}/${searchText}`
        )
        .subscribe({
          next: (result) => {

          },
          error: (e) => {
            this.alertService.error('Error Retreving Locations', {
              id: 'subTask-added'
            },e);
          },
          complete: () => {}
        });
  }

  // Instruction End
}
