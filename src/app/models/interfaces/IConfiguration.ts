import { IColumn } from './IColumn';

export interface IConfiguration {
  columns: IColumn[];
  systemCodes: any[];
  subSystemCodes: any[];
  parameterTypeCodes: any[];
  subGroups?: any[];
}
