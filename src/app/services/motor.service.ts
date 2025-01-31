import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotorService {
  private url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    return throwError(()=> error)
  }

  public getAllmotors(): Observable<any> {
    return this.http.get(this.url + '/motor')
    .pipe(
      catchError(this.handleError)
    );
  }

  public getAllCategories(): Observable<any> {
    return this.http.get(this.url + '/motor-category')
    .pipe(
      catchError(this.handleError)
    );
  }


  public getAllBrands(): Observable<any> {
    return this.http.get(this.url + '/motor-brand/brands')
    .pipe(
      catchError(this.handleError)
    );
  }

  public addMotor(data: any): Observable<any> {
    return this.http.post(this.url + '/motor/create', data);
  }

  public deleteMotor(id:any,){
    return this.http.delete(`${this.url}/motor/delete/${id}`)
  }

  updateMotorStatus(id: string, data: { isVisible: boolean }): Observable<any> {
    return this.http.put(`${this.url}/motor/update_status/${id}`, data);
  }

  updateMotor(id: string, motorData: any): Observable<any> {
    return this.http.put(`${this.url}/motor/update/${id}`, motorData);
  }

  public getAllAvailableMotors(): Observable<any> {
    return this.http.get(this.url + '/motor/total-visible')
    .pipe(
      catchError(this.handleError)
    );
  }

  public getAllUnavailableMotors(): Observable<any> {
    return this.http.get(this.url + '/motor/total-invisible')
    .pipe(
      catchError(this.handleError)
    );
  }
}
