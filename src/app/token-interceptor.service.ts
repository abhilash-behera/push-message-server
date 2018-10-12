import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req, next) {
    const apiService = this.injector.get(ApiService);
    const tokenizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${apiService.getToken()}`
      }
    });

    return next.handle(tokenizedRequest);
  }
}
