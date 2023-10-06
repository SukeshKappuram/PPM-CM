import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Alert } from 'src/app/models/classes/alert.model';
import { AlertType } from 'src/app/models/enums/AlertType.enum';

@Component({
  selector: 'app-toast',
  templateUrl: './toastMsg.component.html',
  styleUrls: []
})
export class ToastMsgComponent {
  @Input() alerts: Alert[] = [];
  @Output() removeToast: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  setBgColor(toastType: AlertType = AlertType.Info) {
    let bgColor: string = '';
    switch (toastType) {
      case AlertType.Success:
        bgColor = 'bg-success';
        break;
      case AlertType.Error:
        bgColor = 'bg-danger';
        break;
      case AlertType.Warning:
        bgColor = 'bg-warning';
        break;
      default:
        bgColor = 'bg-info';
        break;
    }
    return bgColor;
  }

  isToastApplicable(element: string): boolean {
    // let docViewTop = $(window).scrollTop();
    // let docViewHeight = $(window).height();
    // let docViewBottom = (docViewTop ?? 0) + (docViewHeight ?? 0);
    // let elTop = $(element).offset()?.top;
    // let elHeight = $(element).height();
    // let elBottom = (elTop ?? 0) + (elHeight ?? 0);
    // return !(elBottom <= docViewBottom && (elTop ?? 0) >= (docViewTop ?? 0));
    return false;
  }
}
