import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { AccountsComponent } from './accounts/accounts.component';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { INavigatedMenu } from './../../models/interfaces/INavigatedMenu';
import { MatDialog } from '@angular/material/dialog';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { NavigationService } from 'src/app/services/navigation.service';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  isResized: boolean = false;
  displayType: string = 'none';
  subscription!: Subscription;
  quickActions: any[] = [];
  accounts: any[] = [];

  @ViewChild('sidebar') sidebar!: SidebarComponent;
  constructor(
    private data: DataService,
    private router: Router,
    private navService: NavigationService,
    public dialog: MatDialog,
    private authService: AuthService,
    private ds: DataService
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        let navState = this.navService.getNavigationState();
        let navigationItem: INavigatedMenu = {
          menuName: [
            navState.selectedGroup,
            navState.selectedMenu,
            navState.selectedSubMenu,
            navState.selectedSubMenuItem
          ]
            .filter((menu) => menu !== '')
            .join('_'),
          menuUrl: this.router.url,
          navState: navState
        };
        this.navService.setNavigationHistory(navigationItem);
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    // event.preventDefault();
    // event.returnValue = 'Your data will be lost!';
    this.authService.logout();
    sessionStorage.setItem('isLogggedOut', 'true');
    this.router.navigate([Navigate.LOGIN]);
    return true;
  }

  ngOnInit(): void {
    this.subscription = this.data.currentState.subscribe(
      (displayType: any) => (this.displayType = displayType)
    );
    // $('.btn-to-top').on('click', () => {
    //   $('.content-inner').animate(
    //     {
    //       scrollTop: $(window).scrollTop(0)
    //     },
    //     'slow'
    //   );
    // });
  }

  updateHeaderActions(actions: any) {
    this.quickActions = actions;
  }

  scrollTop(): void {
    window.scroll(0, 0);

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    document.body.scrollTop = 0;
  }

  updateWidth(isMinimised: boolean = false) {
    this.isResized = isMinimised;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  accountsLoaded(event: any): void {
    this.accounts = event;
    const dialogRef = this.dialog
      .open(AccountsComponent, {
        data: { accounts: event },
        autoFocus: true,
        maxHeight: '90vh',
        width: '70%',
        disableClose: true
      })
      .afterClosed()
      .subscribe((accountSelected) => {
        this.updateAccount(accountSelected);
      });
  }

  updateAccount(accountSelected: any): void {
    this.authService.regenerateToken(accountSelected.id).subscribe({
      next: (result) => {
        if (result) {
          let navState = this.navService.getNavigationState();
          this.accounts = navState.accounts;
          navState.currentAccount = this.accounts.find(
            (a) => a.shortName === result.account_name
          );
          this.navService.setNavigationState(navState);
          this.authService.updateAuth(true, result);
          this.sidebar.getMenu();
          this.ds.updateAccount(result.account_name ?? '');
        }
      },
      error: (e) => {
        this.authService.updateAuth(false);
        this.router.navigate([Navigate.ERROR]);
        console.error(e);
      },
      complete: () => {}
    });
  }
}
