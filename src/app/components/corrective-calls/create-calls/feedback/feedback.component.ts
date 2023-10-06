import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent{
  @Input() feedback: any;
  @Input() urlnode: string = 'TaskLog';
  constructor() { }
}
