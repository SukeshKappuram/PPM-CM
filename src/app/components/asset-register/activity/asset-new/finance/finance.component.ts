import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/components/common/common.component';
import { CommonHelper } from 'src/app/helpers/CommonHelper';
import { IAssetData } from 'src/app/models/interfaces/IAssetData';
import { IMasterData } from 'src/app/models/interfaces/IMasterData';
import { IUserAccess } from 'src/app/models/interfaces/auth/IUserAccess';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent extends CommonComponent implements OnInit, AfterViewChecked {
  financeForm!: FormGroup;
  financials: any;
  isReducingDepreciation: boolean = false;

  @Input() override masterData!: IMasterData;
  @Input() saveAt: string = '';
  @Input() override isEditable: boolean = false;
  @ViewChild('costCenterList') costCenterDD!: DropdownComponent;
  @ViewChild('costCodeList') costCodeDD!: DropdownComponent;
  @Input() override userAccess !: IUserAccess;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    public datepipe: DatePipe
  ) {
    super();
    let assetDetails: IAssetData =
      this.navService.getNavigationState().assetData;
    this.financials = assetDetails?.financials;
  }

  ngOnInit() {
    this.filteredData = { ...this.masterData };
    if (this.financials) {
      if (this.financials.purchaseDate) {
        this.financials.purchaseDate = this.datepipe.transform(
          new Date(this.financials.purchaseDate),
          'yyyy-MM-dd'
        );
      }
      if (this.financials.acquiredDate) {
        this.financials.acquiredDate = this.datepipe.transform(
          new Date(this.financials.acquiredDate),
          'yyyy-MM-dd'
        );
      }
      if (this.financials.writeOffDate) {
        this.financials.writeOffDate = this.datepipe.transform(
          new Date(this.financials.writeOffDate),
          'yyyy-MM-dd'
        );
      }
      if (this.financials.warrantyDate) {
        this.financials.warrantyDate = this.datepipe.transform(
          new Date(this.financials.warrantyDate),
          'yyyy-MM-dd'
        );
      }
    } else {
      this.financials = {};
    }
    this.financeForm = this.fb.group({
      financeCode: [this.financials?.financeCodeId],
      costCenter: [this.financials?.costCenterId],
      costCode: [this.financials?.costCodeId],
      purchaseDate: [this.financials?.purchaseDate ?? ''],
      purchaseCost: [this.financials?.purchaseCostValue ?? ''],
      acquiredDate: [this.financials?.acquiredDate ?? ''],
      writeOffDate: [this.financials?.writeOffDate ?? ''],
      writeOffValue: [this.financials?.writeOffValue ?? ''],
      warrantyDate: [this.financials?.warrantyDate ?? ''],
      depreciationMethod: [this.financials?.depreciationMethodId],
      reduceDepreciation: [this.financials?.reduceDepreciation ?? 0],
      depreciationValue: [this.financials?.depreciationValue ?? ''],
      currentValue: [this.financials?.currentValue ?? ''],
      assetLifeTerm: [this.financials?.assetLifeTerm ?? ''],
      supplier: [this.financials?.vendorId]
    });

    this.financeForm.valueChanges.subscribe(
      () => (this.isFormValid = this.financeForm.valid)
    );
  }

  ngAfterViewChecked(): void {
    this.calculateDepreciation(null, null, null);
  }

  override save(): void {
    let navState = this.navService.getNavigationState();
    if (this.financeForm.valid) {
      const finance = this.financeForm.value;
      this.formData.financeCodeId = finance.financeCode?.id;
      this.formData.costCenterId = finance.costCenter?.id;
      this.formData.costCodeId = finance.costCode?.id;
      this.formData.purchaseDate = CommonHelper.convertDateToUTC(finance.purchaseDate);
      this.formData.purchaseCostValue = finance.purchaseCost;
      this.formData.acquiredDate = CommonHelper.convertDateToUTC(finance.acquiredDate);
      this.formData.writeOffDate = CommonHelper.convertDateToUTC(finance.writeOffDate);
      this.formData.writeOffValue = finance.writeOffValue;
      this.formData.warrantyDate = CommonHelper.convertDateToUTC(finance.warrantyDate);
      this.formData.depreciationMethodId = finance.depreciationMethod?.id;
      this.formData.reduceDepreciation = finance.reduceDepreciation;
      this.formData.depreciationValue = finance.depreciationValue;
      this.formData.currentValue = finance.currentValue;
      this.formData.vendorId = finance.supplier?.id;
      this.formData.assetLifeTerm = finance.assetLifeTerm;

      this.formData['assetId'] = navState.currentAssertId;
      this.formData['assetFinancialId'] =
        this.financials?.assetFinancialId ?? 0;
      this.apiService
        .SaveAsset(this.saveAt + 'Financial', this.formData)
        .subscribe({
          next: (result) => {
            if (result > 0) {
              this.formData['assetFinancialId'] = result;
              this.filteredData = { ...this.masterData };
              if (navState.assetData) {
                navState.assetData['financials'] = this.formData;
                this.financials = navState.assetData?.financials;
                this.navService.setNavigationState(navState);
              }
              this.alertService.success('Saved Successfully!!', {
                id: 'alert-asset'
              });
            } else {
              this.alertService.warn('Could not save !!', {
                id: 'alert-asset'
              });
            }
          },
          error: (e) => {
            this.alertService.error('Error saving !!', { id: 'alert-asset' });
            console.error(e);
          },
          complete: () => {}
        });
    } else {
    }
  }

  calculateDepreciation(
    purchasedCost: string | null,
    assetLifeTerm: string | null,
    depreciationValue: string | null
  ): void {
    let purchaseCost =
      purchasedCost ?? this.financeForm.controls['purchaseCost'].value;
    this.isReducingDepreciation =
      this.financeForm.controls['depreciationMethod'].value == 5;
    if (this.isReducingDepreciation) {
      let purchaseDate = this.financeForm.controls['purchaseDate'].value;
      let purchasedDate = new Date(purchaseDate);
      let currentDate = new Date();

      var months;
      months = (currentDate.getFullYear() - purchasedDate.getFullYear()) * 12;
      months -= purchasedDate.getMonth();
      months += currentDate.getMonth();

      let terms =
        assetLifeTerm ?? this.financeForm.controls['assetLifeTerm'].value;

      let amount = parseFloat(purchaseCost) / parseFloat(terms);
      let depreciationValue = amount * months;
      this.financials['depreciationValue'] =
        depreciationValue > parseFloat(purchaseCost)
          ? parseFloat(purchaseCost)
          : depreciationValue;
      this.financials['currentValue'] =
        parseFloat(purchaseCost) - this.financials?.depreciationValue;
    } else {
      let reduceDepreciation =
        depreciationValue ??
        this.financeForm.controls['reduceDepreciation'].value;
      if (purchaseCost && reduceDepreciation) {
        let depreciationValue =
          (parseFloat(purchaseCost) * parseFloat(reduceDepreciation)) / 100;
        this.financials['depreciationValue'] =
          depreciationValue > parseFloat(purchaseCost)
            ? parseFloat(purchaseCost)
            : depreciationValue;
        this.financials['currentValue'] =
          parseFloat(purchaseCost) - this.financials?.depreciationValue;
      }
    }
    this.financeForm.controls['depreciationValue'].patchValue(
      this.financials?.depreciationValue
    );
    this.financeForm.controls['currentValue'].patchValue(
      this.financials?.currentValue
    );
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
