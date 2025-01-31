import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private url = environment.baseUrl;

  constructor(private http: HttpClient ) { }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(()=> error)
  }

  public getAllCategories(): Observable<any> {
    return this.http.get(this.url + '/motor-category')
    .pipe(
      catchError(this.handleError)
    );
  }

  public addCategory(data: any): Observable<any> {
    return this.http.post(this.url + '/motor-category/create', data);
  }

  public updateCategory(id: any, data: any): Observable<any> {
    return this.http.put(`${this.url}/motor-category/update/${id}`, data);
  }

  public deleteCategory(id:any,){
    return this.http.delete(`${this.url}/motor-category/${id}`)
  }

}
