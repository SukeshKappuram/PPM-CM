import { environment } from 'src/environments/environment';

import { ValidationService } from '../services/validation.service';

export class ValidationHelper {
  isFormValueChanged: boolean = false;
  constructor(private vs: ValidationService) { }

  getErrorMessage(
    form: any,
    fieldName: string,
    checkForm: boolean = false,
    subFormName: string = ''
  ) {
    if (checkForm) {
      form = form.controls[subFormName];
    }
    let _fieldName = fieldName;
    if (fieldName.includes('/')) {
      fieldName = fieldName.replace('/', 'Or');
    }
    if (fieldName.includes('$')) {
      _fieldName = fieldName
        .substring(fieldName.indexOf(' ') + 1)
        .toLowerCase();
      fieldName = _fieldName;
    }
    if (fieldName.includes('%')) {
      fieldName = fieldName.replace('%', '');
    }
    if (fieldName.includes('#')) {
      const _fieldNames = fieldName.split(' ');
      _fieldName =
        _fieldNames[0].substring(1).toUpperCase() +
        ' ' +
        _fieldNames.slice(1).toString();
      let fn = _fieldNames[0].replace('#', '');
      fieldName =
        fn.substring(0, 1).toLowerCase() +
        fn.substring(1).toString() +
        this.titleCase(_fieldNames.slice(1).toString());
    }
    if (fieldName.endsWith('.')) {
      fieldName = fieldName.substring(0, fieldName.length - 1);
    }

    if (!environment.production) {
      console.info(fieldName.split(' ').join(''), _fieldName);
    }

    let errors = form.get(fieldName.split(' ').join('')).errors;

    if (errors) {
      return this.vs.getErrorMessage(errors, _fieldName.toLowerCase());
    }
    return '';
  }

  private titleCase(str: string) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join('');
  }
}
