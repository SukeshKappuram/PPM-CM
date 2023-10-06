import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService{

  private qMasterData:any;
  private currencyCode:any;
  constructor(private navService: NavigationService, private api: ApiService, private authSrvc: AuthService, private cp:CurrencyPipe) { }

  numberToWord(num:any)
  {
    // return new ToWords().convert(num);
  }

  setMasterData(): void {
    this.api.GetQuotationMasterData(this.authSrvc.securityObject.userName).subscribe((res: any) => {
      this.qMasterData = res
    });
    this.setCurrencyCode();
  }

  setCurrencyCode(): void {
    this.currencyCode = this.navService.getNavigationState().currentAccount?.currencyCode;
  }

  getMasterData(): any {
    if(this.qMasterData === undefined){ this.setMasterData();}
      return this.qMasterData;
  }

  getCurrencyCode():string{
    if(this.currencyCode === undefined){ this.setCurrencyCode();}
    return this.currencyCode;
  }

  parseToNumber(value: any, isInt:boolean)
  {
      let x = isInt ? parseInt(value) : parseFloat(value);
      return isNaN(x) ? null : x;
  }

  setCurrencyFormat(value: any) {
    return this.cp.transform(value, this.getCurrencyCode(), 'code', '1.2-2');
  }

  readCurrencyFormat(value: any) {
    return parseFloat(value.replace(this.getCurrencyCode(), '').replace(/,/g, ''));
  }

  getAccountLogo(shortImgUrl:boolean)
  {
    if(shortImgUrl)
      return this.navService.getNavigationState().currentAccount.shortImageUrl
    else
      return this.navService.getNavigationState().currentAccount.imageUrl
  }
}
