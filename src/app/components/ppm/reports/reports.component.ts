import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CommonComponent } from 'src/app/components/common/common.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends CommonComponent {
  reportsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    this.reportsForm = fb.group({
      fromDate: [],
      toDate: [],
      contract: [],
      building: [],
      loc: [],
      range: []
    });
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
