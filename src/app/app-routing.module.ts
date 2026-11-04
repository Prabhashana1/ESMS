import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { LeaveComponent } from './components/leave/leave.component';
import { SalaryComponent } from './components/salary/salary.component';
import { ShellComponent } from './layout/shell/shell.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [


      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },

      { 
        path: 'users', 
        component: UsersComponent, 
        data: { title: 'User Management', roles: ['OWNER'] } 
      },

      { path: 'attendance', component: AttendanceComponent, data: { title: 'Attendance' } },
      { path: 'leave', component: LeaveComponent, data: { title: 'Leave Requests' } },
      { path: 'salary', component: SalaryComponent, data: { title: 'Salary & Payroll' } },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }