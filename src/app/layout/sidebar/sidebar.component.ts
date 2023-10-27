import { Component, EventEmitter, Output } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { IMenuGroup } from './../../models/interfaces/IMenuGroup';
import { IMenuItem } from '../../models/interfaces/IMenuItem';
import { INavaigationState } from './../../models/interfaces/INavaigationState';
import { ISideMenu } from '../../models/interfaces/ISideMenu';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { NavigationService } from './../../services/navigation.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ThemeService } from '../../services/theme.service';

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  sideMenus: ISideMenu[] = [];
  navState: INavaigationState = {
    selectedMenu: '',
    selectedSubMenu: '',
    selectedGroup: '',
    currentAssertId: 0,
    currentAuditId: 0,
    currentInstructionId: 0,
    currentQuestionId: 0,
    currentSchedulerId: 0,
    currentMRId: 0,
    currentLogId: 0,
    currentMasterId: 0,
    isAssetIdValid: false,
    isEditable: false,
    isHeaderCall: false,
    quickActions: []
  };

  isExpanded: boolean = false;
  isColapsed: boolean = true;
  isShortImage: boolean = false;
  selectedGroup: string = '';
  selectedMenu: string = '';
  imageUrl: string = 'assets/images/empty-profile.png';

  menuGroups: IMenuGroup[] = [];
  selectedAccount: any;
  accounts: any[] = [];

  showAccounts: boolean = false;
  isDemoVersion: boolean = false;

  @Output() minimised: EventEmitter<any> = new EventEmitter();
  @Output() menuLoaded: EventEmitter<any> = new EventEmitter();
  @Output() multipleAccountsLoaded: EventEmitter<any> = new EventEmitter();
  @Output() accountChanged: EventEmitter<any> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private navService: NavigationService,
    private router: Router,
    private alertService: SweetAlertService,
    private ts: ThemeService
  ) {
    this.navState = navService.getNavigationState();
    this.getMenu(true);
    this.isDemoVersion = this.ts.isDemoVersion();
  }

  getMenu(isDefault: boolean = false): void {
    setTimeout(() => {
      this.navState = this.navService.getNavigationState();
      this.menuGroups = this.navState.menuGroups ?? [];
      if (isDefault) {
        this.accounts = this.navState.accounts;
        if (this.navState.currentAccount) {
          this.selectedAccount = this.navState.currentAccount;
        } else if (this.accounts?.length > 0 && !this.navState.currentAccount) {
          this.selectedAccount = this.navState.accounts[0];
          this.navState.currentAccount = this.selectedAccount;
          // this.multipleAccountsLoaded.emit(results?.accounts);
        } else if (
          this.navState?.accounts?.length === 1 &&
          this.navState.accounts[0]
        ) {
          this.selectedAccount = this.navState.accounts[0];
          this.navState.currentAccount = this.selectedAccount;
        } else {
          this.selectedAccount = this.navState.currentAccount;
        }
        if (this.isDemoVersion && this.selectedAccount) {
          this.selectedAccount.imageUrl = 'assets/images/muheel-Long.jpg';
          this.selectedAccount.shortImageUrl = 'assets/images/muheel-icon.jpg';
        }
        this.selectedGroup = this.navState.selectedGroup;
        this.selectedMenu = this.navState.selectedMenu;
      }
      this.navService.setNavigationState(this.navState);
      this.updateSidebar();
      this.menuLoaded.emit(this.navState.quickActions);
      if (!isDefault) {
        this.router.navigate([Navigate.HOME]);
      }
    }, 500);
  }

  public updateSidebar(): void {
    this.navState.selectedMenu = this.menuGroups[0]?.groupedSections[0]?.title;
    this.applySidebar();
  }

  SelectMenuGroup(group: IMenuGroup): void {
    if (this.selectedGroup != group.groupName) {
      this.selectedGroup = group?.groupName;
      if (group.hideSection || group.groupedSections.length === 1) {
        this.SelectMenu(group.groupedSections[0], undefined, group);
      }
    } else {
      this.selectedGroup = '';
    }
  }

  SelectMenu(
    menu: ISideMenu,
    subMenu: IMenuItem | undefined,
    mainMenu: IMenuGroup
  ) {
    this.navState = this.navService.getNavigationState();
    if (
      this.navState.selectedMenu == menu.title &&
      (!subMenu || subMenu === undefined)
    ) {
      this.selectedMenu = '';
    } else if (
      this.navState.selectedMenu == menu.title &&
      this.navState.selectedSubMenu == subMenu?.tabName
    ) {
      this.selectedMenu = '';
      this.navState.selectedSubMenu = '';
    } else {
      this.selectedMenu = menu.title;
      this.navState.selectedSubMenu = subMenu?.tabName;
      if ((!subMenu || subMenu === undefined) && !mainMenu?.hideSection) {
        this.navState.selectedMenu =
          this.selectedMenu ?? this.navState.selectedMenu;
      }
    }
    this.navState.selectedGroup =
      this.selectedGroup ?? this.navState.selectedGroup;
    this.navState.selectedMenu =
      this.selectedMenu ?? this.navState.selectedMenu;
    subMenu = subMenu?.webUrl ? subMenu : undefined;
    this.navState.subMenu = subMenu;
    this.navState.isEditable = false;
    this.navService.setNavigationState(this.navState);
    let navigateTo = menu.showVertical
      ? mainMenu?.groupName?.replace(/ /g, '-').replace('/', '').toLowerCase() +
        '/' +
        subMenu?.webUrl
      : subMenu?.webUrl;
    if (this.selectedGroup === 'Dashboard') {
      this.selectedMenu = 'Dashboard';
      subMenu = menu.menuItems[0];
      navigateTo = 'GetDashBoard';
    }
    if (
      this.selectedGroup == undefined ||
      this.selectedMenu == undefined ||
      subMenu == undefined
    ) {
      return;
    }
    this.router.navigate([navigateTo]);
  }

  applySidebar(): void {
    this.imageUrl =
      this.selectedAccount?.shortImageUrl === ''
        ? 'assets/images/empty-profile.png'
        : this.selectedAccount?.shortImageUrl;
    this.sidebarMainResize();
    this.sidebarMainToggle();
  }

  sidebarToggle() {
    this.isColapsed = !this.isColapsed;
    if (!this.isColapsed) {
      this.imageUrl =
        this.selectedAccount?.imageUrl ?? 'assets/images/empty-profile.png';
      this.isShortImage = false;
    }
    this.minimised.emit(this.isColapsed);
  }

  sidebarRollover(entered: boolean) {
    const unfoldDelay = 150;
    let timerStart: string | number | NodeJS.Timeout | undefined,
      timerFinish: string | number | NodeJS.Timeout | undefined;
    if (this.isColapsed) {
      if (entered) {
        this.imageUrl =
          this.selectedAccount?.imageUrl === ''
            ? 'assets/images/empty-profile.png'
            : this.selectedAccount?.imageUrl;
        this.isShortImage = false;
        clearTimeout(timerFinish);
        setTimeout(() => {
          this.imageUrl =
            this.selectedAccount?.imageUrl === ''
              ? 'assets/images/empty-profile.png'
              : this.selectedAccount?.imageUrl;
        }, unfoldDelay);
        timerStart = setTimeout(function () {
          this.isExpanded = true;
        }, unfoldDelay);
      } else {
        this.imageUrl =
          this.selectedAccount?.shortImageUrl === ''
            ? 'assets/images/empty-profile.png'
            : this.selectedAccount?.shortImageUrl;
        this.isShortImage = true;
        clearTimeout(timerStart);
        setTimeout(() => {
          this.imageUrl =
            this.selectedAccount?.shortImageUrl === ''
              ? 'assets/images/empty-profile.png'
              : this.selectedAccount?.shortImageUrl;
        }, unfoldDelay);
        timerFinish = setTimeout(function () {
          this.isExpanded = false;
        }, unfoldDelay);
      }
    } else {
      this.imageUrl =
        this.selectedAccount?.imageUrl === ''
          ? 'assets/images/empty-profile.png'
          : this.selectedAccount?.imageUrl;
      this.isShortImage = false;
    }
  }

  sidebarMainResize(): void {
    // Elements
    const sidebarMainElement = $('.sidebar-main'),
      sidebarMainToggler = $('.sidebar-main-resize'),
      resizeClass = 'sidebar-main-resized',
      unfoldClass = 'sidebar-main-unfold';

    // Define variables
    const unfoldDelay = 150;
    let timerStart: string | number | NodeJS.Timeout | undefined,
      timerFinish: string | number | NodeJS.Timeout | undefined;

    // Toggle classes on click
    sidebarMainToggler.on('click', (e: any) => {
      sidebarMainElement.toggleClass(resizeClass);
      !sidebarMainElement.hasClass(resizeClass) &&
        sidebarMainElement.removeClass(unfoldClass);
    });

    // Add class on mouse enter
    sidebarMainElement.on('mouseenter', () => {
      clearTimeout(timerFinish);
      timerStart = setTimeout(function () {
        sidebarMainElement.hasClass(resizeClass) &&
          sidebarMainElement.addClass(unfoldClass);
      }, unfoldDelay);
    });

    // Remove class on mouse leave
    sidebarMainElement.on('mouseleave', () => {
      clearTimeout(timerStart);
      timerFinish = setTimeout(function () {
        sidebarMainElement.removeClass(unfoldClass);
      }, unfoldDelay);
    });
  }

  sidebarMainToggle(): void {
    // Elements
    const sidebarMainElement = $('.sidebar-main'),
      sidebarMainRestElements = $(
        '.sidebar:not(.sidebar-main):not(.sidebar-component)'
      ),
      sidebarMainDesktopToggler = $('.sidebar-main-toggle'),
      sidebarMainMobileToggler = $('.sidebar-mobile-main-toggle'),
      sidebarCollapsedClass = 'sidebar-collapsed',
      sidebarMobileExpandedClass = 'sidebar-mobile-expanded';

    // On desktop
    sidebarMainDesktopToggler.on('click', (e: any) => {
      e.preventDefault();
      sidebarMainElement.toggleClass(sidebarCollapsedClass);
    });

    // On mobile
    sidebarMainMobileToggler.on('click', (e: any) => {
      e.preventDefault();
      sidebarMainElement.toggleClass(sidebarMobileExpandedClass);
      sidebarMainRestElements.removeClass(sidebarMobileExpandedClass);
    });
  }

  switchAccount(id: number): void {
    if (this.accounts.length > 1) {
      setTimeout(() => {
        this.selectedAccount = this.accounts?.find((a) => a.id === id);
        if (this.isDemoVersion) {
          this.selectedAccount.imageUrl = 'assets/images/muheel-Long.jpg';
          this.selectedAccount.shortImageUrl = 'assets/images/muheel-icon.jpg';
        }
        this.imageUrl = this.selectedAccount?.imageUrl;
        this.selectedGroup = this.menuGroups[0].groupName;
        this.selectedMenu = this.menuGroups[0]?.groupedSections[0]?.title;
        this.navState.selectedMenu =
          this.menuGroups[0]?.groupedSections[0]?.title;
        this.accountChanged.emit(this.selectedAccount);
      }, 100);
    }
  }
}
