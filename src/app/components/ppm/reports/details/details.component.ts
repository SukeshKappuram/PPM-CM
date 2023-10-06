import { FormBuilder, FormGroup } from '@angular/forms';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends CommonComponent{
  detailsForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    super();
    this.detailsForm = fb.group({
      fromDate: [],
      toDate: [],
      contract: [],
      status: []
    });
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
