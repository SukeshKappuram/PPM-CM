import { Component } from '@angular/core';

@Component({
  selector: 'app-button-dropdown',
  templateUrl: './button-dropdown.component.html',
  styleUrls: ['./button-dropdown.component.scss']
})
export class ButtonDropdownComponent {
  valid: boolean = false;
  constructor() {}

  save(): void {}

  delete(): void {}

  update(): void {}
}
