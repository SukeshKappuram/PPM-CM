import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from 'src/app/components/common/common.component';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PopupHrmsComponent } from '../../popup-hrms/popup-hrms.component';


@Component({

  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.css']
})
export class CreateAnnouncementComponent extends CommonComponent {

  generalForm!: FormGroup;
  uploadedAttachments: any = [];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private apiService: ApiService, private navService: NavigationService) {
    super();
    this.generalForm = fb.group({
      refNo: [],
      announcementType: [],
      issueDate: [],
      expiryDate: [],
      title: [],
    });
    this.getData();
  }

  getData() {
    let navState = this.navService.getNavigationState();
    this.apiService
      .getAnnouncementDetails('Announcement/GetAnnouncementDetailsById', navState.currentLogId)
      .subscribe({
        next: (result: any) => {
          this.masterData = result;
          this.filteredData = { ...this.masterData};
        }
      })
  }
  public value = `
        <p>
            The Kendo UI Angular Editor allows your users to edit HTML in a familiar, user-friendly way.<br />
            In this version, the Editor provides the core HTML editing engine which includes basic text formatting, hyperlinks, and lists.
            The widget <strong>outputs identical HTML</strong> across all major browsers, follows
            accessibility standards, and provides API for content manipulation.
        </p>
        <div style="display: inline-block; width: 39%;">
            <p>Features include:</p>
            <ul>
                <li>Text formatting</li>
                <li>Bulleted and numbered lists</li>
                <li>Hyperlinks</li>
                <li>Cross-browser support</li>
                <li>Identical HTML output across browsers</li>
                <li>Inserting and resizing images</li>
            </ul>
        </div>
        <div style="display: inline-block; width: 60%; vertical-align: top;">
            <img src="https://demos.telerik.com/kendo-ui/content/web/editor/tenerife.png" width="100%" style="min-width: 10px; min-height: 10px;" alt="Tenerife" />
        </div>
    `;
  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }

  onSelect(event: any) {
    let attachment = {
      id: 0,
      taskLogId: 0,
      fileName: '',
      file: event.addedFiles[0],
      type: '',
      resourceUrl: '',
      extension: event.addedFiles[0].name?.substring(
        event.addedFiles[0].name?.indexOf('.') + 1
      )
    };
    this.uploadedAttachments.push(attachment);
    // if (this.type === 'Doc') {
    //   <!--this.addAttachments(); -->
    // }

  }
  showRecepients(){
    const dialogRef = this.dialog
      .open(PopupHrmsComponent, {
        data: {
          title: 'Recepients'
          // task: task,
          // masterData: this.data,
          // taskLogId: this.taskLogId,
          // api: this.api
        },
        autoFocus: true,
        maxHeight: '90vh',
        width: '80vw',
        disableClose: false
      })
      .afterClosed()
      .subscribe((result: any) => {
      });
  }
}
