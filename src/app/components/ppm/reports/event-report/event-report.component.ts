import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CommonComponent } from 'src/app/components/common/common.component';
import { DataService } from 'src/app/services/data.service';
import { IButton } from 'src/app/models/interfaces/IButton';
import { Router } from '@angular/router';
import buttons from '../../../../helpers/buttons.json';

@Component({
  selector: 'app-event-report',
  templateUrl: './event-report.component.html',
  styleUrls: ['./event-report.component.scss']
})
export class EventReportComponent extends CommonComponent implements OnInit {
  plannedForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    super();
    this.plannedForm = fb.group({
      fromDt: [],
      toDt: [],
      contract: [],
      building: [],
      eventType: [],
      status: []
    });
  }

  ngOnInit() {
    this.buttons = buttons.ppm.reports.eventReports;
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
