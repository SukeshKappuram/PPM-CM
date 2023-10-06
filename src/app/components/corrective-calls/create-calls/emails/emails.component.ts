import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from 'src/app/services/navigation.service';
import { PopupComponent } from './popup/popup.component';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent implements OnInit {
  @Input() api: any;
  @Input() urlnode: string = 'TaskLog';
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  currentEmail: any;
  emails: any;
  pageHeader: any;
  constructor(public dialog: MatDialog, private apiService: ApiService, private navService: NavigationService, private alertService: SweetAlertService) {

  }

  ngOnInit(): void {
    this.getData();
  }

  getLogGrid(id: any) {
    if (this.currentEmail == id) {
      this.currentEmail = -1;
    }
    else
    {
    this.currentEmail = id;
    }
  }

  openPopup() {
    const dialogRef = this.dialog
      .open(PopupComponent, {
        data: {
          title: 'New Mail',
        },
        autoFocus: true,
        maxHeight: '90vh',
        width: '80vw',
        disableClose: false,
      })
      .afterClosed()
      .subscribe((result) => { });
  }

  cssClassByIndex(index: number) {
    return 'OpenCases' + index;
  }

  getData(): void {
    let navState = this.navService.getNavigationState();
    this.apiService.GetTaskLog(`${this.urlnode}/GetTaskLogAdditionalInfo/${navState.currentLogId}`, this.api).subscribe({
      next: (result: any) => {
        this.dataChanged.emit(result);
        this.emails = result.emails;
      },
      error: (e: any) => {
        this.alertService.error('Error Retrieving Emails Data !!', {
          id: 'sub-task'
        });
        console.error(e);
      },
      complete: () => { }
    });
  }
}
