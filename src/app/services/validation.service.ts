import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  textLabels: string[] = [
    'Sub System Name',
    'System Name',
    'Category Name',
    'System Code',
    'Tag Id',
    'Tag Name',
    'Tag Code',
    'Type Name',
    'Type Code',
    'Parameter Name',
    'Depreciation Code',
    'UOM Code'
  ];
  dropdownLabels: string[] = ['Parameter Type'];

  patternDefinitions = new Map([
    ['[a-zA-Z ]', 'alphabets and spaces'],
    ['[a-zA-Z]', 'alphabets'],
    ['[a-zA-Z0-9 ]', 'alphaNumerics and spaces'],
    ['[a-zA-Z0-9]', 'alphaNumeric'],
    ['[0-9]', 'numbers'],
    ['@', 'email']
  ]);

  constructor() {}

  getErrorMessage(errors: any, fieldName: string) {
    if (errors?.required) {
      return 'Enter valid ' + fieldName;
    } else if (errors?.minlength) {
      return (
        'Enter atleast ' + errors?.minlength.requiredLength + ' characters'
      );
    } else if (errors?.pattern) {
      return (
        'Characters of ' +
        this.evaluatePattern(errors.pattern.requiredPattern) +
        ' are allowed. '
      );
    } else if (errors?.maxlength) {
      return (
        'Maximum ' +
        errors?.maxlength.requiredLength +
        ' characters are allowed'
      );
    } else if (errors?.min) {
      return (
        'Value should be greaterthan or equal to ' +
        errors?.min?.min
      );
    }  else if (errors?.max) {
      return (
        'Value should be lessthan or equal to ' +
        errors?.max?.max
      );
    }
    return '';
  }

  evaluatePattern(pattern: string) {
    let patternFormats = [...this.patternDefinitions.keys()];
    let validator = '';
    patternFormats.every((p) => {
      if (pattern.includes(p)) {
        validator = p;
        return false;
      }
      return true;
    });
    return this.patternDefinitions.get(validator);
  }
}
