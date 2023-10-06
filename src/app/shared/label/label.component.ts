import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input() label: string = '';
  @Input() isRequired: boolean = false;
  @Input() show: boolean = true;
  @Input() tooltip: string = '';
  @Input() badgeLabel: string = '';

  constructor() {}
}
