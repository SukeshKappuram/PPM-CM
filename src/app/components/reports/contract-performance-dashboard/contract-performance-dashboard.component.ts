import { CommonComponent } from 'src/app/components/common/common.component';
import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-cp-dashboard',
  templateUrl: './contract-performance-dashboard.component.html',
  styleUrls: ['./contract-performance-dashboard.component.scss']
})
export class ContractPerformanceDashboardComponent extends CommonComponent{
  isCollapsed: boolean = true;
  constructor(private navService: NavigationService) {
    super();
    this.navState = navService?.getNavigationState();
  }
  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
