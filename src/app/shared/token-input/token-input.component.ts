import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-token-input',
  templateUrl: './token-input.component.html',
  styleUrls: ['./token-input.component.scss']
})
export class TokenInputComponent {
  @Input() items: any = [];
  @Input() showLabel: boolean = true;
  @Input() label: string = '';
  @Input() placeholder: string = 'Enter a new token';
  @Input() isReadonly: boolean = false;
  @Input() editable: boolean = true;
  @Input() removable: boolean = true;

  @Output() inputChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  elementsAdded(event: any): void {
    if (this.editable) {
      this.items.push(event);
      this.inputChange.emit(this.items);
    }
  }

  elementsRemoved(event: any): void {
    if (this.removable) {
      this.items = this.items.filter((item: any) => item.value !== event.value);
      this.inputChange.emit(this.items);
    }
  }
}
