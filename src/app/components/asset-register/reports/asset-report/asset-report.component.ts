import { Component } from '@angular/core';
import { CommonComponent } from 'src/app/components/common/common.component';

@Component({
  selector: 'app-asset-report',
  templateUrl: './asset-report.component.html',
  styleUrls: ['./asset-report.component.scss']
})
export class AssetReportComponent extends CommonComponent{
  details = {
    headers: [
      { fieldLabel: 'Month', fieldName: 'repaymentDate' },
      { fieldLabel: 'Opening Balance', fieldName: 'loanAmountRemaining' },
      { fieldLabel: 'Interest', fieldName: 'interest' },
      { fieldLabel: 'Principle Repayment', fieldName: 'principal' },
      { fieldLabel: 'Closing Balance', fieldName: 'closingBalance' }
    ],
    data: [
      {
        repaymentDate: 'A',
        loanAmountRemaining: 'an'
      },
      {
        repaymentDate: 'B',
        loanAmountRemaining: 'HSH'
      }
    ]
  };

  dataForExcel: any = [];

  constructor() {
    super();
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
