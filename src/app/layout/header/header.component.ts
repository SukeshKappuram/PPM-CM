import * as build from 'src/environments/build-version.json';

import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from './../../services/auth.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { MatDialog } from '@angular/material/dialog';
import { Navigate } from 'src/app/models/enums/Navigate.enum';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() loggedIn: boolean = false;
  @Input() quickActions: any[] = [];
  userName: string = '';
  logo: string = 'assets/images/global/logo2.png';
  Navigate = Navigate;
  imageUrl: any = 'assets/images/empty-profile.png';
  accounts: any[] = [];
  isDemoVersion: boolean = false;
  isChangePassword: boolean = false;
  currentBuild: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private navService: NavigationService,
    private ts: ThemeService,
    private as: SweetAlertService,
    private dialog: MatDialog,
    private datePipe: LocalizedDatePipe
  ) {
    this.isDemoVersion = this.ts.isDemoVersion();
    let buildDetails = build?.buildVersion?.split('-');
    this.currentBuild = {
      version: buildDetails[0],
      releaseDate: new Date(
        parseInt(buildDetails[1].replace('build.', '')) * 1000
      )
    };
    if (this.isDemoVersion) {
      this.logo = 'assets/images/whitelogo.png';
    }
    if (this.navService.getNavigationState().accounts) {
      this.accounts = this.navService.getNavigationState().accounts;
    }
  }

  ngOnInit(): void {
    this.authService.userLoggedIn.subscribe((isUserLoggedIn) => {
      this.loggedIn = isUserLoggedIn;
      if (this.loggedIn) {
        this.userName = this.authService.securityObject.name;
        if (this.authService.securityObject.imageUrl != null) {
          this.imageUrl = this.authService.securityObject.imageUrl;
        }
        sessionStorage.setItem('currentUser', this.userName);
      }
    });
  }

  navigate(url: string): void {
    let navState = this.navService.getNavigationState();
    navState.isHeaderCall = true;
    this.navService.setNavigationState(navState);
    this.router.navigate([url]);
  }

  logout(): void {
    this.authService.logout();
    sessionStorage.setItem('isLogggedOut', 'true');
    this.router.navigate([Navigate.LOGIN]);
  }

  getResourceProfile() {
    sessionStorage.setItem('isMyProfile', 'true');
    this.router.navigate([Navigate.RESOURCE_MAN_POWER]);
  }

  openBuildDetails() {
    this.as.info(
      `<b>Version</b> :  ${
        this.currentBuild?.version
      } <br/>  <span class="fs-6"><b>Release Date</b> : ${this.datePipe.transform(
        this.currentBuild?.releaseDate, 'dd-MMM-yyyy HH:mm'
      )}</span>`
    );
  }

  changePassword() {
    if (!this.isChangePassword) {
      this.isChangePassword = true;
      const dialogRef = this.dialog
        .open(ChangePasswordComponent, {
          data: {},
          autoFocus: true,
          maxHeight: '90vh',
          disableClose: true,
          width: '300px'
        })
        .afterClosed()
        .subscribe((asset) => {
          if (asset) {
          }
          this.isChangePassword = false;
        });
    }
  }
}
