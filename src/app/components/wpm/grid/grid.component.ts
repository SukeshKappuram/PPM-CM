import { Component, OnInit } from '@angular/core';

import { ColumnFormat } from 'src/app/models/enums/ColumnFormat.enum';
import { IGridData } from 'src/app/models/interfaces/IGridData';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  conditionalAuditData: IGridData = {
    configuration: {
      columns: [
        {
          displayText: 'CA Code',
          showSort: false,
          mappingColumn: 'code',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Status',
          showSort: false,
          mappingColumn: 'status',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Audit Date',
          showSort: false,
          mappingColumn: 'auditDate',
          showColumn: true,
          columnFormat: ColumnFormat.DATE,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Category',
          showSort: false,
          mappingColumn: 'categoryName',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Created By',
          showSort: false,
          mappingColumn: 'createdBy',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Before Image',
          showSort: false,
          mappingColumn: 'beforeImageUrl',
          showColumn: true,
          columnFormat: ColumnFormat.IMAGE,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'After Image',
          showSort: false,
          mappingColumn: 'afterImageUrl',
          showColumn: true,
          columnFormat: ColumnFormat.IMAGE,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Action By',
          showSort: false,
          mappingColumn: 'resourceName',
          showColumn: true,
          editConfig: {
            showField: true,
            isReadOnly: false,
            mappingData: '',
            fieldType: 'text'
          }
        },
        {
          displayText: 'Action Taken',
          showSort: false,
          mappingColumn: 'actionTaken',
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
      canAdd: false,
      canEdit: false,
      canDelete: false
    },
    data: []
  };

  constructor() { }


}
