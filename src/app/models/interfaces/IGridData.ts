import { IActions } from './IActions';
import { IConfiguration } from './IConfiguration';

export interface IGridData {
  configuration: IConfiguration;
  actions: IActions;
  data: any;
}
