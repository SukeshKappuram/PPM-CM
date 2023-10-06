export interface IMenuItem {
  tabId: number;
  tabName: string;
  pageTitle: string
  pageDescription: string;
  url: string;
  editUrl: string;
  webUrl: string;
  sortOrder: number;
  dataFormat: number;
  canAdd: boolean;
  canApprove: boolean;
  canDelete: boolean;
  canDownload: boolean;
  canExport: boolean;
  canUpdate: boolean;
}
