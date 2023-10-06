import { ColumnFormat } from './../enums/ColumnFormat.enum';
import { IEditConfig } from './IEditConfig';

export interface IColumn {
  displayText: string;
  showSort: boolean;
  mappingColumn: string;
  showColumn: boolean;
  editConfig: IEditConfig;
  columnFormat?: ColumnFormat;
  width?: string;
}
