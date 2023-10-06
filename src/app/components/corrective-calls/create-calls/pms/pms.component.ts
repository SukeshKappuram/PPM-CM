import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ServiceType } from 'src/app/models/enums/ServiceType.enum';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-pms',
  templateUrl: './pms.component.html',
  styleUrls: ['./pms.component.scss']
})
export class PmsComponent implements OnInit {
  performanceMetrics: any;
  @Input() serviceTypeId!: ServiceType;
  @Input() api: any;
  @Input() urlnode: string = 'TaskLog';
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  ServiceType = ServiceType;

  constructor(private apiService: ApiService, private navService: NavigationService, private alertService: SweetAlertService) {

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    let navState = this.navService.getNavigationState();
    this.apiService.GetTaskLog(`${this.urlnode}/GetTaskLogAdditionalInfo/${navState.currentLogId}`, this.api).subscribe({
      next: (result: any) => {
        this.dataChanged.emit(result);
        this.performanceMetrics = result.performanceMetrics;
      },
      error: (e: any) => {
        this.alertService.error('Error Retrieving Sub Task Data !!', {
          id: 'sub-task'
        });
        console.error(e);
      },
      complete: () => { }
    });
  }
}
