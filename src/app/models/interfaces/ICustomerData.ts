export interface ICustomerData {
  id: number;
  name: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  customerTypeId: number;
  customerTypeName: string;
  contactEmail: string;
  contactMobileCode: string;
  contactMobileNumber: string;
  buildingName: string;
  floorName: string;
  unitName: string;
  country: number
  state: number
  city: number
  streetNo: string
  streetName: string
  zipCode: string
  building: number
  floor: number
  unit: number
  status:string
  isActive:boolean
}
