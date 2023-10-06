import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DataService } from 'src/app/services/data.service';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  @Input() items: string[] = [];
  @Input() activeItem: string = '';
  @Input() isFilterApplicable: boolean = false;

  filterConfig: any = {
    isFilterApplied: true,
    noOfFiltersApplied: 1
  };

  @Output() toggleFilter:EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private ds: DataService) {
    ds.appliedFilterConfig.subscribe((config) =>{
      this.filterConfig = config;
    });
  }

  home() {
    this.router.navigate([Navigate.HOME]);
  }
}
