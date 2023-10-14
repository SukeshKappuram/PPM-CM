import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CommonComponent } from 'src/app/components/common/common.component';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { IProgressInfo } from 'src/app/models/interfaces/IProgressInfo';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { IGridData } from './../../../../models/interfaces/IGridData';
import { FinanceComponent } from './finance/finance.component';
import { GeneralComponent } from './general/general.component';
import { HeaderPanelComponent } from './header-panel/header-panel.component';
import { IdentificationComponent } from './identification/identification.component';
import { ParameterComponent } from './parameter/parameter.component';
import { SidePanelComponent } from './side-panel/side-panel.component';

@Component({
  selector: 'app-asset-new',
  templateUrl: './asset-new.component.html',
  styleUrls: ['./asset-new.component.scss']
})
export class AssetNewComponent extends CommonComponent {
  saveAt: string = '';
  isEdited: boolean = false;
  subSystemId: number = 0;
  currentTab: number = 0;
  documents: any[] = [];
  selectedFiles: FileList[] = [];
  progressInfos: IProgressInfo[] = [];
  fileInfos: Observable<any> = new Observable<any>();
  defaultAssetImage: string = '';
  defaultQrImage: string = '';

  @ViewChild('generalForm') generalForm!: GeneralComponent;
  @ViewChild('financialForm') financialForm!: FinanceComponent;
  @ViewChild('parameterForm') parameterForm!: ParameterComponent;
  @ViewChild('identificationForm') identificationForm!: IdentificationComponent;
  @ViewChild('header') assetHeader!: HeaderPanelComponent;
  @ViewChild('sidepanel', { static: false }) sidePanel!: SidePanelComponent;

  conditionalAuditData: IGridData = {
    configuration: {
      columns: [
        {
          displayText: 'CA Code',
          showSort: false,
          mappingColumn: 'code',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Status',
          showSort: false,
          mappingColumn: 'status',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Audit Date',
          showSort: false,
          mappingColumn: 'auditDate',
          showColumn: true,
          columnFormat: this.ColumnFormat.DATE,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Category',
          showSort: false,
          mappingColumn: 'categoryName',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Created By',
          showSort: false,
          mappingColumn: 'createdBy',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Before Image',
          showSort: false,
          mappingColumn: 'beforeImageUrl',
          showColumn: true,
          columnFormat: this.ColumnFormat.IMAGE,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'After Image',
          showSort: false,
          mappingColumn: 'afterImageUrl',
          showColumn: true,
          columnFormat: this.ColumnFormat.IMAGE,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Action By',
          showSort: false,
          mappingColumn: 'resourceName',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Action Taken',
          showSort: false,
          mappingColumn: 'actionTaken',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        }
      ],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: false,
      canEdit: false,
      canDelete: false
    },
    data: []
  };
  ppmData: any = {
    configuration: {
      columns: [],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: false,
      canEdit: true,
      canDelete: false
    },
    data: []
  };
  serviceHistoryData: any = {
    configuration: {
      columns: [],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: false,
      canEdit: true,
      canDelete: false
    },
    data: []
  };
  widgetData: any;

  constructor(
    private apiService: ApiService,
    private navService: NavigationService,
    private alertService: SweetAlertService,
    private router: Router
  ) {
    super();
    this.isEditable = false;
    this.navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState.subMenu);
    if (this.router.url === `/${Navigate.CREATE_ASSET}`) {
      this.navState.currentAssertId = 0;
      this.isEditable = this.navState.subMenu?.canAdd ?? false;
    }
    this.isEdited = this.navState.currentAssertId > 0;
    let url = this.navState.isHeaderCall
      ? 'Activity/GetAllMasterData'
      : CommonHelper.getNonNullValue(
          this.navState.editUrl,
          this.navState.subMenu?.url
        );
    this.apiService.GetMasterData(url).subscribe({
      next: (result) => {
        this.masterData = result;
        this.saveAt = 'Activity/SaveAsset' ?? '';
        this.currentTab = 1;
        this.navState.isHeaderCall = false;
        this.navService.setNavigationState(this.navState);
        if (this.isEdited) {
          this.isEdited = this.navState.currentAssertId > 0 && this.navState.subMenu?.canUpdate? true : false;
          this.apiService
            .GetAssetById(
              `Activity/GetAssetInformationById?assetId=${this.navState.currentAssertId}`,
              null
            )
            .subscribe({
              next: (asset) => {
                this.navState = this.navService.getNavigationState();
                this.navState.assetData = asset;
                this.widgetData = {
                  ppmWidget: asset.ppmWidget,
                  workOrderWidgetDetails: asset.workOrderWidgetDetails
                };
                this.navService.setNavigationState(this.navState);
                this.isDataLoaded = true;
                this.conditionalAuditData.data = asset.condAuditDetails??[];
                this.conditionalAuditData?.data?.forEach((ca: any) => {
                  ca['code'] = 'CA:'+this.pad(ca.condAuditId,3);
                  ca.status = ca.status === 1 ? 'Active' : 'Completed';
                  ca.createdBy = asset.condAuditDetails[0]?.createdBy;
                });
                let defaultImg = asset.identifications?.find(
                  (identifier: any) =>
                    identifier.type === 3 && identifier.isDefault
                )?.imageUrl;
                this.setDefaultAssetImage(defaultImg);
              },
              error: (err) => {
                this.alertService.error('Error retreving assets !!', {
                  id: 'alert-asset'
                });
                console.error(err);
              },
              complete: () => {
                this.navService.setNavigationState(this.navState);
              }
            });
        } else {
          this.navState.assetData = null;
          this.navService.setNavigationState(this.navState);
          this.isDataLoaded = true;
        }
      },
      error: (e) => {
        this.alertService.error('Error retreving assets !!', {
          id: 'alert-asset'
        }, e);
        console.error(e);
      },
      complete: () => {}
    });
  }

  onEdit(isEditable: any) {
    this.isEditable = this.navState.subMenu?.canUpdate && isEditable;
    this.assetHeader?.updateButtons(this.isEditable);
  }

  updateFormValidity(isFormValid: any) {
    this.assetHeader?.updateButtons(!isFormValid);
  }

  onSave(event: any): any {
    switch (this.currentTab) {
      case 1:
        this.generalForm.save();
        break;
      case 2:
        this.financialForm.save();
        break;
      case 3:
        this.parameterForm.save();
        break;
      case 4:
        this.identificationForm.save();
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        this.uploadFiles();
        break;
    }
  }

  onTabChange(tab: any): void {
    this.navState = this.navService.getNavigationState();
    this.currentTab = tab;
    this.subSystemId = this.navState.assetData?.generals?.subSystemId;
    if (this.currentTab === 3) {
      this.parameterForm.onSubSystemChanged(this.subSystemId);
    }
    if (this.currentTab === 6) {
      this.getDocuments();
    }
    if (this.currentTab === 7 || this.currentTab === 8) {
      this.getView(
        this.currentTab === 7 ? 'GetAssetSchedulers' : 'GetAssetServiceHistory'
      );
    }
    if (this.defaultAssetImage) {
      setTimeout(() => {
        this.sidePanel?.setAssetDefaultImg(this.defaultAssetImage);
        this.sidePanel?.updateQr(this.defaultQrImage);
      }, 100);
    }
  }

  setDefaultAssetImage(event: any): void {
    if (event != undefined && event != null && event !== '') {
      this.defaultAssetImage = event;
      this.sidePanel?.setAssetDefaultImg(this.defaultAssetImage);
    }
  }

  updateAsset(subSystemId: any): void {
    this.subSystemId = subSystemId.value;
  }

  updateQr(event: any): void {
    this.defaultQrImage = event;
    this.sidePanel?.updateQr(this.defaultQrImage);
  }

  getDocuments(): void {
    if (this.navState.currentAssertId > 0) {
      this.apiService
        .GetDocuments(
          `Common/GetAttachments?linkId=${this.navState.currentAssertId}&linkGroupId=1&attachmentGroup=2`
        )
        .subscribe({
          next: (documents) => {
            this.documents = documents;
          },
          error: (err) => {
            this.alertService.error('Error retreving assets !!', {
              id: 'alert-asset'
            });
            console.error(err);
          },
          complete: () => {
            this.navService.setNavigationState(this.navState);
          }
        });
    }
  }

  delete(doc: any) {
    let document = {
      id: doc.id,
      assetId: doc.assetId,
      documentUrl: doc.documentUrl,
      file: '',
      documentType: '',
      fileName: '',
      extension: ''
    };
    this.apiService
      .DeleteDoc(`Identification/DeleteDocument`, document)
      .subscribe({
        next: (deleted) => {
          this.alertService.success('Deleted successfully !!', {
            id: 'alert-asset'
          });
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  getView(viewType: any): void {
    this.ppmData.configuration.columns =
      this.serviceHistoryData.configuration.columns = [];
    this.apiService
      .GetAssetData(
        `Activity/${viewType}?assetId=` + this.navState.currentAssertId
      )
      .subscribe({
        next: (result: any) => {
          if (this.currentTab === 7) {
            this.ppmData = result;
          } else {
            let gridData = result;
            gridData.data?.forEach((row: any) => {
              row[
                'reportedBy,emailAddress,mobileNo'
              ] = `<div class="mr-3"><a><img src='assets/images/empty-profile.png' width="32" height="32" alt=""></a></div>
                <div><a class="text-body font-weight-semibold">${
                  row.reportedBy ?? ''
                }</a>
                <div class="text-muted font-size-sm">${
                  row.emailAddress ?? ''
                }</div>
                <span> ${row.mobileNo ?? ''}</span></div>`;
              row[
                'buildingName,locationName'
              ] = `<div><a class="text-body font-weight-semibold">${row.buildingName}</a>
                <div class="text-muted font-size-sm">${row.locationName}</div></div>`;
              row[
                'typeName,subTypeName'
              ] = `<div><a class="text-body font-weight-semibold">${
                row.typeName
              }</a>
                <div class="text-muted font-size-sm">${
                  row.subTypeName ?? 'NA'
                }</div></div>`;
              row[
                'assetCode,assetName'
              ] = `<div><a class="text-body font-weight-semibold">${
                row.assetCode ?? 'NA'
              }</a>
                <div class="text-muted font-size-sm">${
                  row.assetName ?? ''
                }</div></div>`;
            });
            this.serviceHistoryData = gridData;
          }
        },
        error: (err: any) => {
          this.alertService.error('Error retreving ppm data !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  selectFiles(event: any) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  uploadFiles() {
    let documentModels: any = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      let data = {
        id: 0,
        assetId: this.navState.currentAssertId,
        file: this.selectedFiles[i]
      };
      documentModels.push(data);
    }
    this.uploadDocs(0, documentModels);
  }

  uploadDocs(idx: number, documentModels: any) {
    this.apiService
      .UploadDocs(
        `Identification/SaveDocuments`,
        documentModels,
        this.navState.currentAssertId
      )
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
          } else {
            if (event.isSuccess) {
              this.alertService
                .success('Uploaded successfully !!', {
                  id: 'alert-asset'
                })
                .then(() => {this.getDocuments(); this.selectedFiles = []});
            } else {
              this.alertService.error(
                `Could not upload the file !! ${
                  event.message ? ':' + event.message : ''
                }`,
                {
                  id: 'alert-asset'
                }
              );
            }
          }
        },
        error: (err) => {
          this.progressInfos[idx].value = 0;
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });

          console.error(err);
        },
        complete: () => {}
      });
  }

  viewScheduler(scheduler: any) {
    let navState = this.navService.getNavigationState();
    navState.currentSchedulerId = scheduler ? scheduler.id : 0;
    this.navService.setNavigationState(navState);
    this.router.navigate([Navigate.VIEW_SCHEDULE]);
  }

  getFileName(file: any): string {
    return file.name;
  }

  download(doc: any) {}

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
