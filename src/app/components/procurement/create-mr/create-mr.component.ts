import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { TextFieldComponent } from 'src/app/shared/text-field/text-field.component';
import buttons from '../../../helpers/buttons.json';
import { CommonComponent } from '../../common/common.component';
import { PopupComponent } from '../../stock-management/stock-issue/popup/popup.component';

@Component({
  selector: 'app-create-mr',
  templateUrl: './create-mr.component.html',
  styleUrls: ['./create-mr.component.scss']
})
export class CreateMrComponent extends CommonComponent {
  generalForm!: FormGroup;
  financialForm!: FormGroup;
  requestorDetailsForm!: FormGroup;
  mrItemsForm!: FormGroup;
  mrItemDetails: any = [];
  selectedWorkOrder: any;
  selectedResource: any;
  mrId: any;

  @ViewChild('wodate') wodate!: TextFieldComponent;

  user: any;
  presentDate: Date = new Date();
  mrDetails: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private authService: AuthService,
    private router: Router,
    private localizedDatePipe: LocalizedDatePipe,
    private dialog: MatDialog
  ) {
    super();
    this.navState = this.navService.getNavigationState();
    this.buttons = buttons.procurement.createMr;
    this.userAccess = this.convertToUserAccess(this.navState.subMenu);
    if (this.router.url.includes('create')) {
      this.navState.currentMRId = 0;
      this.navService.setNavigationState(this.navState);
      if (!this.userAccess?.canAdd) {
        this.buttons = this.buttons.filter((button) => button.id !== 'Save');
      }
    } else if (!this.userAccess?.canUpdate) {
      this.buttons = this.buttons.filter((button) => button.id !== 'Save');
    }
    this.user = this.authService.getUser();
    this.getData();
  }

  getData(): void {
    this.mrId = this.pad(this.navState.currentMRId, 4);
    this.apiService
      .getMrDetails(
        'MaterialRequest/GetMRDetailsById/' + this.navState.currentMRId
      )
      .subscribe({
        next: (result: any) => {
          this.masterData = result;
          this.filteredData = { ...this.masterData };
          this.mrDetails = result?.mrDetails ? result?.mrDetails[0] : null;
          this.mrItemDetails = this.mrDetails?.mrDetailItems ?? [];
          this.generalForm = this.fb.group({
            project: [this.mrDetails?.projectId, Validators.required],
            workOrderType: [this.mrDetails?.taskTypeId, Validators.required],
            workOrderNo: [this.mrDetails?.taskLogId, Validators.required],
            workOrderDt: [],
            serviceReportNo: [this.mrDetails?.serviceReportNo],
            serviceReportDt: [this.mrDetails?.serviceReportDate],
            location: [],
            description: [this.mrDetails?.description]
          });

          this.financialForm = this.fb.group({
            financeCode: [this.mrDetails?.financeCodeId],
            costCenter: [this.mrDetails?.costCenterId],
            costCode: [this.mrDetails?.costCodeId]
          });

          this.requestorDetailsForm = this.fb.group({
            contactPerson: [this.mrDetails?.reportedById],
            designation: [this.mrDetails?.deptName],
            contactNo: [this.mrDetails?.reportedByMobile],
            contactEmail: [this.mrDetails?.reportedByEmail]
          });

          this.mrItemsForm = this.fb.group({
            items: this.fb.array([])
          });
          if (this.mrDetails?.id > 0) {
            this.user = this.mrDetails?.createdByName;
            this.presentDate = this.mrDetails?.createdDate;
            this.isEditable = false;
            this.buttons = this.buttons.filter((b) => b.label !== 'Save');
            // this.getWorkOrderInfo({ id: this.mrDetails?.taskTypeId });
            this.workOrderSelected({ id: this.mrDetails?.taskLogId });
            this.resourceSelected({ id: this.mrDetails?.reportedById });
            this.mrItemDetails.forEach((element: any) => {
              element['isSaved'] = true;
              this.add(element);
            });
          }
          this.isDataLoaded = true;
        },
        error: (e: any) => {
          this.alertService.error('Error Retrieving MR Data !!', {
            id: 'create-mr'
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

  add(mrItem: any = null) {
    if (mrItem) {
    } else {
      this.mrItemDetails.push({ id: 0 });
    }
    const itemForm = this.fb.group({
      id: [mrItem?.id ?? 0, Validators.required],
      mrTypeId: [mrItem?.mrTypeId, Validators.required],
      stockId: [mrItem?.stockId],
      sparePartCode: [mrItem?.stockId],
      availableQty: [mrItem?.availableQty ?? 0],
      requiredQty: [mrItem?.requiredQty ?? 0, Validators.required],
      unitPrice: [mrItem?.unitPrice ?? 0, Validators.required],
      totalPrice: [mrItem?.totalPrice ?? 0, Validators.required],
      stockName: [mrItem?.stockName],
      remarks: [mrItem?.remarks],
      mrCode: [this.mrDetails?.code],
      mrDate: [
        mrItem
          ? this.localizedDatePipe.transform(this.mrDetails?.createdDate)
          : ''
      ]
    });
    this.items.push(itemForm);
  }

  openData(item: any): void {
    this.apiService
      .GetStockList(
        `MaterialRequest/MRStockPrices/${item.stockId}/${this.mrId}/${item.id}`
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

  override save(): void {
    let mrItems: any[] = [];
    if (this.generalForm.valid || this.requestorDetailsForm.valid) {
      let formData = {
        ...this.generalForm.value,
        ...this.financialForm.value,
        ...this.requestorDetailsForm.value
      };
      if (this.mrItemsForm.valid) {
        let formArrayData = this.mrItemsForm.value;
        let itemFormDetails = {};
        formArrayData?.items.forEach((element: any) => {
          let mrTypeId = element?.mrTypeId?.id ?? element?.mrTypeId;
          if (mrTypeId == 1) {
            itemFormDetails = {
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
          } else {
            itemFormDetails = {
              id: element?.id,
              mrTypeId: element?.mrTypeId?.id ?? element?.mrTypeId,
              stockName: element?.stockName,
              availableQty: 0,
              requiredQty: element?.requiredQty,
              unitPrice: element?.unitPrice,
              totalPrice: isNaN(element.totalPrice) ? 0 : element.totalPrice,
              remarks: element?.remarks
            };
          }
          mrItems.push(itemFormDetails);
        });
      } else {
        this.alertService.error('Please fill all required fields !!', {
          id: 'alert-mr'
        });
      }
      let mrSaveDetails = {
        id: this.navState.currentMRId,
        projectId: formData.project.id ?? formData.project,
        taskTypeId: formData.workOrderType?.id ?? formData.workOrderType,
        taskLogId: formData.workOrderNo?.id ?? formData.workOrderNo,
        description: formData.description,
        financeCodeId: formData.financeCode?.id ?? formData.financeCode,
        costCodeId: formData.costCode?.id ?? formData.costCode,
        costCenterId: formData.costCenter?.id ?? formData.costCenter,
        reportedById: this.selectedResource?.id,
        reportedByName: this.selectedResource?.name,
        reportedByEmail: this.selectedResource?.email,
        reportedByMobile: this.selectedResource?.mobile,
        deptName: this.selectedResource?.designation,
        code: '',
        createdDate: new Date(),
        serviceReportNo: formData.serviceReportNo,
        serviceReportDate: formData.serviceReportDt,
        mrDetailItems: mrItems.filter((item) => item.id === 0)
      };
      if (mrSaveDetails.mrDetailItems.some((s: any) => s.requiredQty <= 0)) {
        this.alertService.error('Requested quantity should be greater than 0', {
          id: 'alert-stock'
        });
        return;
      } else {
        this.apiService
          .AddOrUpdateTaskLog(
            `MaterialRequest/CreateMaterialRequest`,
            mrSaveDetails,
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
                    // this.getData();
                    this.isEditable = false;
                    this.buttons = this.buttons.filter(
                      (b) => b.label !== 'Save'
                    );
                    this.mrId = this.pad(result, 4);
                    this.mrItemDetails.forEach((element: any) => {
                      element['isSaved'] = true;
                    });
                  });
              } else if (result === -1) {
                this.alertService.warn('Add atleast one MR record!!', {
                  id: 'alert-mr'
                });
              } else {
                this.alertService.warn('Could not add MR !!', {
                  id: 'alert-mr'
                });
              }
            },
            error: (e) => {
              this.alertService.error('Error Adding MR !!', {
                id: 'alert-mr'
              },e);
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

  delete(index: number): void {
    this.items.removeAt(index);
    if (index > -1) {
      this.mrItemDetails.splice(index, 1);
    }
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
          taskLogId: formValue?.taskLogId,
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

  getWorkOrderInfo(event: any): void {
    let formData = this.generalForm?.value;
    this.generalForm.controls['workOrderNo'].setValue(null);
    this.generalForm.controls['location'].setValue(null);
    this.selectedWorkOrder = null;
    this.selectedResource = null;
    this.apiService
      .getMrDetailsInfo(
        'MaterialRequest/GetMRAdditionalInfo',
        this.mrDetails?.projectId ?? formData?.project?.id,
        event.id
      )
      .subscribe({
        next: (result: any) => {
          this.masterData['resources'] = result.resources;
          this.masterData['workOrders'] = result.workOrders;
          this.masterData['stocks'] = result.stocks;
          this.filteredData = { ...this.masterData };
          if (this.mrDetails?.id > 0) {
            this.workOrderSelected({ id: this.mrDetails?.taskLogId });
            this.resourceSelected({ id: this.mrDetails?.reportedById });
          }
        }
      });
  }

  projectSelected(project: any) {
    this.generalForm.controls['workOrderType'].setValue(null);
    this.generalForm.controls['workOrderNo'].setValue(null);
    this.generalForm.controls['workOrderDt'].setValue(null);
    this.generalForm.controls['location'].setValue(null);
    this.requestorDetailsForm.controls['contactPerson'].setValue(null);
    this.requestorDetailsForm.controls['designation'].setValue(null);
    this.requestorDetailsForm.controls['contactNo'].setValue(null);
    this.requestorDetailsForm.controls['contactEmail'].setValue(null);
    this.selectedWorkOrder = null;
    this.selectedResource = null;
    this.masterData['resources'] = [];
    this.masterData['workOrders'] = [];
    this.masterData['stocks'] = [];
    this.filteredData = { ...this.masterData };
  }

  workOrderSelected(workorder: any): void {
    this.selectedWorkOrder = this.filteredData?.workOrders?.find(
      (wo: any) => wo.id === workorder.id
    );
    if (this.selectedWorkOrder) {
      let formData = this.generalForm.value;
      this.selectedWorkOrder.workOrderDate = this.localizedDatePipe.transform(
        this.selectedWorkOrder?.workOrderDate
      );
      formData['workOrderDt'] = this.selectedWorkOrder?.workOrderDate;
      formData['location'] = this.selectedWorkOrder?.location;
      this.generalForm.patchValue(formData);
    }
  }

  resourceSelected(resource: any): void {
    this.selectedResource = this.filteredData?.resources?.find(
      (r: any) => r.id === resource.id
    );
    let formData = this.requestorDetailsForm.value;
    formData['contactPerson'] = resource.id;
    formData['designation'] = this.selectedResource?.designation;
    formData['email'] = this.selectedResource?.email;
    formData['mobile'] = this.selectedResource?.mobile;
    this.generalForm.patchValue(formData);
  }

  protected override buttonClicked(buttonType: any): void {
    if (buttonType == 'Save') {
      this.save();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.VIEW_MR_GRID]);
    }
  }
}
