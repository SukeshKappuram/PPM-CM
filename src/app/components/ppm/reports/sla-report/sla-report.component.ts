import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import buttons from '../../../../helpers/buttons.json';

@Component({
  selector: 'app-sla-report',
  templateUrl: './sla-report.component.html',
  styleUrls: ['./sla-report.component.scss']
})
export class SlaReportComponent extends CommonComponent implements OnInit {
  slaForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    super();
    this.slaForm = fb.group({
      fromDt: [],
      toDt: [],
      time: []
    });
  }

  ngOnInit() {
    this.buttons = buttons.ppm.reports.slaReports;
    this.userAccess = this.convertToUserAccess(this.navState?.subMenu);
    if(!this.userAccess.canExport ){
      this.buttons = this.buttons.filter(
        (button) =>
          button.id !== 'Generate-SLA-Reports' 
      );
    }
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
