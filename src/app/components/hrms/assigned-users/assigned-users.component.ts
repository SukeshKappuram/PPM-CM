import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { IGridData } from 'src/app/models/interfaces/IGridData';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { GridFilterComponent } from 'src/app/shared/grid-filter/grid-filter.component';
import { PageHeaderComponent } from 'src/app/shared/page-header/page-header.component';
import { SweetAlertService } from './../../../services/sweet-alert.service';

@Component({
  selector: 'app-assigned-users',
  templateUrl: './assigned-users.component.html',
  styleUrls: ['./assigned-users.component.scss']
})
export class AssignedUsersComponent extends CommonComponent implements OnInit {
  serviceTypeId: any;
  statusId: any;
  pageType: string = '';
  @ViewChild('gridFilter') gridFilter!: GridFilterComponent;
  @ViewChild('header') pageHeader!: PageHeaderComponent;
  schedulerData: any;
  dataList: any[] = [];
  DemoUrls: any;
  isUnderDevelopment!: boolean;
  dataFormat: any;
  additionalFieldsType: any;
  assignedUsersSelectedRows: any[] = [];
  additionalUsersSelectedRows: any[] = [];
  selectedGroupId: number = 0;
  gridDatatemp: IGridData = {
    configuration: {
      columns: [],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: false,
      canEdit: false,
      canDelete: false
    },
    data: []
  };
  additionalGridData: IGridData = {
    configuration: {
      columns: [],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: false,
      canEdit: false,
      canDelete: false
    },
    data: []
  };

  constructor(
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    public ds: DataService
  ) {
    super();
    let navState = navService.getNavigationState();
    this.pageType = navState.selectedMenu;
    this.pageTitle = navState.selectedSubMenu ?? '';
    this.config['apiUrl'] = this.route.snapshot.data['url'];
    this.config['apiEndpoint'] = this.route.snapshot.data['api'];
  }

  ngOnInit(): void {
    this.getHrGroups();
  } 

  onGroupSelectionChange(selectedItem: any) {
     this.selectedGroupId = selectedItem.id;
     if (this.selectedGroupId > 0) {     
      this.getAssignedUsers();
      this.getUnAssignedUsers();
     
    }
    else{
      this.gridData=this.gridDatatemp;
      this.additionalGridData=this.gridDatatemp;
    }
  }

  onAssignedUsersClick() {
    this.addUsersToGroup(this.assignedUsersSelectedRows.join(','),false);
  }

  onAdditionalUsersClick() {
    this.addUsersToGroup(this.additionalUsersSelectedRows.join(','),true);
  }

  addUsersToGroup(selectedUsers: string,isAddRequest:boolean) {
    this.apiService
      .AddOrRemoveUsersToGroup(this.selectedGroupId, selectedUsers,isAddRequest)
      .subscribe({
        next: (result) => {
          if (result) {
            this.getAssignedUsers();
            this.getUnAssignedUsers();
            this.assignedUsersSelectedRows=  [];
            this.additionalUsersSelectedRows=[];
          }
        },
        error: (e) => {
          this.alertService.error('Error retreving data !!', {
            id: 'talert-assignUsers'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  onAssignedUsersRowSelectionChange(event: any) {
    this.assignedUsersSelectedRows = event;
  }

  onAdditionalUsersRowSelectionChange(event: any) {
    this.additionalUsersSelectedRows = event;
  }

  getAssignedUsers(): void {
    this.gridData.configuration.columns = [];
    this.apiService.GetAssignedUsers(this.selectedGroupId).subscribe({
      next: (result) => {
        if (result) {
          this.gridData = result;
          this.gridData.data?.forEach((row: any) => {
            row.status = row.status ? this.getStatusWithClass(row.status) : '';
          });
        }
      },
      error: (e) => {
        this.alertService.error('Error retreving data !!', {
          id: 'alert-assignUsers'
        });
        console.error(e);
      },
      complete: () => {}
    });
  }

  getUnAssignedUsers(): void {
    this.additionalGridData.configuration.columns = [];
    this.apiEndpoint = this.route.snapshot.data['apiEndpoint'];
    this.apiService.GetAssignedUsers(0).subscribe({
      next: (result) => {
        if (result) {
          this.additionalGridData = result;
          this.additionalGridData.data?.forEach((row: any) => {
            row.status = row.status ? this.getStatusWithClass(row.status) : '';
          });
        }
      },
      error: (e) => {
        this.alertService.error('Error retreving data !!', {
          id: 'alert-assignUsers'
        });
        console.error(e);
      },
      complete: () => {}
    });
  }

  getHrGroups(): void {
    this.additionalGridData.configuration.columns = [];
    this.apiEndpoint = this.route.snapshot.data['apiEndpoint'];
    this.apiService.GetHrGroups('Masters/HRGroups').subscribe({
      next: (result) => {
        if (result) {
          this.dataList = result.data;
        }
      },
      error: (e) => {
        this.alertService.error('Error retreving data !!', {
          id: 'alert-assignUsers'
        });
        console.error(e);
      },
      complete: () => {}
    });
  }

  getStatusWithClass(status: string): string {
    let statusType = '';
    switch (status) {
      case 'Active':
        statusType = 'success';
        break;
      case 'InActive':
        statusType = 'warning';
        break;
    }
    return (
      '<a class="badge badge-flat badge-pill border-' +
      statusType +
      ' text-' +
      statusType +
      '">' +
      status +
      '</a>'
    );
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
