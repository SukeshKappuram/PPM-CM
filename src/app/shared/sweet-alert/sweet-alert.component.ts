import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-sweet-alert',
  templateUrl: './sweet-alert.component.html',
  styleUrls: ['./sweet-alert.component.scss']
})
export class SweetAlertComponent {
  @ViewChild('swalDialog')
  public readonly swalDialog!: SwalComponent;
  @Input() title :string = '';
  @Input() text :string = '';
  @Input() type :SweetAlertIcon | undefined = 'success'

  constructor() { }

  confirm() {}

}
