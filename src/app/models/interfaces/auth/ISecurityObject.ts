import { IUser } from './IUser';

export interface ISecurityObject extends IUser {
  access_token: string;
  account_name?: string;
  token_type: string;
  expires_in: number;
  issued: string;
  expires: string;
  timeZone?: string;
}
