import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonComponent } from 'src/app/components/common/common.component';
import { IMenuGroup } from 'src/app/models/interfaces/IMenuGroup';
import { IMenuItem } from 'src/app/models/interfaces/IMenuItem';
import { ISideMenu } from 'src/app/models/interfaces/ISideMenu';
import { IUserLogin } from 'src/app/models/interfaces/auth/IUserLogin';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SharedService } from 'src/app/services/shared.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ThemeService } from '../../../services/theme.service';
import { ValidationService } from '../../../services/validation.service';
import { AuthService } from './../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends CommonComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  isResetPassword: boolean = false;
  isForgotPassword: boolean = false;
  emailForm: FormGroup = new FormGroup({});
  userForm: FormGroup = new FormGroup({});
  changePasswordForm: FormGroup = new FormGroup({});

  userObject: IUserLogin = {
    userName: '',
    password: '',
    grantType: '',
    isMobile: false
  };
  loginImg: string = 'assets/images/PropFM.png';
  welcomString: string = 'PropEzy FM Pro';
  isSubmitted = false;
  isDemoVersion: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private vs: ValidationService,
    private ts: ThemeService,
    private alertService: SweetAlertService,
    private ss: SharedService,
    private apiService: ApiService,
    private navService: NavigationService
  ) {
    super();
    this.authService.updateAuth(false);
    this.authService.userLoggedIn.subscribe((isUserLoggedIn) => {
      this.isUserLoggedIn = isUserLoggedIn;
    });
  }

  ngOnInit() {
    this.authService.clearSession();
    let isLogggedOut = sessionStorage.getItem('isLogggedOut');
    if (isLogggedOut === 'true') {
      sessionStorage.setItem('isLogggedOut', 'false');
      location.reload();
    }
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      grantType: ['']
    });
    this.emailForm = this.fb.group({
      userName: ['', Validators.required]
    });

    this.changePasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      token: ['', Validators.required]
    });

    this.isDemoVersion = this.ts.isDemoVersion();
    if (this.isDemoVersion) {
      this.loginImg = 'assets/images/Rynalogo.png';
      this.welcomString = '';
    }
  }

  authenticate(): void {
    this.isSubmitted = true;
    if (this.userForm.valid) {
      this.userObject = this.userForm.value;
      this.userObject.isMobile = false;
      this.authService.authenticate(this.userObject).subscribe({
        next: (result: any) => {
          if (result) {
            this.authService.updateAuth(true, result);
            // this.ss.setMasterData();
            this.apiService.GetAllMenuItems().subscribe({
              next: (results) => {
                this.navState = this.navService.getNavigationState();
                this.navState.menuGroups = results.menuItems;
                this.navState.accounts = results.accounts;
                this.navState.quickActions = results.quickActions;
                this.navState.currentAccount = results.accounts[0];
                this.navService.setNavigationState(this.navState);
                let menuGroup : any = this.navState.menuGroups ? this.navState.menuGroups[0] : null;
                if (menuGroup?.groupedSections) {
                  this.SelectMenu(
                    menuGroup?.groupedSections[0],
                    menuGroup?.groupedSections[0]?.menuItems[0],
                    menuGroup
                  );
                }
              },
              error: () => {
                this.alertService.error('Error retreving menu !!', {
                  id: 'side-alert'
                });
              }
            });
          }
        },
        error: (e) => {
          this.authService.updateAuth(false);
          this.alertService.error('Please enter a valid login credentials');
          // this.router.navigate([Navigate.ERROR]);
          console.error(e);
        },
        complete: () => {}
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  SelectMenu(
    menu: ISideMenu | undefined,
    subMenu: IMenuItem | undefined,
    mainMenu: IMenuGroup
  ) {
    if (menu) {
      let selectedMenu = '';
      let selectedGroup = '';
      this.navState = this.navService.getNavigationState();
      if (
        this.navState.selectedMenu == menu.title &&
        (!subMenu || subMenu === undefined)
      ) {
        selectedMenu = '';
      } else if (
        this.navState.selectedMenu == menu.title &&
        this.navState.selectedSubMenu == subMenu?.tabName
      ) {
        selectedMenu = '';
        this.navState.selectedSubMenu = '';
      } else {
        selectedMenu = menu.title;
        this.navState.selectedSubMenu = subMenu?.tabName;
        if ((!subMenu || subMenu === undefined) && !mainMenu?.hideSection) {
          this.navState.selectedMenu =
            selectedMenu ?? this.navState.selectedMenu;
        }
      }
      this.navState.selectedGroup =
        selectedGroup ?? this.navState.selectedGroup;
      this.navState.selectedMenu = selectedMenu ?? this.navState.selectedMenu;
      subMenu = subMenu?.webUrl ? subMenu : undefined;
      this.navState.subMenu = subMenu;
      this.navState.isEditable = false;
      this.navService.setNavigationState(this.navState);
      let navigateTo = menu.showVertical
        ? mainMenu?.groupName
            ?.replace(/ /g, '-')
            .replace('/', '')
            .toLowerCase() +
          '/' +
          subMenu?.webUrl
        : subMenu?.webUrl;
      if (selectedGroup === 'Dashboard') {
        selectedMenu = 'Dashboard';
        subMenu = menu.menuItems[0];
        navigateTo = 'GetDashBoard';
      }
      if (
        selectedGroup == undefined ||
        selectedMenu == undefined ||
        subMenu == undefined
      ) {
        return;
      }
      this.router.navigate([navigateTo]);
    }
  }

  validateAndResetPassword(): void {
    if (this.emailForm.valid) {
      let userObject = this.emailForm.value;
      this.authService
        .forgotPassword(`Account/ForgetPassword`, {
          resetUserId: userObject?.userName
        })
        .subscribe({
          next: (result) => {
            if (result > 0) {
              this.isResetPassword = false;
              this.isForgotPassword = true;
              this.emailForm.reset();
            } else if (result === -1) {
              this.alertService.error('Please enter email address');
            } else if (result === -2) {
              this.alertService.error(
                'Entered email is invalid or not registered'
              );
            }
          },
          error: (e) => {
            this.alertService.error('Error reseting password');
            console.error(e);
          },
          complete: () => {}
        });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  changePassword(): void {
    if (this.changePasswordForm.valid) {
      let userObject = this.changePasswordForm.value;
      this.authService
        .forgotPassword(`Account/ResetPassword`, {
          resetUserId: '',
          newPassword: userObject.newPassword,
          confirmPassword: userObject.confirmPassword,
          token: userObject.token
        })
        .subscribe({
          next: (result) => {
            if (result > 0) {
              this.alertService
                .success('Password updated successfully')
                .then(() => {
                  this.isResetPassword = false;
                  this.isForgotPassword = false;
                  this.changePasswordForm.reset();
                });
            } else if (result === -1) {
              this.alertService.error(
                'New Password mismatched with Confirm Password'
              );
            } else if (result === -2) {
              this.alertService.error('Token is expired or invalid');
            } else if (result === -3) {
              this.alertService.error('Old Password and new Password are same');
            }
          },
          error: (e) => {
            this.alertService.error('Error updating password');
            console.error(e);
          },
          complete: () => {}
        });
    } else {
      this.userForm.markAllAsTouched();
      this.alertService.error('Enter valid credentials');
    }
  }

  cancel(): void {
    this.isResetPassword = false;
    this.isForgotPassword = false;
    this.emailForm.reset();
    this.changePasswordForm.reset();
  }

  get getUserForm() {
    return this.userForm.controls;
  }

  getValidationMessage(errors: any, fieldName: string) {
    return this.vs.getErrorMessage(errors, fieldName);
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
