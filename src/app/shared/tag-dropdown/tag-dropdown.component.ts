import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tag-dropdown',
  templateUrl: './tag-dropdown.component.html',
  styleUrls: ['./tag-dropdown.component.scss']
})
export class TagDropdownComponent {
  @Input() items: any = [];
  @Input() showLabel: boolean = true;
  @Input() label: string = '';
  @Input() placeholder: string = 'Enter a new token';
  @Input() autocompleteItems:string[] = [];
  @Input() onlyFromAutocomplete:boolean = true;
  @Input() isReadonly: boolean = false;

  @Output() inputChange: EventEmitter<any> = new EventEmitter();
  constructor() { }

  elementsAdded(event: any): void {
    if (true) {
      this.items.push(event);
      this.inputChange.emit(this.items);
    }
  }

  elementsRemoved(event: any): void {
    if (true) {
      this.items = this.items.filter((item: any) => item.value !== event.value);
      this.inputChange.emit(this.items);
    }
  }

}
