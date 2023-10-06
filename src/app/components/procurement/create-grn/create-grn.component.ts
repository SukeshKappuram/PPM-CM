import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import buttons from '../../../helpers/buttons.json';
import { CommonComponent } from '../../common/common.component';

@Component({
  selector: 'app-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.scss']
})
export class CreateGrnComponent extends CommonComponent {
  grnDate: Date = new Date();
  grnDetailsForm!: FormGroup;
  grnItemDetailsForm!: FormGroup;

  grnDetails: any;
  grnItemDetails: any;
  receivedBy: string = '';
  grandTotal: number = 0;
  stocks: any[] = [];
  isAddAllowed: boolean = true;

  grnId: number = 0;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private authService: AuthService,
    private navService: NavigationService,
    private router: Router,
    private datePipe: LocalizedDatePipe
  ) {
    super();
    this.buttons = buttons.procurement.grn.createGrn;
    this.filteredData['stockDetails'] = [...this.stocks];
    this.getData();
    this.navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(this.navState?.subMenu);
    if(!this.userAccess?.canAdd){
      this.buttons = this.buttons.filter(button => button.id !== 'Save');
    }
    if(!this.userAccess?.canApprove){
      this.buttons = this.buttons.filter(button => button.id !== 'Approve');
    }
    this.config.defaultCountryCode = this.navState?.currentAccount?.mainMobileCode ?? this.config.defaultCountryCode;
  }

  buttonClicked(buttonType: any): void {
    if (buttonType === 'Save') {
      this.save();
    } else if (buttonType === 'Cancel') {
      this.router.navigate([Navigate.VIEW_GRN_GRID]);
    } else if (buttonType === 'Approve' && this.userAccess?.canApprove) {
      this.apiService
        .approveProcurement('GRN/ApproveGRN', this.grnId)
        .subscribe({
          next: (result) => {
            if (result > 0) {
              this.alertService
                .success('GRN Details Approved Successfully!!', {
                  id: 'alert-grn'
                })
                .then(() => {
                  this.router.navigate([Navigate.VIEW_GRN_GRID]);
                });
            }
          },
          error: (e) => {
            this.alertService.error('Error retreving GRN Details !!', {
              id: 'alert-grn'
            });
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  get items() {
    return this.grnItemDetailsForm?.controls['items'] as FormArray;
  }

  add(grnItemDetails?: any): void {
    if (!grnItemDetails) {
      this.grnItemDetails.push({ id: 0 });
      this.stocks.push([]);
      this.isAddAllowed = false;
    } else {
      this.stocks.push(
        this.masterData?.stocks.filter(
          (s: any) => s.groupId === grnItemDetails?.stockGroupId
        )
      );
    }
    this.filteredData['stockDetails'] = [...this.stocks];

    const itemForm = this.fb.group({
      id: [grnItemDetails?.id ?? 0, Validators.required],
      grnDetailsId: [
        grnItemDetails?.grnDetailsId ?? this.grnId,
        Validators.required
      ],
      stockGroup: [grnItemDetails?.stockGroupId, Validators.required],
      sparePartCode: [grnItemDetails?.stockId, Validators.required],
      stockName: [grnItemDetails?.stockId, Validators.required],
      receivedQty: [grnItemDetails?.receivedQty, Validators.required],
      unitPrice: [grnItemDetails?.unitPrice, Validators.required],
      total: [grnItemDetails?.total, Validators.required],
      productCode: [grnItemDetails?.productCode],
      dateOfDelivery: [grnItemDetails?.dateOfDelivery, Validators.required],
      remarks: [grnItemDetails?.remarks]
    });
    this.items.push(itemForm);
  }

  getData(): void {
    let navState = this.navService.getNavigationState();
    if (!navState.isEditable) {
      navState.currentMasterId = 0;
    }
    this.isDataLoaded = false;
    this.apiService
      .getProcurementById('GRN/GRNDetails', navState.currentMasterId)
      .subscribe({
        next: (result) => {
          this.masterData = result;
          this.filteredData = {...this.masterData};
          this.grnDetails = result.grnDetails;
          if(!this.userAccess?.canUpdate){
            this.buttons = this.buttons.filter(button => button.id !== 'Save');
          }
          this.isEditable = (this.userAccess?.canAdd || this.userAccess?.canUpdate) && !this.grnDetails?.isApproved;
          if (this.grnDetails?.isApproved) {
            this.buttons = this.buttons.filter(
              (button) => button.label !== 'Save'
            );
            let approveBtn = this.buttons.find(
              (button) => button.label === 'Approve'
            );
            if (approveBtn) {
              approveBtn.isDisabled = this.grnDetails?.isApproved;
            }
          }
          if (navState.currentMasterId === 0) {
            this.buttons = buttons.procurement.grn.createGrn.filter(
              (button) => button.label !== 'Approve'
            );
            this.isAddAllowed = false;
          }
          this.grnItemDetails = result?.grnItemDetails ?? [];
          this.grnId = this.grnDetails?.id ?? navState.currentMasterId;
          let user = this.authService.getUser();
          this.receivedBy = this.grnDetails?.receivedByName ?? user?.userName;
          this.grnDetailsForm = this.fb.group({
            purchaseOrderNumber: [
              this.grnDetails?.purchaseOrder,
              Validators.required
            ],
            doNumber: [this.grnDetails?.doNumber, Validators.required],
            invoiceNumber: [
              this.grnDetails?.invoiceNumber,
              Validators.required
            ],
            mobileCode: [this.grnDetails?.mobileCode],
            contactNumber: [
              this.grnDetails?.contactNumber,[
              Validators.required,
              Validators.pattern('^[0-9]*$'),
              Validators.minLength(6),
              Validators.maxLength(15)]
            ],
            contactName: [this.grnDetails?.contactName, Validators.required]
          });
          let mobileCode =
            this.grnDetails?.mobileCode ?? this.config?.defaultCountryCode;
          this.mobileCode = this.masterData?.countries?.find(
            (c: any) => c.dialCode === mobileCode
          );
          this.grnItemDetailsForm = this.fb.group({
            grandTotal: [this.grandTotal, Validators.required],
            items: this.fb.array([])
          });
          this.grnItemDetails?.forEach((element: any) => {
            element.dateOfDelivery = this.datePipe.transform(
              element.dateOfDelivery,
              'dd-MMM-yyyy'
            );
            this.add(element);
            this.grandTotal += element.total;
          });
          this.isDataLoaded = true;
        },
        error: (e) => {
          this.alertService.error('Error retreving GRN Details !!', {
            id: 'alert-grn'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  getGrnDetails(form: any): FormGroup {
    return form;
  }

  override save(): void {
    let procurement = this.grnDetailsForm.value;
    let procData = {
      id: this.grnId,
      receivedDate: CommonHelper.convertDateToUTC(new Date()),
      receivedByName: 'Admin',
      purchaseOrder: procurement?.purchaseOrderNumber,
      doNumber: procurement?.doNumber,
      invoiceNumber: procurement?.invoiceNumber,
      contactNumber: procurement?.contactNumber,
      mobileCode: this.mobileCode?.dialCode,
      contactName: procurement?.contactName
    };
    this.apiService
      .addProcurement('GRN/AddOrUpdateGRNDetails', procData)
      .subscribe({
        next: (result) => {
          this.grnId = result;
          this.isAddAllowed = true;
          this.alertService.success('Saved GRN Details Successfully!!', {
            id: 'alert-grn'
          });
        },
        error: (e) => {
          this.alertService.error('Error Saving GRN Details !!', {
            id: 'alert-grn'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  filterStocks(index: any, event: any) {
    this.stocks[index] = this.masterData?.stocks.filter(
      (s: any) => s.groupId === (event.id)
    );
    this.filteredData['stockDetails'] = [...this.stocks];
  }

  updateStockCode(index: any, itemForm: any, event: any): void {
    let form = this.items.controls[index];
    itemForm = itemForm as FormGroup;
    this.grnItemDetails[index].stockId = event.id;
    itemForm.get('sparePartCode').setValue(event.id);
    itemForm.get('stockName').setValue(event.id);
  }

  calculateTotal(index: number, itemForm: any, type: any, event: any, itemFormValue: any) {
    let value = event.target.value;
    let currentIndex = 0;
    this.grandTotal = 0;
    this.grnItemDetails?.forEach((element: any) => {
      if (currentIndex === index) {
        itemForm = itemForm as FormGroup;
        (element.receivedQty = type === 1 ? value : element?.receivedQty),
          (element.unitPrice = type === 2 ? value : element?.unitPrice),
          (element.total =
            !isNaN(element.receivedQty) && !isNaN(element.unitPrice)
              ? parseInt(element.receivedQty) * parseFloat(element.unitPrice)
              : element?.total);
        let itemFormDetails = {
          id: element?.id,
          grnDetailsId: this.grnId,
          stockGroupId: element?.stockGroup,
          stockGroupName: element?.stockName,
          stockId: element?.sparePartCode,
          receivedQty: element?.receivedQty,
          unitPrice: element?.unitPrice,
          total: element.total,
          productCode: itemFormValue?.productCode,
          dateOfDelivery: itemFormValue?.dateOfDelivery,
          remarks: element?.remarks
        };
        itemForm.patchValue(itemFormDetails);
      }
      this.grandTotal += isNaN(parseFloat(element.total))? 0 : parseFloat(element.total);
      currentIndex++;
    });
  }

  saveItem(index: number, itemForm: any): void {
    itemForm = itemForm as FormGroup;
    if (itemForm.valid) {
      let itemFormValue = itemForm.value;
      let itemFormDetails = {
        id: itemFormValue?.id ?? 0,
        grnDetailsId: this.grnId,
        stockGroupId: itemFormValue?.stockGroup?.id,
        stockGroupName: itemFormValue?.stockName,
        stockId: itemFormValue?.sparePartCode,
        receivedQty: itemFormValue?.receivedQty,
        unitPrice: itemFormValue?.unitPrice,
        total: itemFormValue?.total,
        productCode: itemFormValue?.productCode,
        dateOfDelivery:
          itemFormValue?.dateOfDelivery
        ,
        remarks: itemFormValue?.remarks
      };
      this.apiService
        .addProcurement('GRN/AddOrUpdateGRNItemDetails', itemFormDetails)
        .subscribe({
          next: (result) => {
            if (result > 0) {
              if (itemFormDetails.id === 0) {
                this.isAddAllowed = true;
              }
              this.alertService
                .success('Saved GRN Details Successfully!!', {
                  id: 'alert-grn'
                })
                .then(() => {
                  this.buttons = buttons.procurement.grn.createGrn;
                  this.grnItemDetails[index].id = result;
                  let formValue = itemForm.value;
                  formValue.id = result;
                  itemForm.patchValue(formValue);
                });
            } else {
              this.isAddAllowed = false;
            }
          },
          error: (e) => {
            this.alertService.error('Error Saving GRN Details !!', {
              id: 'alert-grn'
            });
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  delete(index: number): void {
    this.items.removeAt(index);
  }
}
