import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationHelper } from 'src/app/helpers/ValidationHelper';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends ValidationHelper {
  @Input() label: string = '';
  @Input() dataList?: any[] = [];
  @Input() placeholder: string = '';
  @Input() isReadonly: boolean = false;
  @Input() isRequired: boolean = true;
  @Input() value: any = '';
  @Input() valueKey: any = 'id';
  @Input() labelKey: any = 'name';
  @Input() secondaryLabelKey?: any = 'code';
  @Input() fieldName: string = '';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() showLabel: boolean = true;
  @Input() tooltip: string = '';
  @Input() customClass: string = '';

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  isValid: boolean = true;
  isFocused: boolean = false;

  constructor(private validationService: ValidationService) {
    super(validationService);
  }

  validateField(): void {
    this.isValid =
      !this.formGroup.controls[this.fieldName].pristine &&
      this.formGroup.controls[this.fieldName].invalid;
  }

  public setToDefault(value?:any): void {
    this.isFocused = false;
    this.value = value??'';
  }

  getLabels(): string[] {
    return this.validationService.dropdownLabels;
  }

  getLabel(label: string): string {
    return label.substring(label.lastIndexOf(' ') + 1).toLowerCase();
  }
}
