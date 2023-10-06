import { Component, Input, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from 'src/app/components/common/common.component';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { DataMapperComponent } from './data-mapper/data-mapper.component';

@Component({
  selector: 'app-project-privileges',
  templateUrl: './project-privileges.component.html',
  styleUrls: ['./project-privileges.component.scss']
})
export class ProjectPrivilegesComponent
  extends CommonComponent
  implements OnInit
{
  @Input() projectId: number = 0;
  showDataGrid: boolean = false;
  currentItem: any;
  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private alertService: SweetAlertService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): any {
    this.showDataGrid = false;
    this.apiService.getProjectPrivileges(this.projectId).subscribe({
      next: (result: any[]) => {
        let masterData = result;
        masterData.forEach((item: any) => {
          item.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        });
        this.masterData = masterData;
      }
    });
  }

  viewData(item: any): void {
    this.showDataGrid = true;
    this.currentItem = item;
    this.getData(item);
  }

  getData(item: any): void {
    this.gridData.configuration.columns = [];
    this.apiService
      .getProjectBuildings(this.projectId, item?.editUrl)
      .subscribe({
        next: (result: any) => {
          this.gridData = result;
        }
      });
  }

  openPopup(): void {
    let data: any = this.gridData;
    const dialogRef = this.dialog
      .open(DataMapperComponent, {
        data: {
          item: this.currentItem,
          data: data
        },
        autoFocus: true,
        maxHeight: '80vh',
        width: '500px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((item) => {
        if (item) {
          this.addOrUpdate(item);
        }
      });
  }

  addOrUpdate(data: any): void {
    let mappingId = data.privilage;
    let formData = {
      projectId: this.projectId,
      mappingIds: Array.isArray(mappingId) ? mappingId.filter((id:number) => id !== 0).join() : mappingId,
      typeId: this.currentItem?.typeId
    };
    this.apiService
      .AddOrUpdatePrivileges(`${this.currentItem?.saveUrl}`, formData)
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.alertService
              .success('Saved Successfully!!', {
                id: 'alert-privilage'
              })
              .then(() => {
                this.getData(this.currentItem);
              });
          } else {
            this.alertService.warn('Could not save !!', {
              id: 'alert-privilage'
            });
          }
        },
        error: (e) => {
          this.alertService.error('Error saving !!', { id: 'alert-privilage' });
          console.error(e);
        },
        complete: () => {}
      });
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
