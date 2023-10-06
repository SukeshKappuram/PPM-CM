import { INavaigationState } from 'src/app/models/interfaces/INavaigationState';
export interface INavigatedMenu {
  menuName: string;
  menuUrl: string;
  navState: INavaigationState;
}
