import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = environment.baseUrl;

  constructor(private http : HttpClient) { }
  public login(email: string, password: string ): Observable<any>{
    return this.http.post(`${this.url}/auth/login`, { email: email, password: password })
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(()=> error)
  }

  public getAllUser(): Observable<any> {
    return this.http.get(this.url + '/user/users/all')
    .pipe(
      catchError(this.handleError)
    );
  }
  
  updateuser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.url}/user/update/${id}`, data);
  }

  public GetUserbyid(id: any) {
    return this.http.get(this.url + '/user/' + id);
  }
}
