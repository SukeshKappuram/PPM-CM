import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { AttachmentType } from 'src/app/models/enums/AttachmentType.enum';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import buttons from '../../../helpers/buttons.json';

@Component({
  selector: 'app-new-stock',
  templateUrl: './new-stock.component.html',
  styleUrls: ['./new-stock.component.scss']
})
export class NewStockComponent extends CommonComponent implements OnDestroy {
  activeTabId: number = 1;
  generalInfo!: FormGroup;
  locationInfo!: FormGroup;
  quantityInfo!: FormGroup;
  financialsInfo!: FormGroup;
  docImagesInfo!: FormGroup;
  identificationInfo!: FormGroup;
  ImagesInfo!: FormGroup;

  currentView = 'New Stock';
  buildings: any;
  calculationMethods: any;

  stockData: any;
  subGroups: any[] = [];
  units: any[] = [];
  rooms: any[] = [];

  documents: any[] = [];
  docImages: any[] = [];

  selectedFiles: FileList[] = [];

  assetImages: any[] = [];
  files: any[] = [];
  identifications: any[] = [];
  defaultAssetImage: string = '';

  newIdentifications: any[] = [];
  barcodes: any[] = [];
  rfcodes: any[] = [];
  identities: any[] = [];
  identityForm!: FormGroup;
  assetCode: any;
  isBarUploaded: boolean = true;
  isQrUploaded: boolean = true;
  isRfUploaded: boolean = true;
  buildingId: any;
  currencyCode: string = '';
  parameters: any[] = [];
  parameterData: any[] = [];
  availableParameters: any[] = [];
  selectedParameter: any;
  subSuystemId: number = 0;
  selectedParameters: any[] = [];
  stockImage: any;
  imageUrl: any = 'assets/images/empty-profile.png';
  selectedProject: any;

  paraForm: FormGroup = new FormGroup({});
  @ViewChild('parameters') parameterDD!: DropdownComponent;
  @Output() qrChanged = new EventEmitter<any>();
  @ViewChild('costCenterList') costCenterDD!: DropdownComponent;
  @ViewChild('costCodeList') costCodeDD!: DropdownComponent;
  @ViewChild('calculationMethodList') calculationMethodDD!: DropdownComponent;
  @ViewChild('subGroupList') subGroupDD!: DropdownComponent;
  @ViewChild('roomsList') roomsDD!: DropdownComponent;
  defaultQrImage: any;
  @ViewChild('floorList') floorDD!: DropdownComponent;
  @ViewChild('unitList') unitsDD!: DropdownComponent;
  selectedSubSystem: any;
  isUnitPrice: boolean = true;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private router: Router
  ) {
    super();
    this.pageTitle = 'New Stock';
    this.buttons = buttons.stock.stocks.create;
    let navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(navState?.subMenu);
    if (
      !navState.isEditable &&
      this.router.url === `/${Navigate.CREATE_STOCK}`
    ) {
      navState.currentMasterId = 0;
      if(!this.userAccess.canAdd)
      {
        this.buttons = this.buttons.filter((btn:any) => btn.id !== 'Save');
      }
      navService.setNavigationState(navState);
    }else if(!this.userAccess.canUpdate){
      this.buttons = this.buttons.filter((btn:any) => btn.id !== 'Save');
    }
    this.currencyCode = navState.currentAccount?.currencyCode;
    this.getData(navState.currentMasterId);

    this.initialize();
    this.identityForm = this.fb.group({
      brCode: [],
      brClientCode: [],
      rfCode: [],
      rfClientCode: [],
      qrCode: [],
      qrClientCode: []
    });

    this.parameters = this.masterData?.subGroupAdditionalFields?.filter(
      (p: any) => p.subGroupId === this.stockData?.subGroupId
    );
    this.paraForm = this.fb.group({
      additionalField: [''],
      parameterValues: this.fb.array([])
    });
    this.availableParameters = this.parameters?.filter((p) => {
      return (
        this.parameterData?.filter((pd: any) => {
          return pd.parameterId == p.id;
        }).length == 0
      );
    });
    this.parameterData?.forEach((param) => {
      let p = {
        id: param.parameterId,
        name: this.parameters.find((p: any) => p.id == param.parameterId)
          ?.additionalFieldName,
        value: param.parameterValue,
        type: this.parameters.find((p: any) => p.id == param.parameterId)?.type
      };
      this.addParameter(p);
    });
    if (this.router.url === `/${Navigate.EDIT_STOCK}`) {
      this.isEditable = false;
      this.isUnitPrice = false;
    }
    this.updateButtons();
  }

  getData(masterId: any): void {
    this.isDataLoaded = false;
    this.apiService
      .GetStockGeneralInfoById(`Stock/GetStockGeneralInfoById/${masterId}`)
      .subscribe({
        next: (result: any) => {
          this.stockData = result?.stockData;
          this.identifications = result?.identifications;
          this.parameterData = result?.subGroupAdditionalFields ?? [];
          this.subSuystemId = masterId;
          this.masterData = result;
          this.filteredData = { ...this.masterData };
          if (masterId > 0) {
            this.imageUrl =
              this.stockData?.imageUrl ?? 'assets/images/empty-profile.png';
            this.selectedProject = this.masterData?.buildings?.find(
              (b: any) => b.id === this.stockData?.buildingId
            )?.projectId;
            this.calculationMethods =
              this.masterData?.calculationMethods?.filter(
                (s: any) => s.buildingId === this.stockData?.buildingId
              );
            this.units = this.masterData.units.filter(
              (r: any) =>
                r.floorId === this.stockData?.floorId &&
                r.buildingId === this.stockData?.buildingId
            );
            this.rooms = this.masterData.rooms.filter(
              (r: any) => r.unitId === this.stockData?.unitId
            );
            this.subGroups = this.masterData?.subGroups?.filter(
              (s: any) => s.groupId === this.stockData?.groupId
            );
            this.filteredData['calculationMethods'] = this.calculationMethods;
            this.filteredData['units'] = this.units;
            this.filteredData['rooms'] = this.rooms;
            this.filteredData['subGroups'] = this.subGroups;
          } else {
            this.filteredData['calculationMethods'] = [];
            this.filteredData['units'] = [];
            this.filteredData['rooms'] = [];
            this.filteredData['subGroups'] = [];
          }
          this.generalInfo = this.fb.group({
            stockName: [this.stockData?.name, Validators.required],
            stockCode: [this.stockData?.code],
            sparePartCode: [this.stockData?.sparePartCode, Validators.required],
            clientCode: [this.stockData?.clientCode],
            group: [this.stockData?.groupId, Validators.required],
            subGroup: [this.stockData?.subGroupId, Validators.required],
            stockClass: [this.stockData?.stockClassId],
            manufacturer: [this.stockData?.manufacturer],
            productCode: [this.stockData?.productCode],
            model: [this.stockData?.model],
            serialNumber: [this.stockData?.serialNo],
            remarks: [this.stockData?.remarks],
            vendor: [this.stockData?.vendorId]
          });
          this.locationInfo = this.fb.group({
            stores: [this.stockData?.storeId],
            buildings: [this.stockData?.buildingId, Validators.required],
            floor: [this.stockData?.floorId, Validators.required],
            unit: [this.stockData?.unitId, Validators.required],
            rooms: [this.stockData?.roomId, Validators.required]
          });
          let totalPrice = (
            parseInt(this.stockData?.availableStock) *
            parseFloat(this.stockData?.unitPrice)
          ).toFixed(2);
          this.quantityInfo = this.fb.group({
            availableStock: [
              this.stockData?.availableStock,
              Validators.required
            ],
            packSize: [this.stockData?.packSize, Validators.required],
            uom: [this.stockData?.uomId],
            unitPrice: [this.stockData?.unitPrice, Validators.required],
            totalPrice: [totalPrice],
            isTaxApplicable: [this.stockData?.isTaxApplicable],
            reorderQuantity: [this.stockData?.reOrderQuantity],
            reorderLevel: [this.stockData?.reOrderLevel]
          });
          this.financialsInfo = this.fb.group({
            financeCode: [this.stockData?.financeCodeId, Validators.required],
            costCode: [this.stockData?.costCodeId, Validators.required],
            costCenter: [this.stockData?.costCenterId, Validators.required],
            calculationMethod: [
              this.stockData?.calculationMethodId,
              Validators.required
            ]
          });
          this.isDataLoaded = true;
          this.generalInfo.valueChanges.subscribe(() => {
            this.updateButtons(
              !(
                this.generalInfo.valid &&
                this.quantityInfo.valid &&
                this.locationInfo.valid &&
                this.financialsInfo.valid
              )
            );
          });
          this.quantityInfo.valueChanges.subscribe(() => {
            this.updateButtons(
              !(
                this.generalInfo.valid &&
                this.quantityInfo.valid &&
                this.locationInfo.valid &&
                this.financialsInfo.valid
              )
            );
          });
          this.locationInfo.valueChanges.subscribe(() => {
            this.updateButtons(
              !(
                this.generalInfo.valid &&
                this.quantityInfo.valid &&
                this.locationInfo.valid &&
                this.financialsInfo.valid
              )
            );
          });
          this.financialsInfo.valueChanges.subscribe(() => {
            this.updateButtons(
              !(
                this.generalInfo.valid &&
                this.quantityInfo.valid &&
                this.locationInfo.valid &&
                this.financialsInfo.valid
              )
            );
          });
        },
        error: (e: any) => {
          this.alertService.error('Error retreving stock !!', {
            id: 'alert-stock'
          });
          console.error(e);
        },
        complete: () => { }
      });
  }

  getBatchData(stockid: any) {
    this.gridData.configuration.columns = [];
    this.apiService
      .GetBatchDataByFilter('Stock/StockBatchDetails/' + stockid, '')
      .subscribe({
        next: (result) => {
          this.gridData = result;
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Issuer !!', {
            id: 'alert-issuer'
          },e);
          console.error(e);
        },
        complete: () => { }
      });
  }

  getStockDetails(stockid: any) {
    this.gridData.configuration.columns = [];
    this.apiService
      .GetBatchDataByFilter('Stock/StockIssuedDetails/' + stockid, '')
      .subscribe({
        next: (result) => {
          this.gridData = result;
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Issuer !!', {
            id: 'alert-issuer'
          },e);
          console.error(e);
        },
        complete: () => { }
      });
  }

  buildingSelected(building: any, floor?: any) {
    this.buildingId = building.id;
    this.selectedProject = this.masterData?.buildings?.find(
      (b: any) => b.id === building.id
    )?.projectId;
    this.calculationMethods = this.masterData?.calculationMethods?.filter(
      (s: any) => s.buildingId === parseInt(this.buildingId)
    );
    this.filteredData['calculationMethods'] = this.calculationMethods;
    let locationData = this.locationInfo.value;
    this.floorChanged({
      id: floor?.id ?? locationData.floor?.toString() ?? 0
    });
  }

  floorChanged(floor: any) {
    let floorId = floor?.id;
    this.units = this.masterData.units.filter(
      (r: any) =>
        r.floorId === parseInt(floorId) && r.buildingId === this.buildingId
    );
    this.filteredData['units'] = this.units;
    this.unitChanged({ id: this.stockData?.unitId });
  }

  unitChanged(unit: any) {
    let unitId = unit?.id;
    this.rooms = this.masterData.rooms.filter((r: any) => r.unitId === unitId);
    this.filteredData['rooms'] = this.rooms;
    if (unitId) {
      this.locationInfo.controls['rooms'].setValue(null);
    } else {
      this.locationInfo.controls['unit'].setValue(null);
      this.locationInfo.controls['rooms'].setValue(null);
    }
  }

  groupSelected(group: any) {
    this.subGroups = this.masterData?.subGroups?.filter(
      (s: any) => s.groupId === parseInt(group.id)
    );
    this.filteredData['subGroups'] = this.subGroups;
    this.generalInfo.controls['subGroup'].setValue(null);
    this.generalInfo.controls['stockClass'].setValue(null);
  }

  buttonClicked(buttonType: any) {
    if (buttonType === 'Save') {
      this.saveOrEdit();
    } else if (buttonType === 'Cancel') {
      this.router.navigate([Navigate.VIEW_STOCK_GRID]);
    }
  }

  override save(): void {
    let formData: any = {
      ...this.generalInfo.value,
      ...this.quantityInfo.value,
      ...this.locationInfo.value,
      ...this.financialsInfo.value
    };
    let navState = this.navService.getNavigationState();
    let stock = {
      id: navState.currentMasterId,
      name: formData.stockName,
      code: '',
      clientCode: formData.clientCode == null ? '' : formData.clientCode,
      qrCode: '',
      accountId: navState.currentAccount?.id,
      groupId: formData.group?.id ? parseInt(formData.group?.id) : this.stockData?.groupId,
      subGroupId: formData.subGroup?.id ? parseInt(formData.subGroup?.id) : this.stockData?.subGroupId,
      stockClassId:
        formData.stockClass == null ? '' : parseInt(formData.stockClass?.id),
      manufacturer: formData.manufacturer,
      productCode: formData.productCode,
      sparePartCode: formData.sparePartCode,
      model: formData.model,
      serialNo: formData.serialNumber,
      vendorId: formData.vendor == null ? '' : parseInt(formData.vendor?.id),
      remarks: formData.remarks,
      storeId:
        formData.stores == null
          ? ''
          : isNaN(formData.stores)
            ? formData.stores
            : parseInt(formData.stores),
      projectId: this.selectedProject,
      buildingId: isNaN(formData.buildings?.id)
        ? (formData.buildings?.id ?? this.stockData?.buildingId)
        : parseInt(formData.buildings?.id),
      floorId: isNaN(formData.floor?.id)
        ? (formData.floor?.id ?? this.stockData?.floorId)
        : parseInt(formData.floor?.id),
      unitId: isNaN(formData.unit?.id)
        ? (formData.unit?.id ?? this.stockData?.unitId)
        : parseInt(formData.unit?.id),
      roomId: isNaN(formData.rooms?.id)
        ? (formData.rooms?.id ?? this.stockData?.roomId)
        : parseInt(formData.rooms?.id),
      financeCodeId: isNaN(formData.financeCode?.id)
        ? (formData.financeCode?.id ?? this.stockData?.financeCodeId)
        : parseInt(formData.financeCode?.id),
      costCenterId: isNaN(formData.costCenter?.id)
        ? (formData.costCenter?.id ?? this.stockData?.costCenterId)
        : parseInt(formData.costCenter?.id),
      costCodeId: isNaN(formData.costCode?.id)
        ? (formData.costCode?.id ?? this.stockData?.costCodeId)
        : parseInt(formData.costCode?.id),
      calculationMethodId: isNaN(formData.calculationMethod?.id)
        ? (formData.calculationMethod?.id ?? this.stockData?.calculationMethodId)
        : parseInt(formData.calculationMethod?.id),
      availableStock: isNaN(formData.availableStock)
        ? formData.availableStock
        : parseInt(formData.availableStock),
      uomId: formData.uom == null ? '' : parseInt(formData.uom?.id),
      packSize: formData.packSize,
      unitPrice: isNaN(formData.unitPrice)
        ? formData.unitPrice
        : parseFloat(formData.unitPrice),
      totalPrice: 0,
      isTaxApplicable: formData.isTaxApplicable ?? false,
      reOrderQuantity:
        formData.reorderQuantity == null
          ? ''
          : isNaN(formData.reorderQuantity)
            ? formData.reorderQuantity
            : parseInt(formData.reorderQuantity),
      reOrderLevel: formData.reorderLevel,
      currencyCode: '',
      image: this.stockImage
    };
    this.AddorUpdateStock(stock);
  }

  onStockImgChange(event: any): void {
    let files = event.target.files as [];
    for (let i = 0; i < files.length; i++) {
      this.stockImage = files[i];
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.stockImage);
    reader.onload = () => {
      this.imageUrl = reader.result?.toString();
    };
  }

  AddorUpdateStock(data: any): void {
    this.apiService.AddOrUpdateStock(`Stock/AddorUpdateStock`, data).subscribe({
      next: (result: any) => {
        if (result > 0) {
          this.alertService
            .success('Stock Saved Successfully !!', {
              id: 'alert-stock'
            })
            .then(() => {
              this.isEditable = !this.isEditable;
              this.updateButtons(false);
              let navState = this.navService.getNavigationState();
              navState.currentMasterId = result;
              this.navService.setNavigationState(navState);
              this.router.navigate([Navigate.EDIT_STOCK]);
            });
        } else if (result === -2) {
          this.alertService.error(
            'Error occured while processening your request',
            {
              id: 'alert-stock'
            }
          );
        } else if (result === -3) {
          this.alertService.error(
            'Please enter unique spare part code for stock',
            {
              id: 'alert-stock'
            }
          );
        }
      },
      error: (e: any) => {
        this.alertService.error('Error Saving Stock !!', {
          id: 'alert-stock'
        });
        console.error(e);
      },
      complete: () => { }
    });
  }

  getDocuments(type: number): void {
    this.documents = [];
    this.assetImages = [];
    let navState = this.navService.getNavigationState();
    if (navState.isEditable && navState.currentMasterId > 0) {
      this.apiService
        .GetCommonDocuments(
          `Common/GetAttachments?linkId=${navState.currentMasterId}&linkGroupId=1&attachmentGroup=` +
          type,
          ApiEndpoints.STOCKAPI
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
          complete: () => { }
        });
    }
  }

  selectFiles(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadFiles() {
    let navState = this.navService.getNavigationState();
    let documentModels: any = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      let data = {
        id: 0,
        linkId: navState.currentMasterId,
        file: this.selectedFiles[i],
        linkGroupId: 1,
        attachmentGroup: AttachmentType.DOCUMENTS,
        title: '',
        subtitle: ''
      };
      documentModels.push(data);
    }
    this.uploadAttachments(documentModels);
  }

  uploadAttachments(documentModels?: any) {
    this.apiService
      .UploadCommonDocs(
        `Common/SaveAttachments`,
        documentModels ? documentModels : this.assetImages,
        ApiEndpoints.STOCKAPI
      )
      .subscribe({
        next: (uploaded) => {
          if (uploaded) {
            this.alertService
              .success('Uploaded successfully !!', {
                id: 'alert-asset'
              })
              .then(() => {
                if (documentModels) {
                  this.getDocuments(documentModels[0]?.attachmentGroup);
                } else {
                  this.getDocuments(AttachmentType.IMAGES);
                }
              });
          }
        },
        error: (err) => {
          this.alertService.error('Error retreving images !!', {
            id: 'alert-asset'
          });

          console.error(err);
        },
        complete: () => { }
      });
  }

  getFileName(file: any) {
    return file.name;
  }

  onChange(event: any): void {
    let navState = this.navService.getNavigationState();
    this.files = event.target.files as [];
    for (let i = 0; i < this.files.length; i++) {
      let img = {
        id: 0,
        linkId: navState.currentMasterId,
        file: this.files[i],
        resourceUrl: URL.createObjectURL(this.files[i]),
        linkGroupId: 1,
        attachmentGroup: AttachmentType.IMAGES,
        title: '',
        subtitle: ''
      };
      this.assetImages.push(img);
      this.documents.push(img);
    }
  }

  delete(doc: any, type: number) {
    let document = {
      id: doc.id,
      linkId: doc.linkId,
      linkGroupId: 1,
      file: '',
      attachmentType: '',
      attachmentGroup: type,
      resourceUrl: doc.resourceUrl,
      fileName: '',
      extension: ''
    };
    this.apiService
      .DeleteCommonAttachment(
        `Common/DeleteAttachment`,
        document,
        ApiEndpoints.STOCKAPI
      )
      .subscribe({
        next: (deleted) => {
          if (deleted) {
            this.alertService
              .success('Deleted successfully !!', {
                id: 'alert-asset'
              })
              .then(() => {
                this.getDocuments(type);
              });
          }
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => { }
      });
  }

  initialize(): void {
    this.identifications?.forEach((i: any) => {
      switch (i.type) {
        case 0:
          this.isBarUploaded = true;
          break;
        case 1:
          this.isQrUploaded = true;
          if (this.isQrUploaded) {
            let qr = this.identifications.find(
              (i: any) => i.type === 1
            ).imageUrl;
            this.qrChanged.emit(qr);
          }
          break;
        case 2:
          this.isRfUploaded = true;
          break;
      }
    });
  }

  onSelect(event: any, type: number): void {
    let navState = this.navService.getNavigationState();
    let identity = {
      id: 0,
      stockId: navState.currentMasterId,
      code: '',
      clientCode: '',
      type: type,
      file: event.addedFiles[0],
      imageUrl: '',
      isDefault: false
    };
    switch (type) {
      case 0:
        this.barcodes = [];
        this.barcodes.push(event.addedFiles[0]);
        break;
      case 1:
        break;
      case 2:
        this.rfcodes = [];
        this.rfcodes.push(event.addedFiles[0]);
        break;
    }
    this.identifications = this.identifications.filter((i) => i.type !== type);
    this.identifications.push(identity);
    this.identities = this.newIdentifications.filter((i) => i.type !== type);
    this.identities.push(identity);
  }

  onRemove(event: any, type: number) {
    //this.files.splice(this.files.indexOf(event), 1);
    switch (type) {
      case 0:
        this.barcodes = [];
        break;
      case 1:
        break;
      case 2:
        this.rfcodes = [];
        break;
    }
  }

  changeStatus(item: number, event: any) {
    switch (item) {
      case 0:
        this.isBarUploaded = event.target.checked;
        break;
      case 1:
        this.isQrUploaded = event.target.checked;
        break;
      case 2:
        this.isRfUploaded = event.target.checked;
        break;
    }
  }

  generate() {
    let navState = this.navService.getNavigationState();
    let identity = {
      id: 0,
      stockId: navState.currentMasterId,
      code: '',
      clientCode: '',
      type: 1,
      file: '',
      imageUrl: '',
      isDefault: false
    };
    let identities = [];
    identities.push(identity);
    this.apiService
      .UploadStockIdentifications(
        'Stock/SaveIdentifications',
        identities,
        ApiEndpoints.STOCKAPI
      )
      .subscribe({
        next: (gennerated) => {
          this.alertService.success('Saved successfully !!', {
            id: 'alert-asset'
          });
          this.retriveData();
        },
        error: (err) => {
          this.alertService.error('Error retreving stocks !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => { }
      });
  }

  getIdentification(id: number): any {
    let identity = this.identifications.find((i: any) => i.type === id);
    if (identity) {
      return identity;
    }
    return { clientCode: '' };
  }

  saveIdentitification(): void {
    let formData = this.identityForm.value;
    this.identities.forEach((identity) => {
      switch (identity.type) {
        case 0:
          identity.code = formData.brCode;
          identity.clientCode = formData.brClientCode;
          break;
        case 1:
          identity.code = formData.qrCode;
          identity.clientCode = formData.qrClientCode;
          break;
        case 2:
          identity.code = formData.rfCode;
          identity.clientCode = formData.rfClientCode;
          break;
      }
      identity.isDefault = true;
    });
    this.apiService
      .UploadStockIdentifications('Stock/SaveIdentifications', this.identities)
      .subscribe({
        next: (uploded) => {
          this.alertService.success('Saved successfully !!', {
            id: 'alert-asset'
          });
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => { }
      });
  }

  deleteIdentificationImg(docImg: any): void {
    let navState = this.navService.getNavigationState();
    let identity = {
      id: docImg.id,
      stockId: navState.currentMasterId,
      code: '',
      clientCode: '',
      type: docImg.type,
      file: '',
      imageUrl: docImg.imageUrl,
      isDefault: false
    };
    this.apiService
      .DeleteIdentification(
        'Stock/DeleteIdentification',
        identity,
        ApiEndpoints.STOCKAPI
      )
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
        complete: () => { }
      });
  }

  retriveData(): void {
    let navState = this.navService.getNavigationState();
    this.apiService
      .GetAssetById(
        `Stock/GetStockGeneralById?stockId=${navState.currentMasterId}`,
        null
      )
      .subscribe({
        next: (stock) => {
          navState = this.navService.getNavigationState();
          // navState.assetData = stock;
          this.navService.setNavigationState(navState);
          this.identifications = stock?.identifications;
          this.initialize();
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {
          this.navService.setNavigationState(navState);
        }
      });
  }
  getParaForm(form: any): FormGroup {
    return form;
  }
  onSubSystemChanged(selectedSubSystem: any) {
    this.selectedSubSystem = selectedSubSystem;
    if (this.selectedSubSystem) {
      this.parameters = this.masterData?.subSystemParameters?.filter(
        (p: any) => p.subSystemId == this.selectedSubSystem
      );
      this.availableParameters = this.parameters?.filter((p) => {
        return (
          this.parameterData?.filter((pd: any) => {
            return pd.parameterId == p.id;
          }).length == 0
        );
      });
    }
  }

  onChangeParameter(parameter: any): void {
    if (parameter?.id) {
      this.selectedParameter = this.availableParameters.find(
        (p: any) => p.id == parameter?.id
      );
      // this.parameterDD.setToDefault();
    }
  }

  get parameterValuesFieldAsFormArray(): any {
    return this.paraForm.get('parameterValues') as FormArray;
  }

  parameterValue(name: string, value?: string): any {
    return this.fb.group({
      name: [name],
      value: [value, Validators.required]
    });
  }

  addParameter(parameter: any) {
    if (!this.selectedParameters.some((p) => p.id === parameter.id)) {
      this.selectedParameters.push(parameter);
      this.parameterValuesFieldAsFormArray.push(
        this.parameterValue(parameter.name, parameter.value ?? '')
      );
      this.availableParameters = this.parameters?.filter((p) => {
        return (
          this.selectedParameters?.filter((pd: any) => {
            return pd.id == p.id;
          }).length == 0
        );
      });
    }
  }

  remove(i: any): void {
    this.parameterValuesFieldAsFormArray.removeAt(i);
    this.availableParameters.push(
      this.parameters.find((p) => p.id === this.selectedParameters[i].id)
    );
    this.selectedParameters.splice(i, 1);
  }

  saveParameters(): void {
    let parameters = this.paraForm.value;
    let navState = this.navService.getNavigationState();
    this.formData = [];
    parameters.parameterValues.forEach((param: any) => {
      this.formData.push({
        assetId: navState.currentAssertId,
        parameterId: this.parameters.find((p) => p.name === param.name).id,
        parameterValue: param.value
      });
    });
    this.apiService
      .SaveAsset('Activity/SaveAssetParameters', this.formData)
      .subscribe({
        next: (result: any) => {
          if (result > 0) {
            navState.assetData = { parameters: this.formData };
            this.navService.setNavigationState(navState);
            this.alertService.success('Asset saved  successfully!!', {
              id: 'alert-asset'
            });
          } else {
            this.alertService.error('Could not update asset details!!', {
              id: 'alert-asset'
            });
          }
        },
        error: (e: any) => {
          this.alertService.error('Error updating asset details!!', {
            id: 'alert-asset'
          });
          console.error(e);
        },
        complete: () => {
          this.navService.setNavigationState(navState);
        }
      });
  }

  override updateButtons(isEditable: any = null): void {
    let savebutton = this.buttons.find((b: any) => b.id === 'Save');
    if (savebutton) {
      savebutton.label = this.isEditable ? 'save' : 'edit';
      savebutton.icon = this.isEditable
        ? 'bi bi-check-circle'
        : 'bi bi-pencil-square';
      savebutton.isDisabled = isEditable == null ? this.isEditable : isEditable;
    }
  }

  ngOnDestroy() {
    console.log();
  }
}
