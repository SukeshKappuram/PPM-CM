import { AlertType } from '../enums/AlertType.enum';

export class Alert {
  id: string = '';
  type: AlertType = AlertType.Info;
  message: string = '';
  autoClose: boolean = true;
  keepAfterRouteChange: boolean = false;
  fade: boolean = false;
  isToast: boolean = false;
  isAlert: boolean = false;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}
