import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler {
  errorsObject: any[] = [];
  constructor(private injector: Injector) {
    super();
  }
  override handleError(error: any): void {
    const router = this.injector.get(Router);
    this.errorsObject.push({ message: router.url, error: error.toString() });
    if (this.errorsObject.length >= 1) {
      // this.storeErrors().subscribe(() => {
      //   this.errorsObject = [];
      // });
      if (error.status === 500) {
        let err = error.error.toString();
        console.warn(
          error.statusText +
            ': API Server Error => ' +
            err.substring(
              err.indexOf(':') + 1,
              err.indexOf(':') + err.indexOf('at ')
            )
        );
      } else if (error.status === 404) {
        console.warn(error.statusText + ': API URL Not Found');
      } else if (error.status === 401) {
        router.navigate(['/']);
      } else {
        console.error(error.message);
      }
    }
  }
}
