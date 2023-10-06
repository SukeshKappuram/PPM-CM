import { FormBuilder, FormGroup } from '@angular/forms';

import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import buttons from '../../../helpers/buttons.json';
import { CommonComponent } from '../../common/common.component';

@Component({
  selector: 'app-grn-return',
  templateUrl: './grn-return.component.html',
  styleUrls: ['./grn-return.component.scss']
})
export class GrnReturnComponent extends CommonComponent {
  generalInformation!: FormGroup;
  grnItemDetails!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private alertService: SweetAlertService) {
    super();
    this.buttons = buttons.procurement.grn.grnReturn;
    this.generalInformation = fb.group({
      grnCode: [],
      dcNo: [],
      receivedInvoiceNo: [],
      grnReceivedDate: [],
      purchaseorder: [],
      invoiceCost: [],
      grnDescription: [],
      grnReceived: [],
      grnReceivedByMobile: [],
      grnRemarks: [],
    });


    this.grnItemDetails = fb.group({
      serialno: [],
      grnItems: [],
      receivedQty: [],
      unitPrice: [],
      total: [],
      returnQty: [],
      returnQtyCost: [],
      reasons: [],
      grnReturnStage: [],
      grnReturnDate: [],
      remarks: [],
    });
  }

  buttonClicked(event: any){
  }

}
