import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8080/api/v1/auth'; 

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  hasAnyRole(expectedRoles: string[]): boolean {
    const currentRole = localStorage.getItem('userRole');
    if (!currentRole) return false;
    return expectedRoles.includes(currentRole);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}