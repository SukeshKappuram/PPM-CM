import { Component, Input, OnInit } from '@angular/core';

import { SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';

@Component({
  selector: 'app-stacked-graph',
  templateUrl: './stacked-graph.component.html',
  styleUrls: ['./stacked-graph.component.scss']
})
export class StackedGraphComponent implements OnInit {
  @Input() type: any = 'bar';
  @Input() data: any = {};
  @Input() isStack: boolean = true;
  blankData: number[] = [];
  stacks: Set<string> = new Set();

  ngOnInit(): void {
    this.data.series.forEach((series: any) => {
      series.data.forEach((element: any) => {
        if (!this.stacks.has(element.name)) {
          this.stacks.add(element.name);
          this.blankData.push(0);
        }
      });
    });
  }

  public setTotal = (args: SeriesLabelsContentArgs) => {
    const total = args.stackValue;
    return total + '';
  };
}
