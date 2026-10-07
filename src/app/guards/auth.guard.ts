import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //Check if user already log
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as Array<string>;
    
    if (expectedRoles && expectedRoles.length > 0) {
      const hasRole = this.authService.hasAnyRole(expectedRoles);
      
      if (!hasRole) {
        alert('Access Denied: You do not have permission to view this page.');
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    return true; 
  }
}