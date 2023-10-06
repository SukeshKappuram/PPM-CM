import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { IUserAccess } from 'src/app/models/interfaces/auth/IUserAccess';
import { NavigationService } from 'src/app/services/navigation.service';
import { ServiceStatus } from 'src/app/models/enums/ServiceStatus.enum';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent {
  @Input() type: string = '';
  @Input() attachments: any[] = [];
  @Input() taskLogId: number = 0;
  @Input() statusId: any;
  @Input() api: any;
  @Input() urlnode: string = 'TaskLog';
  @Input() isLocked: boolean = false;
  @Input() userAccess: IUserAccess | any;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();

  uploadedAttachments: any[] = [];
  isBeforeImage: boolean = true;

  ServiceStatus = ServiceStatus;
  base64Image: any;
  navState: any;
  constructor(
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private navService: NavigationService
  ) {
    this.navState = navService.getNavigationState();
    this.getAttachments();
  }

  onSelect(event: any) {
    let attachment = {
      id: 0,
      taskLogId: this.taskLogId,
      fileName: '',
      file: event.addedFiles[0],
      type: this.type,
      resourceUrl: '',
      extension: event.addedFiles[0].name?.substring(
        event.addedFiles[0].name?.indexOf('.') + 1
      )
    };
    this.uploadedAttachments.push(attachment);
    if (this.type === 'Doc') {
      this.addAttachments();
    }
  }

  getAttachments() {
    this.apiService
      .GetTaskLog(`${this.urlnode}/GetTaskLogAdditionalInfo/${this.navState.currentLogId}`, this.api)
      .subscribe({
        next: (result: any) => {
          this.dataChanged.emit(result);
          if (this.type === 'Doc') {
            this.attachments = result.documents;
          } else {
            this.attachments = result.images;
          }
        },
        error: (e: any) => {
          this.alertService.error('Error retreving Attachments !!', {
            id: 'alert-attachments'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  addAttachments() {
    this.uploadedAttachments.forEach((attachment) => {
      attachment['isBeforeImage'] = this.isBeforeImage;
    });
    let apiUrl = 'TaskLogOperations/AddOrUpdateTaskLogImages';
    if (this.type === 'Doc') {
      apiUrl = 'TaskLogOperations/AddOrUpdateTaskLogDocuments';
    }
    this.apiService
      .AddOrUpdateTaskLogAttachments(apiUrl, this.uploadedAttachments, this.api)
      .subscribe({
        next: (result: any) => {
          this.uploadedAttachments = [];
          this.alertService
            .success('Uploaded Attachment Sucessfully !!', {
              id: 'alert-attachments'
            })
            .then(() => this.getAttachments());
        },
        error: (e: any) => {
          this.alertService.error('Error retreving Attachments !!', {
            id: 'alert-attachments'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  deleteAttachment(attachment: any) {
    let apiUrl = 'TaskLogOperations/DeleteTaskLogImages';
    if (this.type === 'Doc') {
      apiUrl = 'TaskLogOperations/DeleteTaskLogDocuments';
    }
    let attachmentToDelete = {
      id: attachment.id,
      taskLogId: attachment.taskLogId,
      fileName: '',
      file: null,
      type: this.type,
      resourceUrl: attachment.resourceUrl,
      extension: attachment.extension
    };
    this.apiService
      .DeleteTaskLogAttachments(apiUrl, attachmentToDelete, this.api)
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.alertService
              .success('Deleted Attachment Sucessfully !!', {
                id: 'alert-attachments'
              })
              .then(() => this.getAttachments());
          }
        },
        error: (e: any) => {
          this.alertService.error('Error retreving Attachments !!', {
            id: 'alert-attachments'
          });
          console.error(e);
        },
        complete: () => {}
      });
  }

  downloadImage(img: any) {
    let fileDetails = {
      fileName: img?.fileName,
      fileUrl: img?.resourceUrl,
      fileType: img?.extension
    };
    this.apiService.downloadImgFile(fileDetails).subscribe({
      next: (result: any) => {
        let blob = new Blob([result], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(result);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = img?.fileName + '.' + img?.extension;
        link.click();
      },
      error: (e: any) => {
        this.alertService.error('Error retreving Attachments !!', {
          id: 'alert-attachments'
        });
        console.error(e);
      },
      complete: () => {}
    });
  }
}
