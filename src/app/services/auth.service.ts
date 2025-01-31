import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserModel } from '../interface/UserModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private authStatusListener = new BehaviorSubject<boolean>(this.isLoggedIn());
  userInfo: UserModel | null = this.getUserInfo();
  private isLoading = new BehaviorSubject<boolean>(false);


  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    
  ) {

  }


  setLoading(state: boolean) {
    this.isLoading.next(state);
  }

  getLoadingState() {
    return this.isLoading.asObservable();
  }

  // Login method to authenticate and store data
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', response.user.role);
          }
          this.userInfo = response.user;
          this.authStatusListener.next(true);
        })
      );
  }

  getUserInfo(): UserModel | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }
    this.userInfo = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  getRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role');
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('role');
    }
    return false;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }


  public updateRole(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}/user-role`, data);
  }

  public verifyUser(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}/verify`, {});
  }

  public forgotpass(email: any): Observable<any> {
    return this.http.post(this.apiUrl + '/user/forgot-password', email);
  }


}
