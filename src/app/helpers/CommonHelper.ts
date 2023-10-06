export class CommonHelper {
  public static getNonNullValue(
    fieldName: string | undefined,
    value: any
  ): string {
    if (typeof fieldName != 'undefined' && fieldName) {
      return fieldName;
    } else {
      return value;
    }
  }

  genrerateMonths(): void {
    let startDate = new Date(2022, 7, 1);
    let currentDate = startDate;
    let endDate = new Date(2023, 6, 31);
    let plannedDates: any = [];
    do {
      let current: any = currentDate.setMonth(currentDate.getMonth() + 1);
      if (currentDate > endDate) {
        current = currentDate.setMonth(currentDate.getMonth() - 1);
        let diff = Math.abs(endDate.getTime() - currentDate.getTime());
        let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        current = currentDate.setDate(currentDate.getDate() + diffDays + 1);
      }
      plannedDates.push(current);
    } while (currentDate < endDate);
  }

  public static generateMonthsWithWeeks(
    plannedDates: any,
    currentDate: any,
    endDate: any
  ): void {
    let lastWeek = 0;
    let months: any = [];
    let allWeeks: any = [];
    plannedDates.forEach((d: any) => {
      let forDate = new Date(d);
      let month = forDate.getMonth();
      let monthDate = new Date(forDate);
      let weeks = [];
      while (month == monthDate.getMonth()) {
        let currentWeek = this.getCurrentWeek(monthDate);
        if (currentWeek != lastWeek) {
          weeks.push(currentWeek);
        }
        let startOfWeek = monthDate.setDate(monthDate.getDate() + 7);
        if (monthDate > endDate) {
          startOfWeek = monthDate.setDate(monthDate.getDate() - 7);
          let diff = Math.abs(endDate.getTime() - currentDate.getTime());
          let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
          startOfWeek = monthDate.setDate(monthDate.getDate() + diffDays + 1);
        }
      }
      lastWeek = weeks[weeks.length - 1];
      months.push({
        startDate: forDate,
        endDate: new Date(new Date(forDate).setDate(endDate.getDate())),
        month: forDate.getMonth() + 1 + '-' + forDate.getFullYear(),
        weeks: [...new Set(weeks)]
      });
      allWeeks = allWeeks.concat([...new Set(weeks)]);
    });
  }

  public static getCurrentWeek(currentDate: any): any {
    let yearStartDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor(
      (currentDate.getTime() - yearStartDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    const week = Math.ceil(days / 7);
    return week === 0 ? 1 : week;
  }

  public static isEmptyOrNull(value: any): boolean {
    if (value) {
      return false;
    }
    return true;
  }

  public static convertDateToUTC(date:any): any{
    let now = new Date(date);
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  }

  public static convertDateToLocal(date:any): any{
    let now = new Date(date);
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  }
}
