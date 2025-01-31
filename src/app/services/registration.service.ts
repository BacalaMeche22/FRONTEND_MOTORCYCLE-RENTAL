import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  submitForm(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/user/signup', data);

    
  } 

  login(email: string, password: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users: any[]) => users.filter(user => user.personalInformation.email === email && user.personalInformation.password === password))
    );
}
}
