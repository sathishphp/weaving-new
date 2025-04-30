import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor invoked'); 
  let token: string | null = localStorage.getItem("access_token");

  console.log("Token from localStorage:", token);
  if (token) { 
    const clonedRequest = req.clone({
      headers: req.headers.set(
        'x-auth-token',token
      )
    });
  
    return next(clonedRequest).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.error('Unauthorized request:', err);
          } else {
            console.error('HTTP error:', err);
          }
        } else {
          console.error('An error occurred:', err);
        }
  
        return throwError(() => err); 
      })
    );
  } else {
    console.log("no token")
    return next(req);
  }
};
