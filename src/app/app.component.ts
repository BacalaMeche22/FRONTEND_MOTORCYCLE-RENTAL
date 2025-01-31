import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'motor-rental';

  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Listen to auth changes
    this.authService.getAuthStatusListener().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    // Initialize user data
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
    }
  }
}
