import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-area-graph',
  templateUrl: './area-graph.component.html',
  styleUrls: ['./area-graph.component.scss']
})
export class AreaGraphComponent {
  @Input() data: any = {};

  constructor() {}
}
