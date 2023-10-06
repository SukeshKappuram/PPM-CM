import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from 'src/app/services/api.service';
import { IAssetData } from 'src/app/models/interfaces/IAssetData';
import { IUserAccess } from 'src/app/models/interfaces/auth/IUserAccess';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {
  identifications: any[] = [];
  newIdentifications: any[] = [];
  assetImages: any[] = [];
  barcodes: any[] = [];
  rfcodes: any[] = [];
  identities: any[] = [];
  identityForm!: FormGroup;
  files: any[] = [];
  assetCode: any;
  isBarUploaded: boolean = true;
  isQrUploaded: boolean = true;
  isRfUploaded: boolean = true;
  isAssetImageUploaded: boolean = false;

  @Output() assetDefaultImageChanged = new EventEmitter<any>();
  @Output() qrChanged = new EventEmitter<any>();
  @Input() isEditable: boolean = false;
  @Input() userAccess !: IUserAccess;

  constructor(
    private navService: NavigationService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private alertService: SweetAlertService
  ) {
    let assetDetails: IAssetData =
      this.navService.getNavigationState().assetData;
    this.assetCode = assetDetails?.generals.assetCode;
    this.identifications = assetDetails?.identifications ?? [];
  }

  ngOnInit() {
    this.initialize();
    this.identityForm = this.fb.group({
      brCode: [],
      brClientCode: [],
      rfCode: [],
      rfClientCode: [],
      qrCode: [],
      qrClientCode: []
    });
  }

  initialize(): void {
    this.assetImages = [];
    this.identifications?.forEach((i: any) => {
      switch (i.type) {
        case 0:
          this.isBarUploaded = true;
          break;
        case 1:
          this.isQrUploaded = true;
          if (this.isQrUploaded) {
            let qr = this.identifications.find(
              (i: any) => i.type === 1
            ).imageUrl;
            this.qrChanged.emit(qr);
          }
          break;
        case 2:
          this.isRfUploaded = true;
          break;
        case 3:
          this.assetImages.push(i);
          break;
      }
    });
    if (this.assetImages.length > 0) {
      this.assetImages[0].isDefault = true;
    }
  }

  onChange(event: any): void {
    let navState = this.navService.getNavigationState();
    this.files = event.target.files as [];
    for (let i = 0; i < this.files.length; i++) {
      let identity = {
        id: 0,
        assetId: navState.currentAssertId,
        code: '',
        clientCode: '',
        type: 3,
        file: this.files[i],
        imageUrl: URL.createObjectURL(this.files[i]),
        isDefault: false
      };
      this.assetImages.push(identity);
    }
  }

  onSelect(event: any, type: number): void {
    let navState = this.navService.getNavigationState();
    let identity = {
      id: 0,
      assetId: navState.currentAssertId,
      code: '',
      clientCode: '',
      type: type,
      file: event.addedFiles[0],
      imageUrl: '',
      isDefault: false
    };
    switch (type) {
      case 0:
        this.barcodes = [];
        this.barcodes.push(event.addedFiles[0]);
        break;
      case 1:
        break;
      case 2:
        this.rfcodes = [];
        this.rfcodes.push(event.addedFiles[0]);
        break;
    }
    this.identifications = this.identifications.filter((i) => i.type !== type);
    this.identifications.push(identity);
    this.identities = this.newIdentifications.filter((i) => i.type !== type);
    this.identities.push(identity);
  }

  onRemove(event: any, type: number) {
    switch (type) {
      case 0:
        this.barcodes = [];
        break;
      case 1:
        break;
      case 2:
        this.rfcodes = [];
        break;
    }
  }

  changeStatus(item: number, event: any) {
    switch (item) {
      case 0:
        this.isBarUploaded = event.target.checked;
        break;
      case 1:
        this.isQrUploaded = event.target.checked;
        break;
      case 2:
        this.isRfUploaded = event.target.checked;
        break;
      case 3:
        this.isAssetImageUploaded = event.target.checked;
        break;
    }
  }

  generate() {
    let navState = this.navService.getNavigationState();
    let identity = {
      id: 0,
      assetId: navState.currentAssertId,
      code: '',
      clientCode: '',
      type: 1,
      file: '',
      imageUrl: '',
      isDefault: false
    };
    let identities = [];
    identities.push(identity);
    this.apiService
      .UploadIdDocs('Identification/SaveIdentifications', identities)
      .subscribe({
        next: (gennerated) => {
          this.alertService.success('Saved successfully !!', {
            id: 'alert-asset'
          });
          this.retriveData();
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  getIdentification(id: number): any {
    let identity = this.identifications.find((i: any) => i.type === id);
    if (identity) {
      return identity;
    }
    return { clientCode: '' };
  }

  isActive(id: number): void {
    if (id > 0) {
      let assetImage = this.assetImages.find((i) => i.id === id);
      assetImage.type = 3;
      assetImage.isDefault = true;
      this.assetDefaultImageChanged.emit(assetImage.imageUrl);
      this.apiService
        .UploadIdDocs('Identification/SaveAssetImages', [assetImage])
        .subscribe({
          next: (updated) => {
            if (updated.isSuccess) {
              this.alertService.success(updated.message + ' !!', {
                id: 'alert-asset'
              });
            } else {
              this.alertService.error(updated.message + ' !!', {
                id: 'alert-asset'
              });
            }
          },
          error: (err) => {
            this.alertService.error('Error retreving assets !!', {
              id: 'alert-asset'
            });
            console.error(err);
          },
          complete: () => {
            this.retriveData();
          }
        });
    }
  }

  save(): void {
    let formData = this.identityForm.value;
    this.identities.forEach((identity) => {
      switch (identity.type) {
        case 0:
          identity.code = formData.brCode;
          identity.clientCode = formData.brClientCode;
          break;
        case 1:
          identity.code = formData.qrCode;
          identity.clientCode = formData.qrClientCode;
          break;
        case 2:
          identity.code = formData.rfCode;
          identity.clientCode = formData.rfClientCode;
          break;
      }
      identity.isDefault = true;
    });
    this.apiService
      .UploadIdDocs('Identification/SaveIdentifications', this.identities)
      .subscribe({
        next: (uploded) => {
          this.alertService
            .success('Saved successfully !!', {
              id: 'alert-asset'
            })
            .then(() => this.retriveData());
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  uploadAssets() {
    let assetImages = this.assetImages.filter((i) => i.id === 0);
    assetImages.map((i) => (i.type = 3));
    this.apiService
      .UploadIdDocs('Identification/SaveAssetImages', assetImages)
      .subscribe({
        next: (uploded) => {
          this.alertService.success('Uploaded successfully !!', {
            id: 'alert-asset'
          }).then(() => this.retriveData());
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  deleteImg(docImg: any): void {
    let navState = this.navService.getNavigationState();
    let identity = {
      id: docImg.id,
      assetId: navState.currentAssertId,
      code: '',
      clientCode: '',
      type: docImg.type,
      file: '',
      imageUrl: docImg.imageUrl,
      isDefault: false
    };
    this.apiService
      .DeleteIdentification('Identification/DeleteIdentification', identity)
      .subscribe({
        next: (deleted) => {
          this.alertService
            .success('Deleted successfully !!', {
              id: 'alert-asset'
            })
            .then(() => this.retriveData());
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {}
      });
  }

  retriveData(): void {
    let navState = this.navService.getNavigationState();
    this.apiService
      .GetAssetById(
        `Activity/GetAssetInformationById?assetId=${navState.currentAssertId}`,
        null
      )
      .subscribe({
        next: (asset) => {
          navState = this.navService.getNavigationState();
          navState.assetData = asset;
          this.navService.setNavigationState(navState);
          this.identifications = asset?.identifications;
          this.initialize();
        },
        error: (err) => {
          this.alertService.error('Error retreving assets !!', {
            id: 'alert-asset'
          });
          console.error(err);
        },
        complete: () => {
          this.navService.setNavigationState(navState);
        }
      });
  }
}
