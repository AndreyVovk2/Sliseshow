import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders,
} from '@angular/common/http';
import { AppStore } from '../store/app.store';

@Injectable()
export class TokenInterceptor implements HttpInterceptor  {
  constructor(public store: AppStore) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (typeof localStorage.currentUser !== 'undefined') {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.store.state.authCredentials.token}`
      }
    });
  }
    return next.handle(request);
  }

  subscribeStateUpdates = (): void => {
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }
}
