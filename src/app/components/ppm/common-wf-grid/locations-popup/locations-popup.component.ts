import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiEndpoints } from 'src/app/models/enums/api-endpoints.enum';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-locations-popup',
  templateUrl: './locations-popup.component.html',
  styleUrls: ['./locations-popup.component.scss']
})
export class LocationsPopupComponent {
  gridData: any;
  constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.apiService.getLocations(`Common/GetLocationInfo/${data.taskId}`, ApiEndpoints.SCHEDULERAPI).subscribe({
      next: (result) => {
        this.gridData = result;
      },
      error: (e) => {
        // this.alertService.error('Error Retrieving Asset !!', {
        //   id: 'alert-scheduler'
        // });
        console.error(e);
      },
      complete: () => {}
    });
  }
}
