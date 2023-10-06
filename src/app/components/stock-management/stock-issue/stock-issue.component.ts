import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import buttons from '../../../helpers/buttons.json';
import { CommonComponent } from '../../common/common.component';
import { PopupComponent } from './popup/popup.component';

@Component({
  selector: 'app-stock-issue',
  templateUrl: './stock-issue.component.html',
  styleUrls: ['./stock-issue.component.scss']
})
export class StockIssueComponent extends CommonComponent {
  generalForm!: FormGroup;
  stockCollectedBy!: FormGroup;
  stockItems!: FormGroup;
  issueId: number = 0;
  selectedEmployee: any;
  currentUser: any;
  issuedDate: any;

  stockIssuedData: any;
  stockIssuedItems: any[] = [];
  selectedFiles: FileList[] = [];
  stocks: any[] = [];
  filteredStocks: any[] = [];
  selectedProject: any;
  mrDetails: any;
  stockIssuedId: number = 0;
  workorderDetails: any;
  isMRCodesDropDown: boolean = false;
  selectedMrNo: any;
  isMrItems: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private router: Router,
    private authService: AuthService,
    private datePipe: LocalizedDatePipe,
    private dialog: MatDialog
  ) {
    super();
    this.buttons = buttons.stock.stocks.issue;
    let navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(navState?.subMenu);
    if (!navState.isEditable) {
      navState.currentMasterId = 0;
      if(!this.userAccess.canAdd){
        this.buttons = this.buttons.filter((b: any) => b.id !== 'Save');
      }
    }
    this.getData(navState.currentMasterId);
  }

  getData(masterId: any): void {
    this.stockIssuedId = masterId;
    let user = this.authService.getUser();
    this.currentUser = user?.userName;
    let navState = this.navService.getNavigationState();
    if (!navState.isEditable) {
      navState.currentMasterId = 0;
    }
    this.isDataLoaded = false;
    this.apiService
      .GetStockGeneralInfoById(`StockIssued/StockIssuedDetails/${masterId}`)
      .subscribe({
        next: (result: any) => {
          this.masterData = result;
          this.filteredData = { ...this.masterData };
          this.filteredData.stocks = [];
          this.stockIssuedData = result?.stockIssuedData;
          this.issuedDate = new Date();
          this.issueId = this.stockIssuedData?.id ?? navState.currentMasterId;
          this.stockIssuedItems = result?.stockIssuedItems ?? [];
          this.stockItems = this.fb.group({
            items: this.fb.array([])
          });
          if (this.stockIssuedData?.jobNumberId) {
            this.workorderDetails = this.masterData?.workOrders[0];
            this.currentUser =
              this.stockIssuedData?.issuedBy ?? this.currentUser;
            this.issuedDate = this.stockIssuedData
              ? this.stockIssuedData?.issueDate
              : new Date();
            this.stockIssuedData.serviceReportDate = this.datePipe.transform(
              this.stockIssuedData.serviceReportDate,
              'dd-MMM-yyyy'
            );
            this.buttons = buttons.stock.stocks.create.filter(
              (btn) => btn.label !== 'Save'
            );
            this.getStockAdditionalData(
              this.stockIssuedData?.projectId,
              this.stockIssuedData?.id,
              true
            );
          }
          this.generalForm = this.fb.group({
            id: [navState.currentMasterId, Validators.required],
            project: [this.stockIssuedData?.projectId, Validators.required],
            workOrderType: [
              this.workorderDetails?.workOrderTypeId,
              Validators.required
            ],
            mrNo: [this.stockIssuedData?.mrNumber],
            workOrderNo: [
              this.stockIssuedData?.jobNumberId,
              Validators.required
            ],
            buildingName: [this.workorderDetails?.building],
            location: [this.workorderDetails?.location],
            financeCode: [this.stockIssuedData?.financeCodeId],
            costCenter: [this.stockIssuedData?.costCenterId],
            costCode: [this.stockIssuedData?.costCodeId],
            serviceReportNo: [this.stockIssuedData?.serviceReportNo],
            serviceReportDate: [this.stockIssuedData?.serviceReportDate],
            approverId: [
              this.stockIssuedData?.approvedById,
              Validators.required
            ],
            comments: [this.stockIssuedData?.comments]
          });
          if (this.stockIssuedData?.collectedById) {
            this.employeeSelected({
              id: this.stockIssuedData?.collectedById?.toString()
            });
            this.stockIssuedData.collectionDate = this.datePipe.transform(
              this.stockIssuedData.collectionDate,
              'dd-MMM-yyyy'
            );
          }

          this.stockCollectedBy = this.fb.group({
            employeeId: [
              this.stockIssuedData?.collectedById,
              Validators.required
            ],
            name: [this.stockIssuedData?.name],
            mobile: [this.stockIssuedData?.mobile],
            email: [this.stockIssuedData?.email],
            designation: [this.stockIssuedData?.designation],
            dateOfCollection: [
              this.stockIssuedData?.collectionDate,
              Validators.required
            ],
            digitalSignature: [this.stockIssuedData?.digitalSignature]
          });
          this.generalForm?.valueChanges.subscribe(() => {
            this.updateButtons(
              this.generalForm?.valid && this.stockCollectedBy?.valid
            );
          });
          this.stockCollectedBy?.valueChanges.subscribe(() => {
            this.updateButtons(
              this.generalForm?.valid && this.stockCollectedBy?.valid
            );
          });
          this.isDataLoaded = true;
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

  getWorkOrderInfo(event: any): void {
    let formData = this.generalForm?.value;
    this.generalForm.controls['workOrderNo'].setValue(null);
    this.generalForm.controls['location'].setValue(null);
    this.apiService
      .getMrDetailsInfo(
        'StockIssued/WorkOrdersByProjectId',
        formData?.project?.id,
        event.id
      )
      .subscribe({
        next: (result: any) => {
          this.masterData['resources'] = result.resources;
          this.masterData['workOrders'] = result.workOrders;
          this.masterData['stocks'] = result.stocks;
          this.filteredData = { ...this.masterData };
          // if (this.mrDetails?.id > 0) {
          //   this.workOrderSelected({ id: this.mrDetails?.taskLogId });
          //   this.resourceSelected({ id: this.mrDetails?.reportedById });
          // }
        }
      });
  }

  buttonClicked(buttonType: any): void {
    if (buttonType == 'Save') {
      this.save();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.VIEW_STOCKISSUE_GRID]);
    }
  }

  override updateButtons(enabelSave: boolean): void {
    let saveBtn = this.buttons.find((btn) => btn.label === 'Save');
    if (saveBtn) {
      saveBtn.isDisabled = !enabelSave;
      this.buttons[1] = saveBtn;
    }
  }

  updateAvailableStock(
    index: any,
    itemForm: FormGroup | any,
    event: any
  ): void {
    let formValue = itemForm.value;
    let stock = this.masterData?.stocks.find(
      (stock: any) => stock.id === event.id
    );
    this.stockIssuedItems[index].stockId = event.id;
    formValue['stockId'] = stock.id;
    this.stockIssuedItems[index].sparePartCode = stock.sparePartCode;
    formValue['sparePartCode'] = stock.sparePartCode;
    this.stockIssuedItems[index].stockGroupId = stock.groupId;
    formValue['stockGroupId'] = stock.groupId;
    this.stockIssuedItems[index].stockName = stock.name;
    formValue['stockName'] = stock.name;
    this.stockIssuedItems[index].availableStock = stock.availableStock;
    formValue['availableQty'] = stock.availableStock;
    this.stockIssuedItems[index].requestedQty = stock.requestedQty;
    formValue['requestedQty'] = stock.requestedQty;
    this.stockIssuedItems[index].previousIssuedQty =
      stock.previousIssuedQty ?? 0;
    formValue['previousIssuedQty'] = stock.previousIssuedQty ?? 0;
    this.stockIssuedItems[index].issuedQty = stock.issuedQty;
    formValue['issuedQty'] = stock.issuedQty;
    this.stockIssuedItems[index].unitPrice = stock.unitPrice;
    formValue['unitPrice'] = stock.unitPrice;
    itemForm.patchValue(formValue);
  }

  projectSelected(project: any) {
    this.resetForm();
    this.selectedProject = project;
    if (this.selectedProject?.id) {
      this.getStockAdditionalData(this.selectedProject?.id, this.stockIssuedId);
    }
  }

  getStockAdditionalData(
    projectId: any,
    stockIssuedId: any,
    showFormWithData: boolean = false
  ) {
    this.apiService
      .StockIssuedAdditionalDetails(
        'StockIssued/StockIssuedAdditionalDetails',
        stockIssuedId,
        projectId
      )
      .subscribe({
        next: (result: any) => {
          this.masterData = { ...this.masterData, ...result };
          this.filteredData = { ...this.masterData };
          if (showFormWithData) {
            if (this.stockIssuedItems?.length > 0) {
              this.stockIssuedItems.forEach((element: any) => {
                element['isSaved'] = true;
                this.add(element);
              });
            }
          }
        }
      });
  }

  typeSelected(type: any) {
    if (type?.id > 0) {
      this.apiService
        .GetStockGeneralInfoById(
          `StockIssued/WorkOrdersByProjectId/${this.selectedProject.id}/${type.id}`
        )
        .subscribe({
          next: (result: any) => {
            this.generalForm.controls['workOrderNo'].setValue(null);
            this.masterData['workOrders'] = result;
            this.filteredData = { ...this.masterData };
            if (this.stockIssuedData?.id > 0) {
              this.workorderDetails = this.masterData?.workOrders?.find(
                (task: any) => task.taskLogId === type.id
              );
              let formData = this.generalForm?.value;
              if (formData) {
                (formData['buildingName'] = this.workorderDetails?.building),
                  (formData['location'] = this.workorderDetails?.location),
                  this.generalForm?.patchValue(formData);
              }
            } else {
              this.resetForm(true);
            }
          },
          error: (e: any) => {
            this.alertService.error('Error retreving stock !!', {
              id: 'alert-stock'
            });
            console.error(e);
          },
          complete: () => { }
        });
    } else {
      this.resetForm(true);
    }
  }

  jobSelected(job: any) {
    if (job.taskLogId > 0) {
      this.apiService
        .GetStockGeneralInfoById(
          `StockIssued/MRCodesByWorkOrder/${job.taskLogId}`
        )
        .subscribe({
          next: (result: any) => {
            this.isMRCodesDropDown = true;
            this.masterData['mrCodes'] = result;
            this.filteredData = { ...this.masterData };
            this.filteredData = { ...this.masterData };
            this.workorderDetails = job;
            let formData = this.generalForm?.value;
            if (formData) {
              formData['buildingName'] = this.workorderDetails?.building;
              formData['location'] = this.workorderDetails?.location;
              this.generalForm?.patchValue(formData);
            }
          },
          error: (e: any) => {
            this.alertService.error('Error retreving stock !!', {
              id: 'alert-stock'
            });
            console.error(e);
          },
          complete: () => { }
        });
    } else {
      this.resetForm(true, true);
    }
  }

  employeeSelected(employee: any) {
    this.selectedEmployee = this.masterData?.stockCollectedBy.find(
      (res: any) => res.id === parseInt(employee.id)
    );
    let formData = this.stockCollectedBy?.value;
    if (formData) {
      formData['name'] = this.selectedEmployee?.name;
      formData['mobile'] = this.selectedEmployee?.mobile;
      formData['email'] = this.selectedEmployee?.email;
      formData['designation'] = this.selectedEmployee?.designation;
      this.stockCollectedBy?.patchValue(formData);
    }
  }

  filterStocks(index: any, itemForm: any, event: any) {
    this.stocks[index] = this.masterData?.stocks.filter(
      (s: any) => s.groupId === event.id
    );
    itemForm = itemForm as FormGroup;
    itemForm.reset();
    this.stockIssuedItems[index].stockId = '';
    this.filteredStocks = [...this.stocks];
  }

  valueChange(event: any) {
    this.selectedMrNo = this.masterData?.mrCodes.find(
      (c: any) => c.name === event
    )?.id;
    this.getMrDetails();
  }

  getMrDetails() {
    this.isMrItems = true;
    if (this.selectedMrNo) {
      this.apiService
        .getMRWorkOrderDetails(
          'StockIssued/MRWorkOrderDetailsById',
          this.selectedMrNo
        )
        .subscribe({
          next: (result: any) => {
            this.workorderDetails = result?.workOrder;
            this.mrDetails = result?.mrDetails;
            this.stockIssuedItems = result?.mrItems ?? [];
            this.masterData['workOrders'] = [this.workorderDetails];
            this.filteredData = { ...this.masterData };
            let formData = this.generalForm?.value;
            if (formData) {
              formData['buildingName'] = this.workorderDetails?.building;
              formData['location'] = this.workorderDetails?.location;
              formData['workOrderNo'] = this.workorderDetails?.taskLogId;
              formData['workOrderType'] =
                this.workorderDetails?.workOrderTypeId;
              formData['financeCode'] = this.mrDetails?.financeCodeId;
              formData['costCenter'] = this.mrDetails?.costCenterId;
              formData['costCode'] = this.mrDetails?.costCodeId;
              formData['serviceReportDate'] = this.mrDetails?.serviceReportDate;
              formData['serviceReportNo'] = this.mrDetails?.serviceReportNo;
              this.generalForm?.patchValue(formData);
            }
            if (this.stockIssuedItems?.length > 0) {
              this.stockIssuedItems.forEach((element: any) => {
                element['isSaved'] = true;
                this.add(element);
              });
            }
            this.isDataLoaded = true;
          },
          error: (e: any) => {
            this.alertService.error('Error Retrieving MR Data !!', {
              id: 'stock-issue'
            });
            console.error(e);
          },
          complete: () => { }
        });
    }
  }

  filterChange(event: any) {
    if (event?.length === 3) {
      this.apiService
        .getMRDetails(
          'StockIssued/MRCodesByNumber',
          event,
          this.selectedProject?.id
        )
        .subscribe({
          next: (result: any) => {
            this.masterData['mrCodes'] = result;
            this.filteredData = { ...this.masterData };
          },
          error: (e: any) => {
            this.alertService.error('Error Retrieving MR Data !!', {
              id: 'stock-issue'
            });
            console.error(e);
          },
          complete: () => { }
        });
    } else {
      this.handleFilter(event, 'mrCodes');
    }
  }

  override save(): void {
    let stockIssue = {
      ...this.generalForm.value,
      ...this.stockCollectedBy.value
    };
    stockIssue['mrNumberId'] = this.selectedMrNo;
    stockIssue['issueDate'] = this.datePipe.transform(
      stockIssue.issueDate,
      'yyyy-MM-dd',
      true
    );
    stockIssue['signatureImage'] =
      this.selectedFiles.length > 0 ? this.selectedFiles[0] : '';
    stockIssue['stockIssuedItems'] = this.items.value;
    if (stockIssue.stockIssuedItems.length == 0) {
      this.alertService.error('Atleast one stock item has to be issued', {
        id: 'alert-stock'
      });
      return;
    } else if (
      stockIssue.stockIssuedItems.every(
        (s: any) =>
          (s.issuedQty === 0 &&
            (s?.availableStock !== 0 || s?.availableQty !== 0)) ||
          (s.issuedQty === 0 && s.previousIssuedQty < s?.requestedQty)
      )
    ) {
      this.alertService.error('Issued quantity should be greater than 0', {
        id: 'alert-stock'
      });
      return;
    } else if (
      stockIssue.stockIssuedItems.every((s: any) => s.previousIssuedQty < 0)
    ) {
      this.alertService.error(
        'Previous Issued quantity should be equal or greater than 0',
        {
          id: 'alert-stock'
        }
      );
      return;
    } else if (
      stockIssue.stockIssuedItems.every(
        (s: any) =>
          parseInt(s.previousIssuedQty) + parseInt(s.issuedQty) >
          parseInt(s.requestedQty) || s.issuedQty > s.availableQty
      )
    ) {
      this.alertService.error(
        'Issued quantity should be less than or equal to available quantity or sum of previous issued quantity and issued quantity should be less than or equal to requested quantity',
        {
          id: 'alert-stock'
        }
      );
      return;
    } else {
      this.apiService
        .saveStockIssued(
          'StockIssued/AddOrUpdateStockIssuedDetails',
          stockIssue
        )
        .subscribe({
          next: (result: any) => {
            if (result[0]?.isSuccess) {
              this.issueId = result[0].resultId;
              this.alertService
                .success(result[0]?.resultMessage, {
                  id: 'alert-stock'
                })
                .then(() => {
                  this.router.navigate([Navigate.VIEW_STOCKISSUE_GRID]);
                });
              this.updateButtons(false);
            } else {
              this.alertService.error(result[0]?.resultMessage, {
                id: 'alert-stock'
              });
            }
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
  }

  get items() {
    return this.stockItems?.controls['items'] as FormArray;
  }

  add(stockIssuedItem?: any): void {
    if (stockIssuedItem) {
      let stocks = this.masterData?.stocks?.filter(
        (s: any) => s.groupId === stockIssuedItem?.stockGroupId
      );
      this.stocks.push(stocks);
      this.filteredStocks.push(stocks);
    } else {
      this.stockIssuedItems.push({ id: 0, previousIssuedQty: 0 });
      this.stocks.push([]);
      this.filteredStocks = [...this.stocks];
    }
    let stock = this.masterData?.stocks?.find(
      (s: any) => s.id === stockIssuedItem?.stockId
    );
    if (stock) {
      stockIssuedItem['stockName'] = stock.name;
      stockIssuedItem['totalPrice'] = stockIssuedItem?.issuedAmount;
      this.stockIssuedItems[this.stocks.length - 1]['stockName'] = stock.name;
      this.stockIssuedItems[this.stocks.length - 1]['availableStock'] =
        stock.availableStock;
    }
    const itemForm = this.fb.group({
      id: [stockIssuedItem?.id ?? 0, Validators.required],
      group: [stockIssuedItem?.stockGroupId, Validators.required],
      stockId: [stockIssuedItem?.stockId, Validators.required],
      sparePartCode: [stockIssuedItem?.stockId, Validators.required],
      stockName: [stockIssuedItem?.stockName, Validators.required],
      availableQty: [stockIssuedItem?.availableQty ?? stock?.availableStock],
      requestedQty: [stockIssuedItem?.requestedQty],
      previousIssuedQty: [stockIssuedItem?.previousIssuedQty ?? 0],
      issuedQty: [stockIssuedItem?.issuedQty, Validators.required],
      unitPrice: [stockIssuedItem?.unitPrice ?? 0, Validators.required],
      totalPrice: [stockIssuedItem?.totalPrice, Validators.required],
      remarks: [stockIssuedItem?.remarks]
    });
    this.items.push(itemForm);
  }

  getIssueDetails(form: any): FormGroup {
    return form;
  }

  calculateTotal(index: number, itemForm: any, value: any = '0') {
    if (this.issueId === 0) {
      let currentIndex = 0;
      this.stockIssuedItems?.forEach((element: any) => {
        if (currentIndex === index) {
          itemForm = itemForm as FormGroup;
          let stock = this.masterData?.stocks.find(
            (stock: any) => stock.id === parseInt(element?.stockId)
          );
          if (value) {
            this.apiService
              .getStockIssueDetails(
                'StockIssued/IssuingStockPrice',
                stock.id,
                value
              )
              .subscribe({
                next: (result: any) => {
                  this.stockIssuedItems[index].totalPrice = result?.totalPrice;
                  itemForm.controls['totalPrice'].setValue(result?.totalPrice);
                },
                error: (e: any) => {
                  this.alertService.error('Error Retrieving MR Data !!', {
                    id: 'stock-issue'
                  });
                  console.error(e);
                },
                complete: () => { }
              });
          } else {
            this.stockIssuedItems[index].totalPrice = 0;
            itemForm.controls['totalPrice'].setValue(0);
          }
        }
        currentIndex++;
      });
    }
  }

  getMax(availableQty: any, requestedQty: any): number {
    if (availableQty && requestedQty) {
      return availableQty < requestedQty ? availableQty : requestedQty;
    }
    return availableQty ?? 0;
  }

  delete(index: number): void {
    this.stocks = this.stocks.filter((e, i) => i !== index);
    this.stockIssuedItems = this.stockIssuedItems.filter((e, i) => i !== index);
    this.items.removeAt(index);
    this.filteredStocks = [...this.stocks];
  }

  selectFiles(event: any) {
    this.selectedFiles = event.target.files;
  }

  getFileName(file: any) {
    return file.name;
  }

  handleFilterForStocks(
    dataSet: any,
    value: any,
    type: any,
    key: string = 'name',
    secondaryKey: string = 'code',
    index?: number
  ): void {
    if (index != undefined || index != null) {
      this.filteredStocks[index] = dataSet.filter(
        (s: any) =>
          s[key]?.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          (secondaryKey in s &&
            s[secondaryKey]?.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      );
    }
  }

  mrSelectedDetails(mrData: any) {
    this.selectedMrNo = mrData?.id;
    if (this.selectedProject?.id) {
      this.getMrDetails();
    } else {
      this.alertService.error('Please Select Project !!', {
        id: 'stock-issue'
      });
    }
  }

  openData(item: any): void {
    this.apiService
      .GetStockList(
        `StockIssued/IssuedStockPrices/${item.stockId}/${this.issueId}/${item.id}`
      )
      .subscribe({
        next: (result: any) => {
          if (result?.stockPriceBatches) {
            const dialogRef = this.dialog
              .open(PopupComponent, {
                data: {
                  title: 'Stock Details',
                  stockIssuedDetails: result?.stockPriceBatches
                },
                autoFocus: true,
                maxHeight: '90vh',
                width: '80vw',
                disableClose: false
              })
              .afterClosed()
              .subscribe((result) => { });
          }
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

  resetForm(isWorkOrderType: boolean = false, isWorkOrder: boolean = false) {
    if (!isWorkOrderType) {
      this.generalForm.controls['workOrderType'].setValue(null);
      this.masterData['stockGroups'] = [];
      this.masterData['stocks'] = [];
      this.masterData['workOrders'] = [];
    }
    if (!isWorkOrder) {
      this.generalForm.controls['workOrderNo'].setValue(null);
      this.masterData['mrCodes'] = [];
      this.isMRCodesDropDown = false;
    } else {
      this.isMRCodesDropDown = true;
    }
    this.generalForm.controls['mrNo'].setValue(null);
    this.generalForm.controls['approverId'].setValue(null);
    this.generalForm.controls['buildingName'].setValue('');
    this.generalForm.controls['location'].setValue('');
    this.generalForm.controls['serviceReportNo'].setValue('');
    this.generalForm.controls['serviceReportDate'].setValue('');
    this.generalForm.controls['financeCode'].setValue(null);
    this.generalForm.controls['costCenter'].setValue(null);
    this.generalForm.controls['costCode'].setValue(null);
    this.generalForm.controls['comments'].setValue(null);
    this.stockCollectedBy.controls['employeeId'].setValue(null);
    this.stockCollectedBy.controls['name'].setValue('');
    this.stockCollectedBy.controls['mobile'].setValue('');
    this.stockCollectedBy.controls['email'].setValue('');
    this.stockCollectedBy.controls['designation'].setValue('');
    this.stockCollectedBy.controls['dateOfCollection'].setValue('');
    this.items.clear();
    this.items.reset();
    this.workorderDetails = null;
    this.selectedEmployee = null;
    this.stockIssuedData = null;
    this.stocks = [];
    this.filteredStocks = [...this.stocks];
    this.filteredData = { ...this.masterData };
    this.isMrItems = false;
  }
}
