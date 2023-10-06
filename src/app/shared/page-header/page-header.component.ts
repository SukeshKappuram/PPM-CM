import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Router } from '@angular/router';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { IButton } from 'src/app/models/interfaces/IButton';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnDestroy {
  @Input() pageTitle: string = '';
  @Input() pageDescription: string = '';
  @Input() items: string[] = [];
  @Input() activeItem: string = '';
  @Input() buttons: IButton[] = [];
  @Input() fill: boolean = true;
  @Input() pageTag: string = '';
  @Input() badge: string = 'badge-success';
  @Input() badgeTitle: string = '';
  @Input() isEditable: boolean = false;
  @Input() ignoreCase: boolean = false;
  @Input() isFilterable: boolean = false;
  @Output() modified = new EventEmitter<any>();
  @Output() toggleFilter:EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private navService: NavigationService) {}

  back() {
    let navigationUrl = this.navService.getLastNavigationState();
    this.router.navigate([navigationUrl??Navigate.HOME]);
  }

  ngOnDestroy(){
    console.log();
  }
}
