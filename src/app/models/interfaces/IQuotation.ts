export interface IQuotation {
  id: number;
  text: string;
  value: string;
}

export interface ICustomer {
  id: number;
  buildingId: number;
  unitId: number;
  name: string;
  contactEmail: string;
  contactMobileCode: string;
  contactMobileNumber: string;
  address: string;
  projectId: number;
  resourceId: number;
}

export interface IItemCode {
  id: number;
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  unitCost: number;
}

export interface IQUoM {
  id: number;
  unit: string;
}


export interface IBuilding {
  projectId: number;
  id: number;
  name: string;
  code: string;
}

export interface IPaymentTerm{
  id: number;
  code: string;
  description: string;
}

export interface IProject{
  id: number;
  code: string;
  name: string;
}

export interface ISpaceUnit{
  //projectId: number;
  buildingId: number;
  id: number;
  name: number;
  title: string;
}

export interface IWorkOrder{
  taskId: number;
  buildingId: number;
  projectId: number;
  unitId: number;
  statusId: number;
  workOrderCode: string;
  workOrderTitle: string;
  email: string;
  mobileNumber: string;
}

export interface IQuotationListing
{  
  id: number;
  projectId: number;
  buildingId: number;
  spaceUnitId: number;  
  customerId: number;  
  buildingName: string;
  projectName: string;
  spaceUnit: string;
  customerName: string;
  customerEmail: string;
  customerMobNo: string;
  quoteNumber: string;
  quoteStatus: string;
  workOrder: string;
  woStatus: string;
  IssuedOn: string;
  paymentStatus: string;
  NetValue: number;
}

export interface IMasterPriceList
{  
  id: number;
  projectId: number;
  itemCode: string;
  fLOC: string;
  description: string;
  quantity: number;
  unitCost: number;
  brand: string;
  warranty: string;
  location: string;
  brandId: number;
  warrantyId: number;
  locationId: number;
  isActive: boolean;
}

