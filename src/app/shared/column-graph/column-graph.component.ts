import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-column-graph',
  templateUrl: './column-graph.component.html',
  styleUrls: ['./column-graph.component.scss']
})
export class ColumnGraphComponent{
  @Input() data:any = {};

  constructor() { }

}
