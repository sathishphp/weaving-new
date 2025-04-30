import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../../../core/shared/utils/const';
import { Branch } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  constructor(private http: HttpClient) { }

  saveBranch(postObj:any):Observable<Branch[]>{
    return this.http.post<Branch[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.BRANCH_CREATE,postObj).pipe(catchError(this.handleError));
  }

  getBranchList():Observable<Branch[]>{
    return this.http.get<Branch[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.BRANCH_LIST).pipe(catchError(this.handleError));
  }

  getBranchListById(id:any):Observable<Branch[]>{
    return this.http.get<Branch[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.BRANCH+id).pipe(catchError(this.handleError));
  }

  updateBranch(id:any,postObj:any):Observable<Branch[]>{
    return this.http.put<Branch[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.BRANCH_UPDATE+id,postObj).pipe(catchError(this.handleError));
  }

  updateBranchStatus(id:any,postObj:any):Observable<Branch[]>{
    return this.http.put<Branch[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.BRANCH_UPDATE_STATUS+id,postObj).pipe(catchError(this.handleError));
  }

  removeBranch(id:any):Observable<Branch[]>{
    return this.http.delete<Branch[]>(environment.API_BACKEND_POINT + API_ENDPOINTS.BRANCH_DELETE+id).pipe(catchError(this.handleError));
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
