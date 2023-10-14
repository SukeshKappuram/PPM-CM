import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApiService } from './../../../../services/api.service';
import { IUserAccess } from 'src/app/models/interfaces/auth/IUserAccess';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from './../../../../services/navigation.service';
import { OnHoldComponent } from '../on-hold/on-hold.component';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { ServiceStatus } from './../../../../models/enums/ServiceStatus.enum';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { WorkStatus } from 'src/app/models/enums/WorkStatus.enum';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent {
  @Input() resources: any[] = [];
  @Input() masterResources: any;
  @Input() statusId: any;
  @Input() api: any;
  @Input() urlnode: string = 'TaskLog';
  @Input() isLocked: boolean = false;
  @Input() userAccess: IUserAccess | any;
  @Output() statusChanged: EventEmitter<any> = new EventEmitter();
  navState: any;

  ServiceStatus = ServiceStatus;
  WorkStatus = WorkStatus;

  showAcceptedDate: boolean = false;
  showRejectedDate: boolean = false;
  showStartDate: boolean = false;
  showContainDate: boolean = false;
  showFinishDate: boolean = false;
  currentResourceId: number = -1;

  constructor(
    public dialog: MatDialog,
    private navService: NavigationService,
    private router: Router,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private datePipe: LocalizedDatePipe
  ) {
    this.navState = this.navService.getNavigationState();
    // this.getResources();
  }

  openPopup(type: number) {
    let masterResources = this.masterResources;
    if (this.resources) {
      masterResources.data = this.masterResources.data.filter((m: any) =>
        this.resources?.every((r: any) => r.resourceId !== m.id)
      );
    }
    let title = '';
    let data = {};
    switch (type) {
      case 1:
        title = 'Resource Details';
        data = {
          resources: masterResources,
          taskLogId: this.navState.currentLogId,
          existingResources: this.resources
        };
        break;
      case 2:
        title = 'Instruction';
        data = {};
    }
    const dialogRef = this.dialog
      .open(PopupComponent, {
        data: {
          title: title,
          contentId: type,
          contentName: 'Resources',
          projectId: 0,
          data: data,
          api: this.api
        },
        autoFocus: true,
        maxHeight: '90vh',
        width: '80vw',
        disableClose: false
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (!this.resources || this.resources?.length === 0) {
            this.statusChanged.emit();
          }
          this.getResources();
        }
      });
  }

  edit(index: number) {
    this.currentResourceId = index;
    if (this.resources[index].workStatusId >= WorkStatus.ACCEPTED) {
      this.showAcceptedDate = true;
    }
    if (this.resources[index].workStatusId === WorkStatus.REJECTED) {
      this.showRejectedDate = true;
    }
    if (this.resources[index].workStatusId >= WorkStatus.STARTED) {
      this.showStartDate = true;
    }
    if (this.resources[index].workStatusId === WorkStatus.FINISHED) {
      this.showFinishDate = true;
    }
    if (this.resources[index].workStatusId === WorkStatus.CONTAINED) {
      this.showContainDate = true;
    }
  }

  save(index: number): void {
    if (this.showAcceptedDate && !this.isLocked) {
      if (
        this.resources[index].acceptedDate < this.resources[index].assignedDate
      ) {
        this.alertService.error(
          'Accepted Date cannot be lessthan to assigned date',
          { id: 'alert-resource' }
        );
        return;
      }
      this.accept(index, true);
      this.showAcceptedDate = false;
    }
    if (this.showRejectedDate) {
      if (
        this.resources[index].rejectedDate <
          this.resources[index].assignedDate ||
        this.resources[index].rejectedDate < this.resources[index].acceptedDate
      ) {
        this.alertService.error(
          'Rejected Date cannot be lessthan assigned/accepted date',
          { id: 'alert-resource' }
        );
        return;
      }
      this.reject(index, true);
      this.showRejectedDate = false;
    }
    if (this.showStartDate) {
      if (
        this.resources[index].startedDate < this.resources[index].acceptedDate
      ) {
        this.alertService.error('Start Date cannot be lessthan accepted date', {
          id: 'alert-resource'
        });
        return;
      }
      this.start(index, true);
      this.showStartDate = false;
    }
    if (this.showContainDate) {
      if (
        this.resources[index].containDate < this.resources[index].startedDate
      ) {
        this.alertService.error(
          'Contain Date cannot be lessthan started date',
          {
            id: 'alert-resource'
          }
        );
        return;
      }
      this.contained(index, true);
      this.showContainDate = false;
    }
    if (this.showFinishDate) {
      if (
        this.resources[index].finishedDate < this.resources[index].startedDate
      ) {
        this.alertService.error('Finish Date cannot be lessthan start date', {
          id: 'alert-resource'
        });
        return;
      }
      this.end(index, true);
      this.showFinishDate = false;
    }
    this.currentResourceId = -1;
  }

  accept(index: any, isNonDefault: boolean = false) {
    if (
      !this.isLocked &&
      !isNonDefault &&
      this.resources[index].workStatusId === WorkStatus.REJECTED
    ) {
      this.alertService.error('Already Rejected', { id: 'alert-resource' });
      return;
    }
    if (
      !this.isLocked &&
      !isNonDefault &&
      this.resources[index].workStatusId > WorkStatus.ASSIGNED
    ) {
      this.alertService.error('Already Accepted', { id: 'alert-resource' });
      return;
    }
    if (
      !this.isLocked &&
      this.statusId !== ServiceStatus.CLOSED &&
      ((!isNonDefault &&
        this.resources[index].workStatusId == WorkStatus.ASSIGNED) ||
        (isNonDefault &&
          this.resources[index].workStatusId >= WorkStatus.ASSIGNED))
    ) {
      let resource = {
        taskLogId: this.navState.currentLogId,
        resourceId: this.resources[index].resourceId,
        actionId: WorkStatus.ACCEPTED,
        actionDate:
          this.resources[index].acceptedDate ??
          this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm', true)
      };
      if (!isNonDefault) {
        this.resetEdit();
      }
      this.addOrUpdateResource(
        resource,
        this.showStartDate || this.showRejectedDate
      );
    }
  }

  remove(index: any) {
    if (!this.isLocked && this.statusId !== ServiceStatus.CLOSED) {
      let taskLogId = this.navState.currentLogId;
      let resourceId = this.resources[index].resourceId;
      this.apiService
        .DeleteTaskLogResourceById(taskLogId, resourceId, this.api)
        .subscribe({
          next: (result) => {
            if (result) {
              this.alertService
                .success('Resource Deleted Successfully !!', {
                  id: 'alert-resource'
                })
                .then(() => this.getResources());
            }
          },
          error: (e) => {
            this.alertService.error('Error Deleting Resource !!', {
              id: 'alert-resource'
            },e);
            console.error(e);
          },
          complete: () => {}
        });
    }
  }

  reject(index: any, isNonDefault: boolean = false) {
    if (
      !this.isLocked &&
      !isNonDefault &&
      this.resources[index].workStatusId === WorkStatus.REJECTED
    ) {
      this.alertService.error('Already Rejected', { id: 'alert-resource' });
      return;
    }
    if (
      !this.isLocked &&
      this.statusId !== ServiceStatus.CLOSED &&
      !isNonDefault &&
      this.resources[index].workStatusId >= WorkStatus.ASSIGNED &&
      this.resources[index].workStatusId < WorkStatus.REJECTED
    ) {
      const dialogRef = this.dialog
        .open(OnHoldComponent, {
          data: {
            title: 'Reason for Rejection',
            contentId: 2,
            data: ''
          },
          autoFocus: true,
          maxHeight: '90vh',
          width: '80vw',
          disableClose: true
        })
        .afterClosed()
        .subscribe((rejectedReason: any) => {
          if (rejectedReason?.comments) {
            let resource = {
              taskLogId: this.navState.currentLogId,
              resourceId: this.resources[index].resourceId,
              actionId: WorkStatus.REJECTED,
              actionDate:
                this.resources[index].rejectedDate ??
                this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm', true),
              comments: rejectedReason?.comments
            };
            this.addOrUpdateResource(resource);
          }
        });
    } else if (
      !this.isLocked &&
      isNonDefault &&
      this.resources[index].workStatusId >= WorkStatus.ASSIGNED &&
      this.resources[index].workStatusId <= WorkStatus.REJECTED
    ) {
      let resource = {
        taskLogId: this.navState.currentLogId,
        resourceId: this.resources[index].resourceId,
        actionId: WorkStatus.REJECTED,
        actionDate:
          this.resources[index].rejectedDate ??
          this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm', true),
        comments: this.resources[index].comments
      };
      if (!isNonDefault) {
        this.resetEdit();
      }
      this.addOrUpdateResource(resource);
    }
  }

  start(index: any, isNonDefault: boolean = false) {
    if (
      !this.isLocked &&
      !isNonDefault &&
      this.resources[index].workStatusId >= WorkStatus.STARTED
    ) {
      this.alertService.error('Already Started', { id: 'alert-resource' });
      return;
    }
    if (
      !this.isLocked &&
      this.statusId !== ServiceStatus.CLOSED &&
      ((!isNonDefault &&
        this.resources[index].workStatusId === WorkStatus.ACCEPTED) ||
        isNonDefault)
    ) {
      let resource = {
        taskLogId: this.navState.currentLogId,
        resourceId: this.resources[index].resourceId,
        actionId: WorkStatus.STARTED,
        actionDate:
          this.resources[index].startedDate ??
          this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm', true)
      };
      if (!isNonDefault) {
        this.resetEdit();
      }
      this.addOrUpdateResource(resource, this.showContainDate);
    }
  }

  contained(index: any, isNonDefault: boolean = false) {
    if (
      !this.isLocked &&
      !isNonDefault &&
      this.resources[index].workStatusId >= WorkStatus.CONTAINED
    ) {
      this.alertService.error('Already Ended', { id: 'alert-resource' });
      return;
    }
    if (
      !this.isLocked &&
      this.statusId !== ServiceStatus.CLOSED &&
      ((!isNonDefault &&
        this.resources[index].workStatusId === WorkStatus.STARTED) ||
        isNonDefault)
    ) {
      let resource = {
        taskLogId: this.navState.currentLogId,
        resourceId: this.resources[index].resourceId,
        actionId: WorkStatus.CONTAINED,
        actionDate:
          this.resources[index].containDate ??
          this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm', true)
      };
      if (!isNonDefault) {
        this.resetEdit();
      }
      this.addOrUpdateResource(resource, this.showFinishDate);
    }
  }

  end(index: any, isNonDefault: boolean = false) {
    if (
      !this.isLocked &&
      !isNonDefault &&
      this.resources[index].workStatusId === WorkStatus.FINISHED
    ) {
      this.alertService.error('Already Ended', { id: 'alert-resource' });
      return;
    }
    if (
      !this.isLocked &&
      this.statusId !== ServiceStatus.CLOSED &&
      ((!isNonDefault &&
        (this.resources[index].workStatusId === WorkStatus.CONTAINED ||
          this.resources[index].workStatusId === WorkStatus.STARTED)) ||
        isNonDefault)
    ) {
      let resource = {
        taskLogId: this.navState.currentLogId,
        resourceId: this.resources[index].resourceId,
        actionId: WorkStatus.FINISHED,
        actionDate:
          this.resources[index].finishedDate ??
          this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm', true)
      };
      if (!isNonDefault) {
        this.resetEdit();
      }
      this.addOrUpdateResource(resource);
    }
  }

  resetEdit() {
    this.showAcceptedDate = false;
    this.showRejectedDate = false;
    this.showStartDate = false;
    this.showContainDate = false;
    this.showFinishDate = false;
    this.currentResourceId = -1;
  }

  addOrUpdateResource(resource: any, hasNext: boolean = false): void {
    this.apiService
      .AddOrUpdateSubTaskData(
        'TaskLogOperations/SaveTaskLogResourceInfo',
        resource,
        this.api
      )
      .subscribe({
        next: (result) => {
          if (!hasNext) {
            this.alertService.success('Resources Saved Successfully !!', {
              id: 'alert-resource'
            });
            this.getResources();
          }
        },
        error: (e) => {
          this.alertService.error('Error Updating Resources', {
            id: 'alert-resource'
          },e);
        },
        complete: () => {}
      });
  }

  getResources(): void {
    this.apiService
      .GetTaskLog(
        `${this.urlnode}/GetTaskLogAdditionalInfo/${this.navState.currentLogId}`,
        this.api
      )
      .subscribe({
        next: (result) => {
          this.resources = result.taskResources;
        },
        error: (e) => {
          this.alertService.error('Error Retrieving Sub Task Data !!', {
            id: 'alert-resource'
          },e);
          console.error(e);
        },
        complete: () => {}
      });
  }
}
