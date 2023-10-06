import { IMenuItem } from './IMenuItem';

export interface ISideMenu {
  sectionId: number;
  title: string;
  showVertical: boolean;
  iconName: string;
  menuItems: IMenuItem[];
}
