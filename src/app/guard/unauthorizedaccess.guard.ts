// unauthorized-access.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IUnauthorizedRoutes } from '../interface/UserModel';

@Injectable({
  providedIn: 'root',
})
export class unauthorizedaccessGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const role = this.authService.userInfo?.role;
    const url = state.url;
    const unauthorizedRoutes: IUnauthorizedRoutes = {
        renterRoutes: [
        '/admin/dashboard',
        '/admin/motor',
      
      ],
      adminRoutes: [ '/payslip',],
      constructionWorkerRoutes: [
        '/admin/motor',

      
      ],
    };

    let unauthorized = false;

    switch (role) {
      case 'admin':
        unauthorized = this.checkRoutes(url, unauthorizedRoutes.adminRoutes);
        break;
      case 'renter':
        unauthorized = this.checkRoutes(url, unauthorizedRoutes.renterRoutes);
        break;
    
    }

    if (unauthorized) {
      this.router.navigate(['/notauthorized']);
      return false;
    }

    return true;
  }

  private checkRoutes(url: string, routes: string[]): boolean {
    return routes.some((route) => url.includes(route));
  }
}
