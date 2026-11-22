import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AttendanceService, AttendanceDto, ManualAttendanceRequestDto } from '../../services/attendance.service';
import { UserService, UserDto } from '../../services/user.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {

  // Current live clock
  currentTime: Date = new Date();
  private clockTimer: any;

  // Active Tab for Owner: 'my' | 'daily'
  activeTab: string = 'my';

  // Loading & Messages
  isLoading: boolean = false;
  isActionLoading: boolean = false;
  isSavingManual: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Employee: Today's record & monthly history
  todayAttendance: AttendanceDto | null = null;
  myHistory: AttendanceDto[] = [];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;

  // Owner: Daily sheet
  selectedDailyDate: string = new Date().toISOString().substring(0, 10);
  dailyAttendances: AttendanceDto[] = [];
  users: UserDto[] = [];

  // Manual Mark Modal
  showManualModal: boolean = false;
  manualForm!: FormGroup;

  // Months list for dropdown
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  constructor(
    public authService: AuthService,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Start live clock
    this.clockTimer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.initManualForm();
    this.loadTodayAttendance();
    this.loadMyHistory();

    if (this.authService.isOwner()) {
      this.loadUsers();
      this.loadDailyAttendance();
    }
  }

  ngOnDestroy(): void {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
  }

  private initManualForm(): void {
    this.manualForm = this.fb.group({
      userId: ['', Validators.required],
      date: [this.selectedDailyDate, Validators.required],
      status: ['ON_TIME', Validators.required],
      checkInTime: ['08:30'],
      checkOutTime: ['17:00']
    });

    // ABSENT හෝ ON_LEAVE නම් Time inputs disable කිරීම
    this.manualForm.get('status')?.valueChanges.subscribe(status => {
      if (status === 'ABSENT' || status === 'ON_LEAVE') {
        this.manualForm.get('checkInTime')?.disable();
        this.manualForm.get('checkOutTime')?.disable();
      } else {
        this.manualForm.get('checkInTime')?.enable();
        this.manualForm.get('checkOutTime')?.enable();
      }
    });
  }

  // --- Employee Self-Actions ---

  loadTodayAttendance(): void {
    this.attendanceService.getTodayAttendance().subscribe({
      next: (data: AttendanceDto | null) => {
        this.todayAttendance = data;
      },
      error: () => {
        this.todayAttendance = null;
      }
    });
  }

  loadMyHistory(): void {
    this.isLoading = true;
    this.attendanceService.getMyMonthlyHistory(this.selectedYear, this.selectedMonth).subscribe({
      next: (data: AttendanceDto[]) => {
        this.myHistory = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to load attendance history.';
        this.isLoading = false;
      }
    });
  }

  onCheckIn(): void {
    this.clearMessages();
    this.isActionLoading = true;
    this.attendanceService.checkIn().subscribe({
      next: (data: AttendanceDto) => {
        this.todayAttendance = data;
        this.successMessage = 'Check-in successful! Have a productive day.';
        this.isActionLoading = false;
        this.loadMyHistory();
        if (this.authService.isOwner()) {
          this.loadDailyAttendance();
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Check-in failed.';
        this.isActionLoading = false;
      }
    });
  }

  onCheckOut(): void {
    this.clearMessages();
    this.isActionLoading = true;
    this.attendanceService.checkOut().subscribe({
      next: (data: AttendanceDto) => {
        this.todayAttendance = data;
        this.successMessage = `Check-out successful! Total hours worked: ${data.workingHours} hrs.`;
        this.isActionLoading = false;
        this.loadMyHistory();
        if (this.authService.isOwner()) {
          this.loadDailyAttendance();
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Check-out failed.';
        this.isActionLoading = false;
      }
    });
  }

  // --- Owner Actions ---

  loadDailyAttendance(): void {
    this.isLoading = true;
    this.attendanceService.getDailyAttendance(this.selectedDailyDate).subscribe({
      next: (data: AttendanceDto[]) => {
        this.dailyAttendances = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to load daily sheet.';
        this.isLoading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: UserDto[]) => {
        this.users = data;
      },
      error: () => {
        this.users = [];
      }
    });
  }

  onDailyDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.selectedDailyDate = input.value;
      this.loadDailyAttendance();
    }
  }

  openManualModal(): void {
    this.clearMessages();
    this.manualForm.patchValue({
      userId: this.users.length > 0 ? this.users[0].id : '',
      date: this.selectedDailyDate,
      status: 'ON_TIME',
      checkInTime: '08:30',
      checkOutTime: '17:00'
    });
    this.showManualModal = true;
  }

  closeManualModal(): void {
    this.showManualModal = false;
  }

  submitManualMark(): void {
    if (this.manualForm.invalid) {
      return;
    }

    this.isSavingManual = true;
    this.clearMessages();

    const formVal = this.manualForm.getRawValue();
    const payload: ManualAttendanceRequestDto = {
      userId: Number(formVal.userId),
      date: formVal.date,
      status: formVal.status,
      checkInTime: (formVal.status !== 'ABSENT' && formVal.status !== 'ON_LEAVE' && formVal.checkInTime) 
        ? (formVal.checkInTime.length === 5 ? `${formVal.checkInTime}:00` : formVal.checkInTime)
        : null,
      checkOutTime: (formVal.status !== 'ABSENT' && formVal.status !== 'ON_LEAVE' && formVal.checkOutTime) 
        ? (formVal.checkOutTime.length === 5 ? `${formVal.checkOutTime}:00` : formVal.checkOutTime)
        : null
    };

    this.attendanceService.manualMark(payload).subscribe({
      next: () => {
        this.successMessage = 'Attendance saved successfully!';
        this.isSavingManual = false;
        this.closeManualModal();
        this.loadDailyAttendance();
        this.loadTodayAttendance();
        this.loadMyHistory();
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to save attendance.';
        this.isSavingManual = false;
      }
    });
  }

  // Summary counters for Owner
  get presentCount(): number {
    return this.dailyAttendances.filter(a => a.status === 'ON_TIME' || a.status === 'LATE').length;
  }

  get lateCount(): number {
    return this.dailyAttendances.filter(a => a.status === 'LATE').length;
  }

  get halfDayCount(): number {
    return this.dailyAttendances.filter(a => a.status === 'HALF_DAY').length;
  }

  get absentCount(): number {
    return this.dailyAttendances.filter(a => a.status === 'ABSENT' || a.status === 'ON_LEAVE').length;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}