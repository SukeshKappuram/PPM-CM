import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hrms',
  templateUrl: './hrms.component.html',
  styleUrls: ['./hrms.component.scss']
})
export class HrmsComponent {
  currrentDate: Date = new Date();
  constructor() { }

}
