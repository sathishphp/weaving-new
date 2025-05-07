import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../../../core/shared/utils/const';
import { Designation } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  constructor(private http: HttpClient) { }

  saveDesignation(postObj: any): Observable<Designation[]> {
    return this.http.post<Designation[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DESIGNATION_CREATE, postObj).pipe(catchError(this.handleError));
  }

  getDesignationList(): Observable<Designation[]> {
    return this.http.get<Designation[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DESIGNATION_LIST).pipe(catchError(this.handleError));
  }

  getDesignationListById(id: any): Observable<Designation[]> {
    return this.http.get<Designation[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DESIGNATION + id).pipe(catchError(this.handleError));
  }

  updateDesignation(id: any, postObj: any): Observable<Designation[]> {
    return this.http.put<Designation[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DESIGNATION_UPDATE + id, postObj).pipe(catchError(this.handleError));
  }

  updateDesignationStatus(id: any, postObj: any): Observable<Designation[]> {
    return this.http.put<Designation[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DESIGNATION_UPDATE_STATUS + id, postObj).pipe(catchError(this.handleError));
  }

  removeDesignation(id: any): Observable<Designation[]> {
    return this.http.delete<Designation[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.DESIGNATION_DELETE + id).pipe(catchError(this.handleError));
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
