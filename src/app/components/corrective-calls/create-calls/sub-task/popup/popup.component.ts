import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from 'src/app/components/common/common-popup/common-popup.component';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class AddTaskComponent extends CommonPopupComponent {
  taskForm: FormGroup;
  subTask: any;
  minDate: any;
  constructor(
    dialogRef: MatDialogRef<AddTaskComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private alertService: SweetAlertService
  ) {
    super(dialogRef);
    if (data?.type?.replace(' ', '')?.toLowerCase() === 'subtask') {
      this.subTask = data?.task;
      this.taskForm = fb.group({
        plannedDate: [this.subTask?.plannedDate],
        name: [this.subTask?.name],
        subTaskType: [this.subTask?.subTaskTypeId],
        status: [this.subTask?.subTaskStatusId],
        notes: [this.subTask?.notes]
      });
      this.masterData = data?.masterData;
      this.filteredData = { ...this.masterData };
    } else {
      this.taskForm = fb.group({
        description: [this.subTask?.description, Validators.required],
        escalationDate: [this.subTask?.plannedDate]
      });
    }
    let todaysDate = new Date();
    let year = todaysDate.getFullYear();
    let month = ('0' + (todaysDate.getMonth() + 1)).slice(-2); // MM
    let day = ('0' + todaysDate.getDate()).slice(-2); // DD
    this.minDate = year + '-' + month + '-' + day; // Results in "YYYY-MM-DD" for today's dat
  }

  saveSubTask() {
    if (this.taskForm.valid) {
      let subTask = this.taskForm.value;
      let task = {};
      if (this.data?.type?.replace(' ', '')?.toLowerCase() === 'subtask') {
        task = {
          id: this.data?.task?.id ?? 0,
          name: subTask.name,
          notes: subTask.notes,
          taskLogId: this.data?.taskLogId,
          subTaskTypeId: subTask.subTaskType?.id,
          subTaskStatusId: subTask.status?.id,
          plannedDate: subTask.plannedDate
        };
      } else {
        task = {
          id: this.data?.task?.id ?? 0,
          taskLogId: this.data?.taskLogId,
          description: subTask.description,
          escalationDate: subTask.escalationDate
        };
      }
      this.apiService
        .AddOrUpdateSubTaskData(
          'TaskLogOperations/' +
            (this.data?.type?.replace(' ', '').toLowerCase() === 'subtask'
              ? 'AddOrUpdateSubTaskData'
              : 'AddEscalation'),
          task,
          this.data?.api
        )
        .subscribe({
          next: (result) => {
            this.alertService.success(
              this.data?.type + ' Saved Successfully !!',
              {
                id: 'subTask-added'
              }
            );
            this.dialogRef.close();
          },
          error: (e) => {
            this.alertService.error('Error Updating ' + this.data?.type, {
              id: 'subTask-added'
            });
          },
          complete: () => {}
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
