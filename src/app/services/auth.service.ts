import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }


  saveToken(token: string, role: string, username?: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    if (username) {
      localStorage.setItem('username', username);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  get currentUser(): { fullName: string; role: string } | null {
    const token = this.getToken();
    if (!token) return null;
    return {
      fullName: this.getUsername() ?? 'User',
      role: this.getRole() ?? 'EMPLOYEE'
    };
  }

  hasAnyRole(expectedRoles: string[]): boolean {
    const currentRole = localStorage.getItem('userRole');
    if (!currentRole) return false;
    return expectedRoles.includes(currentRole);
  }


  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isOwner(): boolean {
    return this.getRole() === 'OWNER';
  }

  isEmployee(): boolean {
    return this.getRole() === 'EMPLOYEE';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}