import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationHelper } from 'src/app/helpers/ValidationHelper';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-textarea-field',
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss']
})
export class TextareaFieldComponent extends ValidationHelper implements OnDestroy {
  @Input() label: string = '';
  @Input() placeholder?: string;
  @Input() isReadonly: boolean = false;
  @Input() isRequired: boolean = true;
  @Input() innerHtml: string = '';
  @Input() value: any = '';
  @Input() fieldName: string = '';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() tooltip: string = '';
  @Input() showLabel: boolean = true;
  @Input() rows: number = 2;

  @Output() inputChange: EventEmitter<any> = new EventEmitter();

  isValid: boolean = true;

  constructor(private validationService: ValidationService) {
    super(validationService);
  }

  validateField(): void {
    this.isValid =
      !this.formGroup.controls[this.fieldName].pristine &&
      this.formGroup.controls[this.fieldName].invalid;
  }

  ngOnDestroy(){
    console.log();
  }
}
