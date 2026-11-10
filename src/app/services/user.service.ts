import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Backend එකේ UserDto එකට අනුරූප TypeScript Interface එක
export interface UserDto {
  id: number;
  fullName: string;
  nicNumber: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
}

// 2. අලුත් User කෙනෙක් හදද්දී යවන දත්ත (UserCreateDto)
export interface UserCreateDto {
  fullName: string;
  nicNumber: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

// 3. User විස්තර Update කරද්දී යවන දත්ත (UserUpdateDto)
export interface UserUpdateDto {
  fullName: string;
  nicNumber: string;
  email: string;
  role: string;
}

export interface PasswordResetDto {
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private readonly apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) { }


  createUser(user: UserCreateDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.apiUrl, user);
  }


  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }


  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }


  updateUser(id: number, user: UserUpdateDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/${id}`, user);
  }

  changeUserStatus(id: number, isActive: boolean): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.apiUrl}/${id}/status?isActive=${isActive}`, {});
  }


  resetPassword(id: number, passwordDto: PasswordResetDto): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/password`, passwordDto, { responseType: 'text' });
  }
}