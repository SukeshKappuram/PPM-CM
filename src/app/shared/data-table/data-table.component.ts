import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { Actions } from './../../models/enums/Actions.enum';
import { ColumnFormat } from 'src/app/models/enums/ColumnFormat.enum';
import { IGridData } from './../../models/interfaces/IGridData';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() edited = new EventEmitter<any>();
  @Output() deleted = new EventEmitter<any>();
  @Input() headerTitle: string = '';
  @Input() isViewable: boolean = false;
  @Input() pageLength: number = 15;
  @Input() gridData: IGridData = {
    configuration: {
      columns: [],
      systemCodes: [],
      subSystemCodes: [],
      parameterTypeCodes: []
    },
    actions: {
      canAdd: true,
      canEdit: true,
      canDelete: true
    },
    data: []
  };
  rows: any[] = [];
  columns: any[] = [];
  nonSortableColumns: any[] = [];
  // dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  // @ViewChild(DataTableDirective, { static: false }) datatableElement: any =
  //   DataTableDirective;
  @Output() rowSelected: EventEmitter<any> = new EventEmitter();
  @Output() selectedAll: EventEmitter<any> = new EventEmitter();

  ColumnFormat = ColumnFormat;

  constructor(private datePipe: LocalizedDatePipe) {}

  ngOnInit(): void {
    if (this.gridData?.configuration?.columns?.length == 0) {
      //this.gridData = this.getSampleData();
    } else if (this.gridData?.configuration?.columns?.length > 0) {
      let index = 0;
      if (this.hasAction(this.gridData.actions)) {
        this.columns.push({ title: 'Actions' });
        this.nonSortableColumns.push(index);
        index++;
      }
      if (this.gridData?.actions?.canSelect) {
        this.columns.push({
          title:
            '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="selectAll"><label id="selectedAll" class="custom-control-label" for="selectAll"></label></div>',
          data: 'selectAll'
        });
        this.nonSortableColumns.push(index);
        index++;
      }
      this.gridData.configuration.columns
        .filter((c) => c.showColumn)
        .forEach((column) => {
          this.columns.push({
            title: column.displayText,
            data: column.mappingColumn,
            ngPipeInstance:
              column.columnFormat === ColumnFormat.DATE ? this.datePipe : null
          });
          if (!column.showSort) {
            this.nonSortableColumns.push(index);
          }
          index++;
        });
      this.rows = this.applyFilter();
    }
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: this.pageLength,
    //   serverSide: false,
    //   processing: true,
    //   retrieve: true,
    //   dom: 'Bfrtip',
    //   responsive: true,
    //   columns: this.columns,
    //   columnDefs: [
    //     {
    //       targets: 0,
    //       defaultContent:
    //         '<div class="list-icons" id="grid-item">' +
    //         '<div class="dropdown position-static">' +
    //         '<a class="btn btn-sm btn-outline-secondary-100 border-2 btn-icon btn-icon-action rounded-pill dropdown-toggle"' +
    //         'role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
    //         '<i class="bi bi-three-dots font-size-sm" style="transform: rotate(90deg);" title="Actions"></i>' +
    //         '</a>' +
    //         '<div class="dropdown-menu dropdown-menu-left">' +
    //         (this.hasAction(this.gridData?.actions, 'edit') && this.isViewable
    //           ? '<a (click)="edit(row)" class="dropdown-item" id="view-grid-item"><i class="bi bi-card-list font-size-xs"></i> View</a>'
    //           : '') +
    //         (this.hasAction(this.gridData?.actions, 'edit') && !this.isViewable
    //           ? '<a (click)="edit(row)" class="dropdown-item" id="edit-grid-item"><i class="bi bi-pencil-square font-size-xs"></i> Edit</a>'
    //           : '') +
    //         (this.hasAction(this.gridData?.actions, 'delete')
    //           ? '<a (click)="delete(row)" class="dropdown-item" id="delete-grid-item"><i class="bi bi-trash font-size-xs"></i> Delete</a>'
    //           : '') +
    //         '</div> </div> </div>'
    //     },
    //     {
    //       targets: this.nonSortableColumns, // column index (start from 0)
    //       orderable: false // set orderable false for selected columns
    //     }
    //   ],
    //   data: this.gridData.data,
    //   language: {
    //     emptyTable: 'No data available'
    //   },
    //   scrollX: true,
    //   deferRender: true
    // };
  }

  ngAfterViewInit() {
    console.log('');
    // setTimeout(() => {
    //   // race condition fails unit tests if dtOptions isn't sent with dtTrigger
    //   this.dtTrigger.next(this.dtOptions);
    // }, 200);

    // let rowIndex = -1;
    // let that = this;
    // let data = this.gridData.data;
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   $('input[type=search].form-control').on('change', function (e) {
    //     let x: any = e.target;
    //     data = that.gridData.data.filter((d: any) =>
    //       JSON.stringify(d)
    //         .toLowerCase()
    //         .includes(x.value?.toString().toLowerCase())
    //     );
    //   });
    //   $('#d-data-table tbody').on('click', '#view-grid-item', function () {
    //     var tr = $(this).closest('tr');
    //     let page = dtInstance.page();
    //     rowIndex = page * that.pageLength + tr.index();
    //     let row = data[rowIndex];
    //     that.edit(row);
    //   });
    //   $('#d-data-table tbody').on('click', '#edit-grid-item', function () {
    //     var tr = $(this).closest('tr');
    //     let page = dtInstance.page();
    //     rowIndex = page * that.pageLength + tr.index();
    //     let row = data[rowIndex];
    //     that.edit(row);
    //   });
    //   $('#d-data-table tbody').on('click', '#delete-grid-item', function () {
    //     var tr = $(this).closest('tr');
    //     let page = dtInstance.page();
    //     rowIndex = page * that.pageLength + tr.index();
    //     let row = data[rowIndex];
    //     that.delete(row);
    //   });
    // });
    //var page=datatable.page.info().page;
    //alert(datatable +' - ' + page);
  }

  ngOnDestroy(): void {
    console.log();
    // this.dtTrigger.unsubscribe();
  }

  hasAction(actions?: any, type?: string): boolean {
    if (type === Actions.canEdit) {
      return actions?.canEdit;
    } else if (type === Actions.canDelete) {
      return actions?.canDelete;
    }
    return actions?.canEdit || actions?.canDelete;
  }

  delete(item: any): void {
    this.deleted.emit(item);
  }

  edit(item: any): void {
    this.edited.emit(item);
  }

  onSelectionChange(item: any): void {
    this.rowSelected.emit(item);
  }

  selectAll(evnt: any) {
    this.selectedAll.emit();
  }

  filterChanged(key: any, value: any): void {
    this.rows = [];
    this.rows = this.applyFilter(key, value);
    //this.reloadData();
  }

  applyFilter(key?: any, value?: any) {
    if (key && value) {
      return this.gridData?.data.filter((e: any) => {
        return e[key] == value;
      });
    }
    return this.gridData?.data;
  }

  reloadData() {
    // $.fn.dataTable.ext.errMode = 'none';
    // let datatable = $('#d-data-table').DataTable();
    // //datatable reloading
    // datatable.destroy();
    // $('#d-data-table').DataTable({
    //   pagingType: 'full_numbers',
    //   pageLength: this.pageLength,
    //   serverSide: false,
    //   processing: true,
    //   retrieve: true,
    //   dom: 'Bfrtip',
    //   responsive: true,
    //   columns: this.columns,
    //   columnDefs: [
    //     {
    //       targets: 0,
    //       defaultContent:
    //         '<div class="list-icons" id="grid-item">' +
    //         '<div class="dropdown position-static">' +
    //         '<a class="btn btn-sm btn-outline-secondary-100 border-2 btn-icon btn-icon-action rounded-pill dropdown-toggle"' +
    //         'role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
    //         '<i class="bi bi-three-dots font-size-sm" style="transform: rotate(90deg);" title="Actions"></i>' +
    //         '</a>' +
    //         '<div class="dropdown-menu dropdown-menu-left">' +
    //         (this.hasAction(this.gridData?.actions, 'edit') && this.isViewable
    //           ? '<a (click)="edit(row)" class="dropdown-item" id="view-grid-item"><i class="bi bi-card-list font-size-xs"></i> View</a>'
    //           : '') +
    //         (this.hasAction(this.gridData?.actions, 'edit') && !this.isViewable
    //           ? '<a (click)="edit(row)" class="dropdown-item" id="edit-grid-item"><i class="bi bi-pencil-square font-size-xs"></i> Edit</a>'
    //           : '') +
    //         (this.hasAction(this.gridData?.actions, 'delete')
    //           ? '<a (click)="delete(row)" class="dropdown-item" id="delete-grid-item"><i class="bi bi-trash font-size-xs"></i> Delete</a>'
    //           : '') +
    //         '</div> </div> </div>'
    //     },
    //     {
    //       targets: this.nonSortableColumns, // column index (start from 0)
    //       orderable: false // set orderable false for selected columns
    //     }
    //   ],
    //   data: this.gridData.data,
    //   language: {
    //     emptyTable: 'No data available'
    //   },
    //   scrollX: true,
    //   deferRender: true
    // });
  }

  getSampleData(): IGridData {
    return {
      configuration: {
        columns: [
          {
            displayText: 'ID',
            showSort: true,
            mappingColumn: 'id',
            showColumn: true,
            editConfig: {
              showField: true,
              isReadOnly: true,
              mappingData: '',
              fieldType: 'text'
            }
          },
          {
            displayText: 'FirstName',
            showSort: true,
            mappingColumn: 'firstName',
            showColumn: true,
            editConfig: {
              showField: true,
              isReadOnly: false,
              mappingData: '',
              fieldType: 'text'
            }
          },
          {
            displayText: 'LastName',
            showSort: true,
            mappingColumn: 'lastName',
            showColumn: true,
            editConfig: {
              showField: true,
              isReadOnly: false,
              mappingData: '',
              fieldType: 'text'
            }
          }
        ],
        systemCodes: [],
        subSystemCodes: [],
        parameterTypeCodes: []
      },
      actions: {
        canAdd: true,
        canEdit: true,
        canDelete: true
      },
      data: [
        { id: 1, firstName: 'Mike', lastName: 'Jakson' },
        { id: 2, firstName: 'Billiam', lastName: 'James' }
      ]
    };
  }
}
