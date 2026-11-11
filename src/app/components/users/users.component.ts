import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, UserDto } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  searchTerm: string = '';

  isLoading: boolean = false;
  isSaving: boolean = false;
  successMessage: string = '';

  // Backend Designation Enum එකට ගැළපෙන Options
  readonly designations = [
    { value: 'OWNER', label: 'Owner' },
    { value: 'ADMIN_STAFF', label: 'Admin Staff' },
    { value: 'SALES_ASSISTANT', label: 'Sales Assistant' },
    { value: 'HARDWARE_TECHNICIAN', label: 'Hardware Technician' }
  ];

  showUserModal: boolean = false;
  isEditMode: boolean = false;
  selectedUserId: number | null = null;
  userForm!: FormGroup;

  showPasswordModal: boolean = false;
  passwordForm!: FormGroup;
  selectedUser: UserDto | null = null;

  showStatusModal: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initEmptyForms();
    this.loadUsers();
  }

  private initEmptyForms(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      nicNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15)]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['EMPLOYEE', Validators.required],
      designation: ['SALES_ASSISTANT', Validators.required]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase().trim();
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      (user.fullName || '').toLowerCase().includes(this.searchTerm) ||
      (user.username || '').toLowerCase().includes(this.searchTerm) ||
      (user.nicNumber || '').toLowerCase().includes(this.searchTerm) ||
      (user.phoneNumber || '').toLowerCase().includes(this.searchTerm)
    );
  }

  get activeCount(): number {
    return this.users.filter(u => u.isActive).length;
  }

  get inactiveCount(): number {
    return this.users.filter(u => !u.isActive).length;
  }

  // Table එකේ 'SALES_ASSISTANT' වෙනුවට 'Sales Assistant' ලෙස පෙන්වීමට
  getDesignationLabel(value: string): string {
    const found = this.designations.find(d => d.value === value);
    return found ? found.label : value;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      nicNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15)]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['EMPLOYEE', Validators.required],
      designation: ['SALES_ASSISTANT', Validators.required]
    });
    this.showUserModal = true;
  }

  openEditModal(user: UserDto): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.userForm = this.fb.group({
      fullName: [user.fullName, Validators.required],
      nicNumber: [user.nicNumber, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      phoneNumber: [user.phoneNumber, [Validators.required, Validators.maxLength(15)]],
      role: [user.role, Validators.required],
      designation: [user.designation || 'SALES_ASSISTANT', Validators.required]
    });
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
  }

  saveUser(): void {
    if (this.userForm.invalid) return;
    this.isSaving = true;

    if (this.isEditMode && this.selectedUserId !== null) {
      this.userService.updateUser(this.selectedUserId, this.userForm.value).subscribe({
        next: () => {
          this.isSaving = false;
          this.showUserModal = false;
          this.showSuccess('User updated successfully!');
          this.loadUsers();
        },
        error: () => {
          this.isSaving = false;
        }
      });
    } else {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.isSaving = false;
          this.showUserModal = false;
          this.showSuccess('New user created successfully!');
          this.loadUsers();
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }

  openPasswordModal(user: UserDto): void {
    this.selectedUser = user;
    this.passwordForm.reset();
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.selectedUser = null;
  }

  submitPasswordReset(): void {
    if (this.passwordForm.invalid || !this.selectedUser) return;
    this.isSaving = true;

    this.userService.resetPassword(this.selectedUser.id, this.passwordForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.closePasswordModal();
        this.showSuccess('Password reset successfully!');
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  openStatusModal(user: UserDto): void {
    this.selectedUser = user;
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedUser = null;
  }

  confirmStatusChange(): void {
    if (!this.selectedUser) return;
    this.isSaving = true;

    const newStatus = !this.selectedUser.isActive;
    this.userService.changeUserStatus(this.selectedUser.id, newStatus).subscribe({
      next: (updatedUser) => {
        this.isSaving = false;
        this.closeStatusModal();
        this.showSuccess(`User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully!`);
        this.loadUsers();
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