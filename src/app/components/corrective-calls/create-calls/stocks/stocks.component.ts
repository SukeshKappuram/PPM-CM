import { Component } from '@angular/core';
import { CommonComponent } from 'src/app/components/common/common.component';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent extends CommonComponent {
  constructor(
    private apiService: ApiService,
    private navService: NavigationService,
    private alertService: SweetAlertService
  ) {
    super();
    this.getData();
  }

  getData(): void {
    let navState = this.navService.getNavigationState();
    this.apiService
      .GetTaskLog('TaskLog/GetStockIssuedData/' + navState.currentLogId)
      .subscribe({
        next: (result: any) => {
          this.gridData = result;
        },
        error: (e: any) => {
          this.alertService.error('Error Retrieving Emails Data !!', {
            id: 'sub-task'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
