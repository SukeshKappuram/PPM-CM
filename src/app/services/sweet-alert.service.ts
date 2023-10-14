import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SweetAlertResult } from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AlertType } from './../models/enums/AlertType.enum';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService extends AlertService {

  override info(message: string, options?: any): Promise<SweetAlertResult<any>> {
    return Swal.fire(AlertType.Info.toLocaleUpperCase(), message, AlertType.Info);
  }

  override success(message: string, options?: any): Promise<SweetAlertResult<any>> {
    return Swal.fire(AlertType.Success.toLocaleUpperCase(), message, AlertType.Success);
  }

  override error(message: string, options?: any, err?: any): Promise<SweetAlertResult<any>> {
    if (err instanceof HttpErrorResponse && err.status === 401){
      return Swal.fire(AlertType.Error.toLocaleUpperCase(), 'Session has been timed out', AlertType.Error);
    }
    return Swal.fire(AlertType.Error.toLocaleUpperCase(), message, AlertType.Error);
  }

  override warn(message: string, options?: any): Promise<SweetAlertResult<any>> {
    return Swal.fire(AlertType.Warning.toLocaleUpperCase(), message, AlertType.Warning);
  }

  alertConfirmation() {
    Swal.fire({
      position: 'top-end',
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Removed!',
          'Item removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Item is safe.)',
          'error'
        )
      }
    })
  }


  async emailNotification() {
    const { value: email } = await Swal.fire({
      //position: 'bottom-end',
      title: 'Input email address',
      input: 'email',
      inputPlaceholder: 'Enter your email address'
    })

    if (email) {
      Swal.fire(`Entered email: ${email}`)
    }
  }

}
