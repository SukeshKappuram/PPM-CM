import {
  ChartComponent,
  SeriesLabelsContentArgs
} from '@progress/kendo-angular-charts';
import { Component, Input, ViewChild } from '@angular/core';

import { IntlService } from "@progress/kendo-angular-intl";
import { saveAs } from "@progress/kendo-file-saver";

@Component({
  selector: 'app-pie-graph',
  templateUrl: './pie-graph.component.html',
  styleUrls: ['./pie-graph.component.scss']
})
export class PieGraphComponent {
  public autofit = true;
  @Input() public title: string = 'Sample Pie Chart';
  @Input() public data: any = [];
  @Input() public labelKey: string = 'category';
  @Input() public valueKey: string = 'value';
  @Input() public colorKey: string = 'color';
  @Input() public isTabularRequired: boolean = false;
  @Input() public isEnlarged: boolean = false;
  @ViewChild('chart') private chart!: ChartComponent;

  constructor(private intl: IntlService) {
    this.labelContent = this.labelContent.bind(this);
  }

  public labelContent(args: SeriesLabelsContentArgs): string {
    return (args.dataItem.name == null) ? `${args.dataItem.value}` : `${args.dataItem.name} ${args.dataItem.value} (${args.dataItem.percent} %)`;
  }

  public exportChart(): void {
    this.chart.exportImage().then((dataURI) => {
      saveAs(dataURI, 'chart.png');
    });
  }
}
