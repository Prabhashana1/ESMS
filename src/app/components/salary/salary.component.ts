import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SalaryService, SalaryStructureDto } from '../../services/salary.service';
import { UserService, UserDto } from '../../services/user.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {

  activeTab: string = 'structures'; // 'structures' | 'advances' | 'payroll'
  isLoading: boolean = false;
  isSaving: boolean = false;
  successMessage: string = '';
  formError: string = '';


  users: UserDto[] = [];
  structures: SalaryStructureDto[] = [];


  myStructure: SalaryStructureDto | null = null;


  showSetupModal: boolean = false;
  selectedUser: UserDto | null = null;
  structureForm!: FormGroup;

  constructor(
    public authService: AuthService,
    private salaryService: SalaryService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.authService.isOwner()) {
      this.loadOwnerData();
    } else {
      this.loadEmployeeData();
    }
  }

  private initForm(): void {
    this.structureForm = this.fb.group({
      employmentType: ['PERMANENT', Validators.required],
      basicSalary: [0, [Validators.min(0)]],
      dailyRate: [0, [Validators.min(0)]],
      hourlyOvertimeRate: [0, [Validators.min(0)]],
      epfEtfEligible: [true],
      annualCasualLeaveQuota: [7, [Validators.required, Validators.min(0)]],
      annualMedicalLeaveQuota: [7, [Validators.required, Validators.min(0)]],
      bankName: [''],
      bankBranch: [''],
      accountNumber: ['']
    });
  }

  loadOwnerData(): void {
    this.isLoading = true;

    this.userService.getAllUsers().subscribe({
      next: (userList) => {
        this.users = userList.filter(u => u.isActive); 
        this.salaryService.getAllSalaryStructures().subscribe({
          next: (structureList) => {
            this.structures = structureList;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadEmployeeData(): void {
    this.isLoading = true;
    this.salaryService.getMySalaryStructure().subscribe({
      next: (data) => {
        this.myStructure = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }


  getStructureForUser(userId: number): SalaryStructureDto | null {
    for (let s of this.structures) {
      if (s.userId === userId) {
        return s;
      }
    }
    return null;
  }


  openSetupModal(user: UserDto): void {
    this.selectedUser = user;
    this.formError = '';
    const existing = this.getStructureForUser(user.id);

    if (existing) {
      this.structureForm.patchValue({
        employmentType: existing.employmentType,
        basicSalary: existing.basicSalary,
        dailyRate: existing.dailyRate,
        hourlyOvertimeRate: existing.hourlyOvertimeRate,
        epfEtfEligible: existing.epfEtfEligible,
        annualCasualLeaveQuota: existing.annualCasualLeaveQuota,
        annualMedicalLeaveQuota: existing.annualMedicalLeaveQuota,
        bankName: existing.bankName || '',
        bankBranch: existing.bankBranch || '',
        accountNumber: existing.accountNumber || ''
      });
    } else {
      this.structureForm.reset({
        employmentType: 'PERMANENT',
        basicSalary: 0,
        dailyRate: 0,
        hourlyOvertimeRate: 0,
        epfEtfEligible: true,
        annualCasualLeaveQuota: 7,
        annualMedicalLeaveQuota: 7,
        bankName: '',
        bankBranch: '',
        accountNumber: ''
      });
    }

    this.showSetupModal = true;
  }

  closeSetupModal(): void {
    this.showSetupModal = false;
    this.selectedUser = null;
    this.formError = '';
  }

  onEmploymentTypeChange(): void {
    const type = this.structureForm.get('employmentType')?.value;
    this.formError = '';
    if (type === 'PERMANENT') {
      this.structureForm.patchValue({ dailyRate: 0, epfEtfEligible: true });
    } else {
      this.structureForm.patchValue({ basicSalary: 0, epfEtfEligible: false });
    }
  }

  saveStructure(): void {
    if (!this.selectedUser || this.structureForm.invalid) return;

    const val = this.structureForm.value;

    // Frontend Validation
    if (val.employmentType === 'PERMANENT' && (!val.basicSalary || val.basicSalary <= 0)) {
      this.formError = 'Basic Salary must be greater than 0 for Permanent employees.';
      return;
    }
    if (val.employmentType === 'DAILY_WAGE' && (!val.dailyRate || val.dailyRate <= 0)) {
      this.formError = 'Daily Rate must be greater than 0 for Daily Wage employees.';
      return;
    }

    this.formError = '';
    this.isSaving = true;

    this.salaryService.saveOrUpdateSalaryStructure(this.selectedUser.id, val).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeSetupModal();
        this.showSuccess(`Salary structure saved for ${this.selectedUser?.fullName || 'employee'}!`);
        this.loadOwnerData();
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 4000);
  }
}