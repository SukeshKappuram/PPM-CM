import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { ValidationHelper } from 'src/app/helpers/ValidationHelper';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-multi-dropdown',
  templateUrl: './multi-dropdown.component.html',
  styleUrls: ['./multi-dropdown.component.scss']
})
export class MultiDropdownComponent extends ValidationHelper implements OnInit {
  data: any[] = [];
  isValid: boolean = true;
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
  @Input() searchText: string = '';

  @Output() InputChange: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('allSelected') private allSelected!: MatOption;

  constructor(private validationService: ValidationService) {
    super(validationService);
  }

  ngOnInit(): void {
    if (this.dataList) {
      this.data = this.dataList;
    }
  }

  onInputChange(event: any) {
    let searchTerm = event.target.value;
    if (searchTerm && this.dataList) {
      this.data = this.dataList.filter((building: any) =>
        String(building.name?.toLowerCase()).includes(
          searchTerm?.toLowerCase()
        )
      );
    } else {
      this.data = this.dataList ?? [];
    }
  }

  toggleAllSelection() {
    if (this.data) {
      this.value = this.allSelected.selected
        ? [...this.data.map((item: any) => item.id), 0]
        : [];
      this.selectionChange.emit(this.value);
    }
  }

  togglePerOne(all: any): boolean {
    let result = false;
    if (this.dataList) {
      if (this.allSelected.selected) {
        this.allSelected.deselect();
        result = false;
      } else if (this.value.length === this.dataList?.length) {
        this.allSelected.select();
        this.value = [...this.dataList.map((item: any) => item.id), 0];
        result = true;
      }
    }
    this.selectionChange.emit(this.value);
    return result;
  }

  validateField(): void {
    this.isValid =
      !this.formGroup.controls[this.fieldName].pristine &&
      this.formGroup.controls[this.fieldName].invalid;
  }

  getLabels(): string[] {
    return this.validationService.dropdownLabels;
  }

  getLabel(label: string): string {
    return label.substring(label.lastIndexOf(' ') + 1).toLowerCase();
  }
}
