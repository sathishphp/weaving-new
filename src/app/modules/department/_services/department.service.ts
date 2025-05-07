import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../../../core/shared/utils/const';
import { Department } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private http: HttpClient) { }

  saveDepartment(postObj: any): Observable<Department[]> {
    return this.http.post<Department[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DEPARTMENT_CREATE, postObj).pipe(catchError(this.handleError));
  }

  getDepartmentList(): Observable<Department[]> {
    return this.http.get<Department[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DEPARTMENT_LIST).pipe(catchError(this.handleError));
  }

  getDepartmentListById(id: any): Observable<Department[]> {
    return this.http.get<Department[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DEPARTMENT + id).pipe(catchError(this.handleError));
  }

  updateDepartment(id: any, postObj: any): Observable<Department[]> {
    return this.http.put<Department[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DEPARTMENT_UPDATE + id, postObj).pipe(catchError(this.handleError));
  }

  updateDepartmentStatus(id: any, postObj: any): Observable<Department[]> {
    return this.http.put<Department[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DEPARTMENT_UPDATE_STATUS + id, postObj).pipe(catchError(this.handleError));
  }

  removeDepartment(id: any): Observable<Department[]> {
    return this.http.delete<Department[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DEPARTMENT_DELETE + id).pipe(catchError(this.handleError));
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
