import { PopupComponent } from './../../../stock-management/stock-issue/popup/popup.component';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';

import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';

@Component({
  selector: 'app-mr-tab',
  templateUrl: './mr-tab.component.html',
  styleUrls: ['./mr-tab.component.scss']
})
export class MrTabComponent extends CommonComponent implements OnInit {
  mrItemsForm!: FormGroup;
  stocks: any[] = [];
  mrItemDetails: any = [];
  taskLogId: any;
  @Input() hasEditAccess: boolean = false;
  @Input() projectId: number = 0;
  @Input() taskTypeId: number = 0;
  @Input() reportedById: number = 0;
  @Input() statusId: any;
  ServiceStatus = ServiceStatus;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private navService: NavigationService,
    private alertService: SweetAlertService,
    private localizedDatePipe: LocalizedDatePipe,
    private dialog: MatDialog
  ) {
    super();
    this.navState = this.navService.getNavigationState();
    this.taskLogId = this.navState.currentLogId;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.mrItemsForm = this.fb.group({
      items: this.fb.array([])
    });
    this.apiService
      .GetTaskLog(
        `MaterialRequest/GetMRDetailsByTaskId/${this.taskLogId}/${this.taskTypeId}/${this.projectId}`,
        ApiEndpoints.STOCKAPI
      )
      .subscribe({
        next: (result) => {
          this.mrItemDetails = [];
          this.masterData = result;
          this.filteredData = { ...this.masterData };
          result?.mrDetails?.forEach((element: any) => {
            element.mrDetailItems.map((mr: any) => {
              mr['mrCode'] = element.code;
              mr['mrDate'] = element.createdDate;
            });
            this.mrItemDetails = this.mrItemDetails.concat(
              element.mrDetailItems
            );
          });
          this.mrItemDetails?.forEach((element: any) => {
            element['isSaved'] = true;
            this.add(element);
          });
          this.isDataLoaded = true;
        },
        error: (e) => {
          this.alertService.error('Error Retreving MR Details !!', {
            id: 'alert-mr'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  get items() {
    return this.mrItemsForm?.controls['items'] as FormArray;
  }

  getIssueDetails(form: any): FormGroup {
    return form;
  }

  add(mrItem?: any): void {
    if (mrItem) {
      this.mrItemDetails.find((mr: any) => mr.id === mrItem.id).mrDate =
        this.localizedDatePipe.transform(mrItem.mrDate, 'dd-MMM-yyyy HH:mm');
    } else {
      this.mrItemDetails?.push({ id: 0 });
    }
    const itemForm = this.fb.group({
      id: [mrItem?.id ?? 0, Validators.required],
      mrTypeId: [mrItem?.mrTypeId, Validators.required],
      taskLogId: [this.taskLogId, Validators.required],
      stockId: [mrItem?.stockId],
      sparePartCode: [mrItem?.stockId],
      availableQty: [mrItem?.availableQty ?? 0],
      requiredQty: [mrItem?.requiredQty ?? 0, Validators.required],
      unitPrice: [mrItem?.unitPrice ?? 0, Validators.required],
      totalPrice: [mrItem?.totalPrice ?? 0, Validators.required],
      description: [mrItem?.description],
      stockName: [mrItem?.stockName],
      remarks: [mrItem?.remarks],
      mrCode: [mrItem?.mrCode],
      mrDate: [mrItem ? this.localizedDatePipe.transform(mrItem?.mrDate) : '']
    });
    this.items.push(itemForm);
  }

  filterTypes(index: any, itemForm: any, event: any) {
    this.mrItemDetails[index].mrTypeId = event.id;
    itemForm = itemForm as FormGroup;
    itemForm.controls['requiredQty'].setValue(0);
    itemForm.controls['unitPrice'].setValue(0);
    itemForm.controls['totalPrice'].setValue(0);
    this.mrItemDetails[index].totalPrice = 0;
    this.mrItemDetails[index].availableQty = 0;
  }

  sparePartChange(index: any, itemForm: any, event: any) {
    let stock = this.masterData?.stocks.find(
      (stock: any) => stock.id === event.id
    );
    if (stock) {
      let formValue = itemForm.value;
      this.mrItemDetails[index].stockId = event.id;
      formValue['stockId'] = stock.id;
      this.mrItemDetails[index].sparePartCode = stock.sparePartCode;
      formValue['sparePartCode'] = stock.sparePartCode;
      this.mrItemDetails[index].availableQty = stock.availableStock;
      formValue['availableQty'] = stock.availableStock;
      this.mrItemDetails[index].unitPrice = stock.unitPrice;
      formValue['unitPrice'] = stock.unitPrice;
      this.mrItemDetails[index].requiredQty = 0;
      formValue['requiredQty'] = 0;
      itemForm.patchValue(formValue);
      this.calculateTotal(index, itemForm, 0, event);
    } else {
      let formValue = itemForm.value;
      this.mrItemDetails[index].stockId = event.id;
      formValue['stockId'] = '';
      this.mrItemDetails[index].sparePartCode = '';
      formValue['sparePartCode'] = '';
      this.mrItemDetails[index].availableQty = 0;
      formValue['availableQty'] = 0;
      this.mrItemDetails[index].requiredQty = 0;
      formValue['requiredQty'] = 0;
      this.mrItemDetails[index].unitPrice = 0;
      formValue['unitPrice'] = 0;
      itemForm.patchValue(formValue);
      this.calculateTotal(index, itemForm, 0, event);
    }
  }

  buttonClicked(buttonType: any): void {
    if (buttonType == 'Save') {
      this.save();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.VIEW_STOCKISSUE_GRID]);
    }
  }

  delete(index: number): void {
    this.items.removeAt(index);
    if (index > -1) {
      this.mrItemDetails.splice(index, 1);
    }
  }

  openData(item: any): void {
    this.apiService
      .GetStockList(
        `MaterialRequest/MRStockPrices/${item.stockId}/${item.mrId}/${item.id}`
      )
      .subscribe({
        next: (result: any) => {
          if (result?.stockPriceBatches) {
            const dialogRef = this.dialog
              .open(PopupComponent, {
                data: {
                  title: 'MR Details',
                  stockIssuedDetails: result?.stockPriceBatches
                },
                autoFocus: true,
                maxHeight: '90vh',
                width: '80vw',
                disableClose: false
              })
              .afterClosed()
              .subscribe((result) => {});
          }
        },
        error: (e: any) => {
          this.alertService.error('Error retreving stock !!', {
            id: 'alert-stock'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  calculateTotal(index: number, itemForm: any, type: any, event: any) {
    let value = event?.target?.value ?? event ?? 0;
    let currentIndex = 0;
    this.mrItemDetails?.forEach((element: any) => {
      if (currentIndex === index) {
        itemForm = itemForm as FormGroup;
        (element.requiredQty = type === 1 ? value : element?.requiredQty),
          (element.unitPrice = type === 2 ? value : element?.unitPrice),
          (element.totalPrice =
            !isNaN(element.requiredQty) && !isNaN(element.unitPrice)
              ? parseInt(element.requiredQty) * parseFloat(element.unitPrice)
              : element?.totalPrice);
        let stock = this.masterData?.stocks.find(
          (stock: any) => stock.id === parseInt(element?.stockId)
        );
        let formValue = itemForm.value;
        let itemFormDetails = {
          id: element?.id,
          mrTypeId: element?.mrTypeId,
          stockId: element?.stockId,
          sparePartCode: element?.stockId,
          availableQty:
            this.getNonEmptyOrUndefinedValue(
              stock?.availableStock ?? element?.availableQty
            ) ?? 0,
          requiredQty: element?.requiredQty,
          unitPrice:
            this.getNonEmptyOrUndefinedValue(
              stock?.unitPrice ?? element?.unitPrice
            ) ?? 0,
          totalPrice: isNaN(element.totalPrice)
            ? 0
            : Math.round(100 * element.totalPrice) / 100,
          taskLogId: this.taskLogId,
          description: formValue?.description,
          stockName: formValue?.stockName,
          remarks: element?.remarks,
          mrCode: element?.mrCode,
          mrDate: element?.mrDate
        };
        if (element?.mrTypeId === 1 && type === 1) {
          if (value) {
            this.apiService
              .getStockIssueDetails(
                'StockIssued/IssuingStockPrice',
                stock.id,
                value
              )
              .subscribe({
                next: (result: any) => {
                  this.mrItemDetails[index].totalPrice = result?.totalPrice;
                  itemFormDetails.totalPrice = result?.totalPrice;
                  itemForm.controls['totalPrice'].setValue(result?.totalPrice);
                },
                error: (e: any) => {
                  this.alertService.error('Error Retrieving MR Data !!', {
                    id: 'stock-issue'
                  });
                  console.error(e);
                },
                complete: () => {}
              });
          } else {
            this.mrItemDetails[index].totalPrice = 0;
            itemForm.controls['totalPrice'].setValue(0);
          }
        } else {
          this.mrItemDetails[index].totalPrice = isNaN(element.totalPrice)
            ? 0
            : Math.round(100 * element.totalPrice) / 100;
        }
        itemForm.patchValue(itemFormDetails);
      }
      currentIndex++;
    });
  }

  override save(): void {
    if (this.mrItemsForm.valid) {
      let formData = this.mrItemsForm.value;
      let mrItems: any[] = [];
      formData?.items.forEach((element: any) => {
        let itemFormDetails = {
          id: element?.id,
          mrTypeId: element?.mrTypeId?.id ?? element?.mrTypeId,
          stockId: element?.stockId?.id ?? element?.stockId,
          sparePartCode: element?.stockId?.id ?? element?.stockId,
          stockName: element?.stockName,
          availableQty: element?.availableQty,
          requiredQty: element?.requiredQty,
          unitPrice: element?.unitPrice,
          totalPrice: isNaN(element.totalPrice) ? 0 : element.totalPrice,
          remarks: element?.remarks
        };
        mrItems.push(itemFormDetails);
      });
      let reqData = {
        id: 0,
        projectId: this.projectId,
        taskTypeId: this.taskTypeId,
        taskLogId: this.taskLogId,
        description: '',
        financeCodeId: null,
        costCodeId: null,
        costCenterId: null,
        reportedById: null,
        reportedByName: '',
        reportedByEmail: '',
        reportedByMobile: '',
        deptName: '',
        code: '',
        createdDate: new Date(),
        serviceReportNo: '',
        mrDetailItems: mrItems.filter((item) => item.id === 0)
      };
      if (reqData.mrDetailItems.some((s: any) => s.requiredQty <= 0)) {
        this.alertService.error('Requested quantity should be greater than 0', {
          id: 'alert-stock'
        });
        return;
      } else {
        this.apiService
          .AddOrUpdateTaskLog(
            `MaterialRequest/CreateMaterialRequest`,
            reqData,
            ApiEndpoints.STOCKAPI
          )
          .subscribe({
            next: (result) => {
              if (result > 0) {
                this.alertService
                  .success('Added MR(s) Successfully !!', {
                    id: 'alert-mr'
                  })
                  .then(() => {
                    this.getData();
                  });
              } else if (result === -1) {
                this.alertService.warn('Add atleast one MR record!!', {
                  id: 'alert-mr'
                });
              } else {
                this.alertService.error('Could not add MR !!', {
                  id: 'alert-mr'
                });
              }
            },
            error: (e) => {
              this.alertService.error('Error Adding MR !!', {
                id: 'alert-mr'
              });
              console.error(e);
            },
            complete: () => {}
          });
      }
    } else {
      this.alertService.error('Please fill all required fields !!', {
        id: 'alert-mr'
      });
    }
  }
}
