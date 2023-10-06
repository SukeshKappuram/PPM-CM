import { ISideMenu } from './ISideMenu';
export interface IMenuGroup {
  groupId: number;
  groupName: string;
  groupImageName: string;
  groupSortOrder: number;
  groupedSections: ISideMenu[];
  hideSection: boolean;
}
