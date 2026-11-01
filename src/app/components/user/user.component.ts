import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  
  selectedTab: string = 'attendance';
  todayRecord: any = null;
  salaryList: any[] = [];
  feedbackMessage: string = '';

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.loadTodayData();
    this.loadSalaryData();
  }

  loadTodayData(): void {
    this.empService.getTodayAttendance().subscribe(
      (response: any) => {
        this.todayRecord = response;
      },
      (error: any) => {
        console.log('Data load karaganna bari una:', error);
      }
    );
  }

  loadSalaryData(): void {
    this.empService.getSalaryHistory().subscribe(
      (response: any) => {
        this.salaryList = response;
      },
      (error: any) => {
        console.log('Salary history error:', error);
      }
    );
  }

  checkIn(): void {
    this.empService.markAttendance('check-in').subscribe(
      (res: any) => {
        this.todayRecord = res;
        this.feedbackMessage = 'Successfully Checked In!';
      },
      (err: any) => {
        this.feedbackMessage = 'Check-in failed!';
      }
    );
  }

  checkOut(): void {
    this.empService.markAttendance('check-out').subscribe(
      (res: any) => {
        this.todayRecord = res;
        this.feedbackMessage = 'Successfully Checked Out!';
      },
      (err: any) => {
        this.feedbackMessage = 'Check-out failed!';
      }
    );
  }
}