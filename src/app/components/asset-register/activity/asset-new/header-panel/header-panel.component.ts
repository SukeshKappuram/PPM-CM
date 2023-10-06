import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { CommonComponent } from 'src/app/components/common/common.component';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { IUserAccess } from 'src/app/models/interfaces/auth/IUserAccess';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import buttons from '../../../../../helpers/buttons.json';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss']
})
export class HeaderPanelComponent
  extends CommonComponent
  implements OnInit, OnChanges
{
  @Input() assetData: any = {
    floorName: 'Floor',
    buildingName: 'Building',
    unitOrSpaceName: 'Unit or Space',
    roomName: 'room'
  };
  @Input() currentTab: number = 0;
  @Input() override userAccess!: IUserAccess;
  @Output() tabChanged = new EventEmitter<any>();
  @Output() edited = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();
  currentUrl: any;

  constructor(
    private navService: NavigationService,
    private router: Router,
    private apiservice: ApiService,
    private alertService: SweetAlertService
  ) {
    super();
    this.isEditable = false;
    let navState = this.navService.getNavigationState();
    this.userAccess = this.convertToUserAccess(navState.subMenu);
    this.buttons = buttons.assetRegister.activity.assetNew.header;
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.currentUrl = this.router.url.toString();
        if (this.currentUrl.includes('CreateAsset')) {
          this.isEditable =
            (this.userAccess?.canAdd || this.userAccess?.canUpdate) ?? false;
          this.updateButtons(true);
        } else {
          this.updateButtons(false);
        }
      }
    });
  }

  ngOnInit(): void {
    if (!this.userAccess?.canAdd && !this.userAccess?.canUpdate) {
      this.buttons = this.buttons.filter((b: any) => b.id !== 'Save');
    }
    if (!this.userAccess?.canAdd) {
      this.buttons = this.buttons.filter((b: any) => b.id !== 'Add-New');
    }
  }

  ngOnChanges(): void {
    this.setPageTitle();
  }

  setPageTitle(isDisable: boolean = false): void {
    const label: string =
      this.assetData?.assetId && !this.isEditable
        ? ' - Edit Asset'
        : this.assetData?.assetId
        ? ''
        : 'Add Asset';
    this.pageTitle = (this.assetData?.assetCode ?? '') + ' ' + label;
    if (this.assetData?.assetId && !this.buttons.some((b) => b.id === 'Save')) {
      this.updateButtons(isDisable);
    }
  }

  openTab(tabId: number): void {
    this.currentTab = tabId;
    if (!this.navService.getNavigationState().isAssetIdValid && tabId > 1) {
      this.isEditable = false;
    }
    if (this.currentUrl?.includes('CreateAsset')) {
      this.isEditable = true;
    }
    this.edited.emit(this.isEditable);
    this.tabChanged.emit(this.currentTab);
  }

  buttonClicked(buttonType: any): void {
    if (buttonType == 'Save') {
      this.saveOrEdit();
    } else if (buttonType == 'Cancel') {
      this.router.navigate([Navigate.VIEW_ASSETS]);
    } else {
      this.router.navigate([Navigate.CREATE_ASSET]);
    }
  }

  override saveOrEdit(): void {
    if (this.isEditable) {
      if (this.assetData?.assetName) {
        this.isEditable = !this.isEditable;
      }
      this.saved.emit();
    } else {
      this.isEditable = !this.isEditable;
      this.edited.emit(this.isEditable);
      this.setPageTitle(true);
    }
  }

  override updateButtons(isDisabled: boolean = false): void {
    if (!this.userAccess?.canAdd && !this.userAccess?.canUpdate) {
      this.buttons = this.buttons.filter((b: any) => b.id !== 'Save');
    } else {
      let savebutton = this.buttons.find((b: any) => b.id === 'Save');
      if (savebutton) {
        savebutton.label = this.isEditable ? 'save' : 'edit';
        savebutton.icon = this.isEditable
          ? 'bi bi-check-circle'
          : 'bi bi-pencil-square';
        savebutton.isDisabled = isDisabled;
      }
      let addButton = this.buttons.find((b: any) => b.id === 'Add-New');
      if (addButton) {
        addButton.isDisabled = this.isEditable;
      }
    }
  }

  updateStatus(): void {
    let navState = this.navService.getNavigationState();
    this.apiservice
      .UpdateAssetStatus(
        `Activity/UpdateAssetStatus?assetId=${navState.currentAssertId}&status=true`
      )
      .subscribe({
        next: (updated) => {
          this.assetData.status = 'Inactive';
          this.alertService.success('Deleted successfully !!', {
            id: 'alert-asset'
          });
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
}
