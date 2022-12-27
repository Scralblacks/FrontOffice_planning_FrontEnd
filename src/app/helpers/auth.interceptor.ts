import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthStorageService} from "../services/auth-storage/auth-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private authStorageService: AuthStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let currentRequest = req;

    const token = this.authStorageService.getToken();
    if (token) {
      currentRequest = req.clone({headers: req.headers.set("Authorization", 'Bearer ' + token)})
    }

    return next.handle(currentRequest);
  }
}


export const AuthInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  }
];
