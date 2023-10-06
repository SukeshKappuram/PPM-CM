import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.authService.securityObject.access_token;
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    return new Observable((observer) => {
      next.handle(request).subscribe({
        next: (event) => {
          if (event instanceof HttpResponse) {
            observer.next(event);
          }
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              observer.error('Unauthorized');
              if(accessToken !== ''){
                window.open('?returnUrl=' + this.router.url, '_self');
              }
            } else {
              observer.error(err);
            }
          }
        },
        complete: () => {
          observer.complete();
        }
      });
    });
  }
}
