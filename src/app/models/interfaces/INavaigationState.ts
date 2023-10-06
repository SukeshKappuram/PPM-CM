import { IMenuGroup } from './IMenuGroup';
import { IMenuItem } from './IMenuItem';
import { MasterComponentTypes } from './../enums/MasterComponentTypes.enum';

export interface INavaigationState {
  accounts?: any;
  menuGroups?: IMenuGroup[];
  selectedMenu: string;
  selectedSubMenu?: string;
  selectedGroup: string;
  selectedSubMenuItem?: string;
  subMenu?: IMenuItem;

  currentAccount?: any;
  currentAssertId: number;
  currentAuditId: number;
  currentInstructionId: number;
  currentQuestionId: number;
  currentSchedulerId: number;
  currentLogId: number;
  currentMRId: number;
  currentMasterId: number;
  currentLog?: any;
  currentMaster?: MasterComponentTypes;

  isAssetIdValid: boolean;
  isEditable: boolean;
  editUrl?: string;
  assetData?: any;
  isHeaderCall: boolean;
  quickActions?: any;
}
