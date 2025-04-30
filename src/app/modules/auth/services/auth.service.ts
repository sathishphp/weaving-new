import { Injectable } from '@angular/core';
import { API_ENDPOINTS, ApiMethod } from '../../../core/shared/utils/const';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Employee } from '../../models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.EMPLOYEE_LIST).pipe(catchError(this.handleError));
  }

  saveToken(token){
    localStorage.setItem("accessToken",token);
  }

  getToken(){
    return localStorage.getItem("accessToken");
  }

  isAuthenticated(){
    return localStorage.getItem("accessToken");
  }
  /* signIn(data:any) {
    return this.http.requestCall(API_ENDPOINTS.logIn,ApiMethod.POST,'',data)
  }

  resetPassword(data:any,token) {
    return this.http.requestCall(API_ENDPOINTS.resetPassword,ApiMethod.POST,token,data)
  }
  forgetPassword(data:any) {
    return this.http.requestCall(API_ENDPOINTS.forgetPassword,ApiMethod.POST,'',data)
  }

  signUp(data:any) {
    return this.http.requestCall(API_ENDPOINTS.signUp,ApiMethod.POST,'',data)
  }
 */
  logout() {
    localStorage.clear();
  }

  login(postObj): Observable<Employee[]> {
    return this.http.post<Employee[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.LOGIN, postObj).pipe(catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage))
  }
}
