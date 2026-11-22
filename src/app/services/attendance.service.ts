import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceDto {
  id: number;
  userId: number;
  fullName: string;
  username: string;
  designation: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number;
  overtimeHours: number;
  status: 'ON_TIME' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE' | string;
  locationValid: boolean;
}

export interface ManualAttendanceRequestDto {
  userId: number;
  date: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'http://localhost:8080/api/v1/attendance';

  constructor(private http: HttpClient) { }

  checkIn(): Observable<AttendanceDto> {
    return this.http.post<AttendanceDto>(`${this.apiUrl}/check-in`, {});
  }

  checkOut(): Observable<AttendanceDto> {
    return this.http.post<AttendanceDto>(`${this.apiUrl}/check-out`, {});
  }

  getTodayAttendance(): Observable<AttendanceDto | null> {
    return this.http.get<AttendanceDto | null>(`${this.apiUrl}/today`);
  }

  getMyMonthlyHistory(year: number, month: number): Observable<AttendanceDto[]> {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<AttendanceDto[]>(`${this.apiUrl}/my-history`, { params });
  }

  getDailyAttendance(date: string): Observable<AttendanceDto[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<AttendanceDto[]>(`${this.apiUrl}/daily`, { params });
  }

  getUserMonthlyHistory(userId: number, year: number, month: number): Observable<AttendanceDto[]> {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<AttendanceDto[]>(`${this.apiUrl}/user/${userId}`, { params });
  }

  manualMark(payload: ManualAttendanceRequestDto): Observable<AttendanceDto> {
    return this.http.post<AttendanceDto>(`${this.apiUrl}/manual`, payload);
  }
}
