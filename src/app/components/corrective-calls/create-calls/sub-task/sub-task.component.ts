import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AddTaskComponent } from './popup/popup.component';
import { ApiService } from 'src/app/services/api.service';
import { ColumnFormat } from 'src/app/models/enums/ColumnFormat.enum';
import { IGridData } from 'src/app/models/interfaces/IGridData';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from 'src/app/services/navigation.service';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.scss']
})
export class SubTaskComponent implements OnInit {
  @Input() gridData: IGridData = {
    configuration: {
      columns: [],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: true,
      canEdit: true,
      canDelete: true
    },
    data: []
  };
  @Input() data: any = {};
  @Input() taskLogId: any;
  @Input() statusId: any;
  @Input() api: any;
  @Input() urlnode: string = 'TaskLog';
  @Input() popupType: string = 'Sub Task';
  @Input() isLocked: boolean = false;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  isDataLoaded: boolean = false;
  ColumnFormat = ColumnFormat;

  ServiceStatus = ServiceStatus;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    let navState = this.navService.getNavigationState();
    this.apiService
      .GetTaskLog(
        `${this.urlnode}/GetTaskLogAdditionalInfo/${navState.currentLogId}`,
        this.api
      )
      .subscribe({
        next: (result: any) => {
          this.dataChanged.emit(result);
          this.gridData =
            (this.popupType.replace(' ', '').toLowerCase() === 'subtask'
              ? result.subTasks
              : {
                  configuration: {
                    columns: [
                      {
                        displayText: 'Id',
                        showSort: true,
                        mappingColumn: 'id',
                        showColumn: false,
                        isRequired: true,
                        columnFormat: 0
                      },
                      {
                        displayText: 'Description',
                        showSort: true,
                        mappingColumn: 'description',
                        showColumn: true,
                        isRequired: true,
                        columnFormat: 0
                      },
                      {
                        displayText: 'Escalation Date',
                        showSort: true,
                        mappingColumn: 'escalationDate',
                        showColumn: true,
                        isRequired: true,
                        columnFormat: ColumnFormat.DATE
                      }
                    ]
                  },
                  actions: {
                    canAdd: true,
                    canEdit: false,
                    canDelete: false
                  },
                  data: result.escalations
                });
                this.isDataLoaded = true;
        },
        error: (e: any) => {
          this.alertService.error(
            'Error Retrieving ' + this.popupType + ' Data !!',
            {
              id: 'sub-task'
            }
          );
          console.error(e);
        },
        complete: () => {}
      });
  }

  editSubTask(task: any = null) {
    const dialogRef = this.dialog
      .open(AddTaskComponent, {
        data: {
          title: 'Add ' + this.popupType,
          task: task,
          masterData: this.data,
          taskLogId: this.taskLogId,
          api: this.api,
          type: this.popupType
        },
        autoFocus: true,
        maxHeight: '90vh',
        width: '80vw',
        disableClose: false
      })
      .afterClosed()
      .subscribe((result: any) => {
        this.getData();
      });
  }

  deleteSubTask(id: number): void {
    this.apiService.deleteSubTask(id, this.api).subscribe({
      next: (result: any) => {
        if (result > 0) {
          this.alertService
            .success('Sub Task Deleted', {
              id: 'delete-subTask'
            })
            .then(() => this.getData());
        }
      },
      error: (e: any) => {
        this.alertService.error('Error Delete Sub Task', {
          id: 'delete-subtask'
        });
      },
      complete: () => {}
    });
  }
}
