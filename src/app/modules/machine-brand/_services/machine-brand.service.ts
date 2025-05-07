import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../../../core/shared/utils/const';
import { MachineBrand } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class MachineBrandService {
  constructor(private http: HttpClient) { }

  saveMachineBrand(postObj: any): Observable<MachineBrand[]> {
    return this.http.post<MachineBrand[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.MACHINE_BRAND_CREATE, postObj).pipe(catchError(this.handleError));
  }

  getMachineBrandList(): Observable<MachineBrand[]> {
    return this.http.get<MachineBrand[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.MACHINE_BRAND_LIST).pipe(catchError(this.handleError));
  }

  getMachineBrandListById(id: any): Observable<MachineBrand[]> {
    return this.http.get<MachineBrand[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.MACHINE_BRAND + id).pipe(catchError(this.handleError));
  }

  updateMachineBrand(id: any, postObj: any): Observable<MachineBrand[]> {
    return this.http.put<MachineBrand[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.MACHINE_BRAND_UPDATE + id, postObj).pipe(catchError(this.handleError));
  }

  updateMachineBrandStatus(id: any, postObj: any): Observable<MachineBrand[]> {
    return this.http.put<MachineBrand[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.MACHINE_BRAND_UPDATE_STATUS + id, postObj).pipe(catchError(this.handleError));
  }

  removeMachineBrand(id: any): Observable<MachineBrand[]> {
    return this.http.delete<MachineBrand[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.MACHINE_BRAND_DELETE + id).pipe(catchError(this.handleError));
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
