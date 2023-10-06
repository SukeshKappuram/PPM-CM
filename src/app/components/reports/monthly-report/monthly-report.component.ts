import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GridComponent } from '@progress/kendo-angular-grid';
import { Group, exportPDF } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';
import { ApiService } from 'src/app/services/api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CommonComponent } from '../../common/common.component';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss']
})
export class MonthlyReportComponent extends CommonComponent {
  monthlyReportForm: FormGroup = new FormGroup({});
  reports: any[] = [];
  allReports: any[] = [];
  tableReports: any[] = [];
  hidePdfReportData = false;
  reportDate = new Date();
  filterData: any = {};
  @ViewChildren(GridComponent) grids!: QueryList<GridComponent>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute
  ) {
    super();
    this.config['apiEndpoint'] = this.ApiEndpoints.REPORTAPI;
    this.config['isProjectMandatory'] =
      this.route.snapshot.data['isProjectMandatory'] ?? true;
  }

  getReports(filter: any) {
    if (
      this.config.isProjectMandatory &&
      (filter.projectId == '' ||
        filter.projectId == undefined ||
        filter.projectId == null)
    ) {
      this.alertService.error('Please Select Project!!', {
        id: 'monthly-report'
      });
    } else {
      this.filterData = filter;
      let projectId = filter?.project?.id ?? filter?.projectId;
      let year = filter?.year?.id ?? filter?.year;
      let month = filter?.month?.id ?? filter?.month;
      this.apiService
        .getReports(
          'MonthlyReports/GetMontlyReportData',
          projectId,
          year,
          month
        )
        .subscribe((result: any) => {
          if (result) {
            this.reports = [];
            this.allReports = [];
            this.tableReports = [];
            let tableData: any[];
            let rowData: any;
            let totalData: any;
            Object.keys(result).forEach((key: string) => {
              let sum = result[key]?.data?.reduce(
                (sum: number, current: any) => sum + current.value,
                0
              );
              result[key]?.data?.forEach((element: any) => {
                element['percent'] =
                  Math.round(
                    100 * (sum > 0 ? (element.value / sum) * 100 : 0)
                  ) / 100;
              });
              if (result[key].displayType == this.ReportType.Table) {
                if (result[key].tableRows) {
                  tableData = [];
                  if (result[key].isAutoCalculated) {
                    totalData = {};
                    result[key].tableColumns.forEach(
                      (row: any, index: number) => {
                        row.id = row.id.toString();
                        totalData[row.id] = index == 0 ? 'Total' : 0;
                      }
                    );
                    result[key].tableRows.forEach((tableRowData: any) => {
                      rowData = {};
                      tableRowData.values.forEach((rowValueData: any) => {
                        rowData[rowValueData.id.toString()] =
                          rowValueData.value;
                        if (rowValueData.value > 0) {
                          totalData[rowValueData.id.toString()] += Number(
                            rowValueData.value
                          );
                        }
                      });
                      tableData.push(rowData);
                    });
                    tableData.push(totalData);
                  } else {
                    result[key].tableColumns.forEach((row: any) => {
                      row.id = row.id.toString();
                    });
                    result[key].tableRows.forEach((tableRowData: any) => {
                      rowData = {};
                      tableRowData.values.forEach((rowValueData: any) => {
                        rowData[rowValueData.id.toString()] =
                          rowValueData.value;
                      });
                      tableData.push(rowData);
                    });
                  }
                  result[key]['tableData'] = tableData;
                }
                this.tableReports.push(result[key]);
              } else {
                this.reports.push(result[key]);
              }
              this.allReports.push(result[key]);
            });
            this.isDataLoaded = true;
          }
        });
    }
  }

  calc(data: any[], columnId: any): number {
    let sum = 0;
    data.forEach((row: any) => {
      sum += parseInt(row.values.find((v: any) => v.id === columnId)?.value);
    });
    return sum;
    // return data?.reduce(
    //   (sum: number, current: any) => sum + current.value,
    //   0
    // );
  }

  exportToPdf() {
    this.hidePdfReportData = false;
    const promises = this.grids.map((grid) => grid.drawPDF());
    Promise.all(promises)
      .then((groups) => {
        const rootGroup = new Group({
          pdf: {
            multiPage: true
          }
        });
        groups.forEach((group) => {
          rootGroup.append(...group.children);
        });
        return exportPDF(rootGroup, { paperSize: 'A1', multiPage: true });
      })
      .then((dataUri) => {
        saveAs(dataUri, 'Monthly Report.pdf');
        this.hidePdfReportData = true;
      });
  }

  protected override buttonClicked(buttonType: any): void {
    throw new Error('Method not implemented.');
  }
}
