import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'charcase'
})
export class CharCasePipe implements PipeTransform {
  constructor(private titlecasePipe: TitleCasePipe) {}
  transform(value: string): any {
    if (value?.startsWith('#')) {
      let values = value.substring(1).split(' ');
      return values[0].toUpperCase() + ' ' + values.slice(1);
    } else if (value?.startsWith('##')) {
      return value.substring(2).toUpperCase();
    }
    return this.titlecasePipe.transform(value);
  }
}
