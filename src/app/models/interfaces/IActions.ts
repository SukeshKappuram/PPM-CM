export interface IActions{
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canSelect?: boolean;
  canSearch?: boolean;
  canAccessPDF?: boolean;
  canAccessExcel?: boolean;
  modifyColumnView?: boolean;
  canExport?: boolean;
  canTransfer?: boolean;
}
