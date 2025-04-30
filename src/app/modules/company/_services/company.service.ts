import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Company } from '../_models/company-model';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../../../core/shared/utils/const';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) { }

  saveCompany(postObj:any):Observable<Company[]>{
    return this.http.post<Company[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.COMPANY_CREATE,postObj).pipe(catchError(this.handleError));
  }

  getCompanyList():Observable<Company[]>{
    return this.http.get<Company[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.COMPANY_LIST).pipe(catchError(this.handleError));
  }

  getCompanyListById(id:any):Observable<Company[]>{
    return this.http.get<Company[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.COMPANY+id).pipe(catchError(this.handleError));
  }

  updateCompany(id:any,postObj:any):Observable<Company[]>{
    return this.http.put<Company[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.COMPANY_UPDATE+id,postObj).pipe(catchError(this.handleError));
  }

  updateCompanyStatus(id:any,postObj:any):Observable<Company[]>{
    return this.http.put<Company[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.COMPANY_UPDATE_STATUS+id,postObj).pipe(catchError(this.handleError));
  }

  removeCompany(id:any):Observable<Company[]>{
    return this.http.delete<Company[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.COMPANY_DELETE+id).pipe(catchError(this.handleError));
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
