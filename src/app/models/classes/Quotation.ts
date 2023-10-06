export class Quotation {
  Id: number = 0;
  AccountId: number = 0;
  ProjectId: number = 0;
  QNumber: string = '0000';
  CustomerId: number = 0;
  CustomerRef: string = '';
  RefDate: string = '';
  BuildingId: number = 0;
  UnitId: number = 0;
  WorkOrderId: number = 0;
  PaymentTermId: number = 0;
  ExpiryDate: string = '';
  ApprovalStatus: string = '';
  PaymentStatus: string = '';
  Status: string = '';
  CreatedBy: number = 0;
  CreatedDate: string = '';
  ModifiedBy: number = 0;
  ModifiedDate: string = '';
  Comment: string = '';
  SubTotal: number = 0;
  Discount: number = 0;
  Tax: number = 0;
  TaxRate: number = 0;
  TaxDescription: string = '';
  NetValue: number = 0;
  Address: string = '';
  ContactNo:string='';
  IsActive:boolean = true;
  QuoteLineItems: QuotationLineItems[] =[];
  constructor(){}
}

export class QuotationLineItems {
  Id: number = 0;
  Code: string = '';
  Description: string = '';
  UoM: string = '';
  Quantity: number = 0;
  UnitCost: number = 0;
  constructor(){}
}