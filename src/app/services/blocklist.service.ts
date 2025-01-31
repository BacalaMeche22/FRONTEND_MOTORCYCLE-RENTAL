import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlocklistService {
  private url = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getAllBlockUser(): Observable<any> {
    return this.http.get(this.url + '/block');
  }

  public blockuser(data: any): Observable<any> {
    return this.http.post(this.url + '/block/user', data);
  }


  public updateBlock(id: any): Observable<any> {
    return this.http.put(`${this.url}/block/user/${id}`, {});
  }
}
