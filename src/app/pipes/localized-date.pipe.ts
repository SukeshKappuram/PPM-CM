import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { LOCALE_ID, Inject } from '@angular/core';
import { CommonHelper } from '../helpers/CommonHelper';
import { NavigationService } from '../services/navigation.service';
@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  utcOffset: number = 0;
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private navService: NavigationService
  ) {

  }

  transform(
    value: Date | string,
    format = 'dd-MMM-yyyy',
    localRequired: boolean = false
  ): any {
    let navState = this.navService.getNavigationState();
    this.utcOffset = navState.currentAccount?.utcDiffInMins;
    const datePipe = new DatePipe(this.locale.split('-')[0]);
    if (value === undefined || value === null || value === '') {
      return null;
    }
    if (localRequired) {
      let dateValue = new Date();
      let newDate = new Date();
      if (value !== 'new') {
        try {
          dateValue = new Date(value);
        } catch (e) {}
      }
      let dt: Date = CommonHelper.convertDateToUTC(dateValue);
      dt.setMinutes(dt.getMinutes() + this.utcOffset);
      newDate = new Date(dt);
      return datePipe.transform(newDate, format);
    } else {
      return datePipe.transform(value, format);
    }
  }
}
