import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHandlerFn,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../services/auth.service';

/* export function AuthInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
const authService = inject(AuthService);
const token = authService.ACCESS_TOKEN || 'test12345';
if (token) {
  const cloned = req.clone({
    setHeaders: {
      authorization: token,
    },
  });
  return next(cloned);
} else {
  return next(req);
}
}; */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private blackListed: string[];
  constructor(private authService: AuthService) {
    this.blackListed = [`${environment.API_BACKEND_POINT}/auth/refresh-token`];
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // stage 1: Check if request for refresh token
    /* if (!this.blackListed.includes(request.url) && request.url.indexOf('/auth/refresh-token') !== -1 ) {
      return next.handle(request);
    } */
    const data = this.authService.userData;
    const accessToken = data?.access_token;
    // stage 2: Checking access_token exists(mean user logged in) or not
    if (accessToken) {
      // stage 3: checking access_token validity
      if (this.authService.isAuthTokenValid(accessToken)) {
        let modifiedReq = request.clone({
          headers: request.headers.append('Authorization', `Bearer ${accessToken}`)
        });
        return next.handle(modifiedReq)
      }
      // stage 4: Going to generate new tokens
      return this.authService.generateNewTokens()
        .pipe(
          take(1),
          switchMap((res: any) => {
            let modifiedReq = request.clone({
              headers: request.headers.append('Authorization', `Bearer ${res?.data?.access_token}`)
            });
            return next.handle(modifiedReq)
          })
        )
      
    }
    return next.handle(request);
  }
  /* intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("authinterceptor")
    const authToken = this.authService.ACCESS_TOKEN;
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next.handle(authReq);
  } */
}