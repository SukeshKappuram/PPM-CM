import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { ValidationHelper } from 'src/app/helpers/ValidationHelper';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { SharedService } from 'src/app/services/shared.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent extends ValidationHelper implements OnDestroy {
  @Input() label: string = '';
  @Input() inputType: string = 'text';
  @Input() placeholder?: string;
  @Input() fieldName: string = '';
  @Input() isHidden: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() isRequired: boolean = true;
  @Input() isDisabled: boolean = false;
  @Input() value: any = '';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() pipe: string = '';
  @Input() showLabel: boolean = true;
  @Input() tooltip: string = '';
  @Input() min: number = 0;
  @Input() max: number = 50;
  @Input() badgeLabel: string = '';
  @Input() title: string = '';
  @Input() class: string = '';

  @Output() inputChange: EventEmitter<any> = new EventEmitter();
  @Output() onblur: EventEmitter<any> = new EventEmitter();

  @ViewChild('inputText') inputElement!: ElementRef;


  isValid: boolean = true;

  constructor(
    private validationService: ValidationService,
    private _decimalPipe: DecimalPipe,
    private _datePipe: DatePipe,
    private _currencyPipe: CurrencyPipe,
    private datePipe: LocalizedDatePipe,
    private sharedService: SharedService
  ) {
    super(validationService);
  }

  toValue(): void {
    if (this.value !== undefined && this.value !== '' && this.value !== null) {
      if (this.pipe === 'number') {
        this.value = parseFloat(this.value?.toString().replace(/,/g, ''));
      } else if (this.pipe === 'currency') {
        this.inputType = 'number';
        let currencyString: string = this.value.toString();
        this.value = parseFloat(
          currencyString.replace(this.sharedService.getCurrencyCode(), '').replace(/,/g, '')
        );
      } else if (this.pipe === 'date') {
        this.value = this._datePipe.transform(
          new Date(this.value),
          'yyyy-MM-dd'
        );
        this.inputType = 'date';
      }
    } else {
      if (this.pipe === 'date') {
        this.inputType = 'date';
      }
    }
  }

  transform(): void {
    if (this.value !== undefined && this.value !== '' && this.value !== null) {
      if (this.pipe === 'number') {
        this.value = this._decimalPipe.transform(this.value, '1.2-2');
      } else if (this.pipe === 'date') {
        this.inputType = 'text';
        this.value = this.datePipe.transform(this.value, 'dd-MMM-yyyy');
      } else if (this.pipe === 'currency') {
        this.inputType = 'text';
        this.value = this._currencyPipe.transform(
          this.value,
          this.sharedService.getCurrencyCode(),
          'code',
          '1.2-2'
        );
      }
    }
  }

  validateField(isRequired: boolean): void {
    this.isValid = isRequired
      ? !((this.formGroup.controls[this.fieldName].dirty || this.formGroup.controls[this.fieldName].touched || this.formGroup.controls[this.fieldName].pristine) && this.formGroup.controls[this.fieldName].invalid)
      : true;
  }

  getLabels(): string[] {
    return this.validationService.textLabels;
  }

  getLabel(label: string): string {
    return label.substring(label.lastIndexOf(' ') + 1).toLowerCase();
  }

  focus() {
    this.inputElement.nativeElement.focus();
  }

  blur() {
    this.inputElement.nativeElement.blur();
  }

  ngOnDestroy(){
    console.log();
  }
}
