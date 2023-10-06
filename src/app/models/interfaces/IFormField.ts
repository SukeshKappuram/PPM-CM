import { FormControl } from '@angular/forms';

export interface IFormField {
  fieldName: string;
  formControl: FormControl;
  isEditable: boolean;
  isHidden: boolean;
  isRequired: boolean;
  value: any;
  fieldData: any;
  fieldType: string;
  displayText: string;
  propertyName?: string;
}
