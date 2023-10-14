import * as CryptoJS from 'crypto-js';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ISecurityObject } from './../models/interfaces/auth/ISecurityObject';
import { IUser } from '../models/interfaces/auth/IUser';
import { IUserLogin } from '../models/interfaces/auth/IUserLogin';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLoggedIn = new BehaviorSubject(false);
  isUserLoggedIn: any;
  securityObject: ISecurityObject;
  encryptedSecret: string | null = '';
  encryptedToken: string | null = '';
  bearerToken?: string | null = '';

  constructor(private httpClient: HttpClient) {
    this.securityObject = {
      access_token: '',
      expires: '',
      expires_in: 0,
      issued: '',
      token_type: 'Bearer',
      userName: '',
      name: '',
      designation: ''
    };
    this.isUserLoggedIn = this.userLoggedIn.asObservable();
    this.encryptedToken = window.sessionStorage.getItem('securityObject');
    this.encryptedSecret = window.sessionStorage.getItem('patchId');
    if (this.encryptedToken && this.encryptedSecret) {
      Object.assign(
        this.securityObject,
        JSON.parse(
          CryptoJS.AES.decrypt(
            this.encryptedToken,
            this.encryptedSecret?.toString()
          ).toString(CryptoJS.enc.Utf8)
        )
      );
      this.updateAuth(true, this.securityObject);
    }
  }

  updateAuth(loggedIn: boolean, securityObject?: ISecurityObject) {
    if (loggedIn) {
      this.encryptedToken =
        securityObject?.token_type + '_' + new Date().getUTCMilliseconds();
      let encryptedSO = CryptoJS.AES.encrypt(
        JSON.stringify(securityObject),
        this.encryptedToken
      ).toString();
      window.sessionStorage.setItem('patchId', this.encryptedToken);
      window.sessionStorage.setItem('securityObject', encryptedSO);
      Object.assign(this.securityObject, securityObject);
    }
    this.userLoggedIn.next(loggedIn);
  }

  getUser(): IUser {
    if (this.isUserLoggedIn) {
      return this.securityObject;
    }
    return {} as IUser;
  }

  logout(): void {
    this.logoutUser().subscribe({
      next: (result) => {
        this.updateAuth(false);
        this.clearSession();
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {}
    });
  }

  clearSession() {
    window.sessionStorage.removeItem('patchId');
    window.sessionStorage.removeItem('currentUser');
    window.sessionStorage.removeItem('securityObject');
    window.sessionStorage.removeItem('navigationState');
    window.sessionStorage.removeItem('navigationHistory');
  }

  authenticate(user: IUserLogin): Observable<ISecurityObject> {
    return this.httpClient.post<ISecurityObject>(
      `${environment.coreApiUrl}/Account/token`,
      user
    );
  }

  forgotPassword(path: string, user: any = null): Observable<number> {
    return this.httpClient.post<number>(
      `${environment.coreApiUrl}/${path}`,
      user
    );
  }

  logoutUser(): Observable<ISecurityObject> {
    return this.httpClient.post<ISecurityObject>(
      `${environment.coreApiUrl}/Account/logout?isMobile=false`,
      null
    );
  }

  regenerateToken(accountId: number){
    return this.httpClient.post<ISecurityObject>(
      `${environment.coreApiUrl}/Account/ReGenerateToken?accountId=${accountId}`,
      null
    );
  }

  accountChangePassword(path:any, pwdDetails:any): Observable<any>{
    return this.httpClient.post<any>(
      `${environment.coreApiUrl}/${path}`, pwdDetails
    )
  }
}
