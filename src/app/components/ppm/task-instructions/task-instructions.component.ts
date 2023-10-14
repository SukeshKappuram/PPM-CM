import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from './../../../services/navigation.service';
import { SweetAlertService } from './../../../services/sweet-alert.service';

@Component({
  selector: 'app-task-instructions',
  templateUrl: './task-instructions.component.html',
  styleUrls: ['./task-instructions.component.scss']
})
export class TaskInstructionsComponent extends CommonComponent
{

  constructor(
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService,
    private router: Router
  ) {
    super();
    this.getTaskInstructions();
  }

  getTaskInstructions(): void {
    this.apiService.GetTaskInstructions().subscribe({
      next: (result) => {
        let gridData = result;
        let idColumn = gridData?.configuration?.columns?.find(
          (col: any) => col.mappingColumn == 'id'
        );
        if(idColumn){
          idColumn.columnFormat = this.ColumnFormat.CONCATINATED_TEXT;
        }
        this.gridData = gridData;
      },
      error: (e) => {
        this.alertService.error('Error retreving instructions !!', {
          id: 'alert-taskInstructions'
        },e);
        console.error(e);
      },
      complete: () => {}
    });
  }

  modifyInstruction(item: any): void {
    let navState = this.navService.getNavigationState();
    navState.currentInstructionId = item ? item.id : 0;
    this.navService.setNavigationState(navState);
    this.router.navigate([Navigate.EDIT_INSTRUCTION]);
  }

  deleteInstruction(item: any): void {
    this.apiService
      .DeleteTaskInstructionById(
        'TaskInstructions/AddOrUpdateTaskInstruction',
        item.id
      )
      .subscribe({
        next: (result) => {
          if (result.isSuccess) {
            this.alertService.success(result.message, {
              id: 'alert-taskInstructions'
            });
            this.getTaskInstructions();
          }
        },
        error: (e) => {
          this.alertService.error('Error retreving instructions !!', {
            id: 'alert-taskInstructions'
          },e);
          console.error(e);
        },
        complete: () => {}
      });
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
