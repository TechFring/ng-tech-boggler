import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/http-interceptors/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
    public loaderService: LoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true);

    const token = this.authService.getAccessToken();
    let request: HttpRequest<any> = req;

    if (token) {
      request = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    return next.handle(request).pipe(
      catchError(this.handleError),
      finalize(() => this.loaderService.isLoading.next(false))
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocorreu um erro', error.error);
    } else {
      console.error(
        `Código do erro: ${error.status}, - ` +
          `Erro: ${JSON.stringify(error.error)}`
      );

      // if (error.status === 401 && error.error.code === 'token_not_valid') {
      // this.authService.logout();
      // }
    }

    return throwError('Ocorreu um erro, tente novamente');
  }
}
