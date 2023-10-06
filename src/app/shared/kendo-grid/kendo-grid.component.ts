import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CompositeFilterDescriptor, process } from '@progress/kendo-data-query';
import {
  DataBindingDirective,
  GridComponent
} from '@progress/kendo-angular-grid';

import { ColumnFormat } from 'src/app/models/enums/ColumnFormat.enum';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { FormatHelper } from 'src/app/helpers/FormatHelper';
import { IActions } from './../../models/interfaces/IActions';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { sampleProducts } from './employees';
import { take } from 'rxjs/operators';

interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  type: 'text' | 'numeric' | 'boolean' | 'date';
  sortable: boolean;
  columnFormat: ColumnFormat;
  width: number;
}

@Component({
  selector: 'app-kendo-grid',
  templateUrl: './kendo-grid.component.html',
  styleUrls: ['./kendo-grid.component.scss']
})
export class KendoGridComponent implements OnInit, AfterViewInit {
  public gridData: any = sampleProducts;
  public gridView!: unknown[];
  public selectedRows: string[] = [];
  public columns: ColumnSetting[] = [];
  public filters: any[] = [];
  public exportData: any;
  ColumnFormat = ColumnFormat;
  FormatHelper = FormatHelper;
  allRowsSelected: boolean = false;
  re: any = /\,/gi;
  actions!: IActions;

  filter!: CompositeFilterDescriptor;
  dateColumns: string[] = [];
  searchText: string = '';
  @Input() hasCustomClass: boolean = false;
  @Input() customClass: string = '';
  @Input() gridDetails: any;
  @Input() gridHeight: number = 100;
  @Input() headerTitle: string = '';
  @Input() fileName: string = 'Cafm_Report';
  @Input() selectionKey: string = 'id';
  @Input() pageable: boolean = true;
  @Input() groupable: boolean = true;
  @Input() reorderable: boolean = true;
  @Input() resizable: boolean = true;
  @Input() selectable: any = false;
  @Input() pageSize: number = 15;
  @Input() prefix: string = '';
  @Input() buttonCount = 3;
  @Input() sizes = [10, 20, 30, 50];
  @Input() isViewable: boolean = false;
  @Input() pdfScale: number = 1;
  @Output() view: EventEmitter<any> = new EventEmitter();
  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() exported: EventEmitter<any> = new EventEmitter();
  @Output() transfered: EventEmitter<any> = new EventEmitter();
  @Output() rowSelected: EventEmitter<any> = new EventEmitter();
  @Output() selectedAll: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  @ViewChild(GridComponent) public grid!: GridComponent;

  constructor(private ngZone: NgZone, private datePipe: LocalizedDatePipe) {}
  ngOnInit(): void {
    this.columns = [];
    this.actions = this.gridDetails.actions;

    this.gridDetails.configuration.columns
      .filter((c: any) => c.showColumn)
      .forEach((column: any) => {
        this.columns.push({
          title: column.displayText,
          field: column.mappingColumn,
          type: 'text',
          sortable: column.showSort,
          columnFormat: column.columnFormat ?? ColumnFormat.PLAIN_TEXT,
          width: (column.width =
            column.columnFormat === ColumnFormat.PLAIN_TEXT
              ? 150
              : column.columnFormat === ColumnFormat.HTML
              ? 250
              : 120)
        });
        if (column.columnFormat === ColumnFormat.DATE) {
          this.dateColumns.push(column.mappingColumn);
        }
        this.filters.push({
          field: column.mappingColumn,
          operator: 'contains'
        });
      });
    this.gridDetails.data?.forEach((row: any) => {
      this.dateColumns.forEach((column: any) => {
        row[column] = new Date(
          this.datePipe.transform(row[column], 'dd-MMM-yyyy')
        );
      });
    });
    this.hasAction(this.gridDetails.actions);
    this.gridData = this.gridDetails.data;
    this.gridView = this.gridData;
  }

  hasAction(actions: IActions, type?: string): boolean {
    return actions?.canEdit || actions?.canDelete;
  }

  delete(item: any): void {
    this.deleted.emit(item);
  }

  edit(item: any): void {
    this.edited.emit(item);
  }

  export(item: any): void {
    this.exported.emit(item);
  }

  transfer(item: any): void {
    this.transfered.emit(item);
  }

  public save(component: ExcelExportComponent): void {
    const options = component.workbookOptions();
    component.save(options);
  }

  public onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;
    const value = { value: inputValue };
    for (let i = 0; i < this.filters.length; i++) {
      this.filters[i] = Object.assign(this.filters[i], value);
    }
    this.gridView = process(this.gridData, {
      filter: { logic: 'or', filters: [] }
    }).data;
    this.gridData?.forEach((row: any) => {
      this.dateColumns.forEach((column: any) => {
        row[column] = this.datePipe.transform(row[column], 'dd-MMM-yyyy');
      });
    });
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: this.filters
      }
    }).data;
    this.dataBinding.skip = 0;
  }

  public ngAfterViewInit(): void {
    this.fitColumns();
  }

  public onDataStateChange(): void {
    this.fitColumns();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.loadData();
  }

  loadData(): void {
    this.searchText = '';
    this.gridData?.forEach((row: any) => {
      this.dateColumns.forEach((column: any) => {
        row[column] = new Date(
          this.datePipe.transform(row[column], 'dd-MMM-yyyy')
        );
      });
    });
    this.gridView = process(this.gridData, { filter: this.filter }).data;
  }

  selectAll(event: any): void {
    this.selectedAll.emit(event.target.checked);
  }

  private fitColumns(): void {
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this.grid?.autoFitColumns();
      });
  }

  onRowSelectionChange(event: any) {
    this.rowSelected.emit(event);
  }
}
