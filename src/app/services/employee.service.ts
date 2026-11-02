import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Mekai hari path eka
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // 1. Attendance Check-In / Check-Out mark karanna (UC-02)[cite: 7]
  markAttendance(statusType: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance/${statusType}`, {});
  }

  // 2. Ada dawase attendance status eka balanna[cite: 5, 7]
  getTodayAttendance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/attendance/today`);
  }

  // 3. Salary History saha Payslips ganna (UC-04)[cite: 8]
  getSalaryHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payroll/my-history`);
  }
}