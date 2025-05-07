import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../../../core/shared/utils/const';
import { Shed } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ShedService {
  constructor(private http: HttpClient) { }

  saveShed(postObj:any):Observable<Shed[]>{
    return this.http.post<Shed[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.SHED_CREATE,postObj).pipe(catchError(this.handleError));
  }

  getShedList():Observable<Shed[]>{
    return this.http.get<Shed[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.SHED_LIST).pipe(catchError(this.handleError));
  }

  getShedListById(id:any):Observable<Shed[]>{
    return this.http.get<Shed[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.SHED+id).pipe(catchError(this.handleError));
  }

  updateShed(id:any,postObj:any):Observable<Shed[]>{
    return this.http.put<Shed[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.SHED_UPDATE+id,postObj).pipe(catchError(this.handleError));
  }

  updateShedStatus(id:any,postObj:any):Observable<Shed[]>{
    return this.http.put<Shed[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.SHED_UPDATE_STATUS+id,postObj).pipe(catchError(this.handleError));
  }

  removeShed(id:any):Observable<Shed[]>{
    return this.http.delete<Shed[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.SHED_DELETE+id).pipe(catchError(this.handleError));
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
