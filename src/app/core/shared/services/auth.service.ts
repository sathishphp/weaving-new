import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Employee } from '../../../modules/models/employee-model';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../utils/const';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ACCESS_TOKEN = 'access_token';
  REFRESH_TOKEN = 'refresh_token';
  private userDataSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  userData$: Observable<any> = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) {
    if (localStorage.getItem(this.ACCESS_TOKEN) && localStorage.getItem(this.REFRESH_TOKEN)) {
      const access_token = (<string>localStorage.getItem(this.ACCESS_TOKEN));
      const refresh_token = (<string>localStorage.getItem(this.REFRESH_TOKEN))
      this.userDataSubject.next({ access_token, refresh_token, userInfo: this.getUserDataFromToken(access_token) })
    }
  }

  get userData(): any {
    // return userData(userInfo, access_token, refresh_token) or null
    return this.userDataSubject.value
  }

  login(postObj): Observable<any> {
    return this.http.post(environment.API_BACKEND_POINT + API_ENDPOINTS.LOGIN, postObj).pipe(
      map((res: any) => {
        const access_token = res?.access_token;
        const refresh_token = res?.refresh_token;
        this.userDataSubject.next({ access_token, refresh_token, userInfo: this.getUserDataFromToken(access_token) });
        localStorage.setItem(this.ACCESS_TOKEN, access_token)
        localStorage.setItem(this.REFRESH_TOKEN, refresh_token)
        return res
      })
    )
  }

  getEmployeesList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.EMPLOYEE_LIST).pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    this.userDataSubject.next(null);
    // Call http logout method for block refresh token
  }

  generateNewTokens(): Observable<any> {
    const refresh_token = this.userDataSubject.value?.refresh_token;
    return this.http.post(environment.API_BACKEND_POINT + API_ENDPOINTS.REFRESH_TOKEN, { refresh_token }).pipe(
      map((res: any) => {
        const access_token = res?.data?.access_token;
        const refresh_token = res?.data?.refresh_token;
        this.userDataSubject.next({ access_token, refresh_token, userData: this.getUserDataFromToken(access_token) });
        localStorage.setItem(this.ACCESS_TOKEN, access_token);
        localStorage.setItem(this.REFRESH_TOKEN, refresh_token);
        return res
      })
    )
  }
  get isAuthenticated(): boolean {
    const refresh_token = this.userDataSubject.value?.refresh_token;
    if (!refresh_token) {
      return false
    }
    return this.isAuthTokenValid(refresh_token)
  }

  isAuthTokenValid(token: string): boolean {
    const decoded: any = jwtDecode(token);
    // default decoded exp format is second
    const expMilSecond: number = decoded?.exp * 1000; // milliseconds
    const currentTime = Date.now(); // milliseconds
    if (expMilSecond < currentTime) {
      return false;
    }
    return true;
  }

  getUserDataFromToken(token: string): any {
    const decoded: any = jwtDecode(token);
    return decoded;
  }

  getEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.EMPLOYEE_LIST).pipe(catchError(this.handleError));
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
