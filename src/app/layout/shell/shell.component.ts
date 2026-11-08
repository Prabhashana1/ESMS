import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';


import { IconName } from '../../shared/icon/icon.component';
import { AuthService } from 'src/app/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

/** The signed-in layout: sidebar, top bar and the page area. */
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  readonly navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', path: '/dashboard', icon: 'grid' }],
    },
    {
      label: 'Management',
      items: [
        { label: 'Users', path: '/users', icon: 'users' },
        { label: 'Attendance', path: '/attendance', icon: 'clock' },
        { label: 'Leave Requests', path: '/leave', icon: 'calendar' },
      ],
    },
    {
      label: 'Payroll',
      items: [
        { label: 'Salary & Payslips', path: '/salary', icon: 'coins' },
      ],
    },
  ];

  readonly today = new Date();
  sidebarOpen = false;

  readonly pageTitle$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(undefined),
    map(() => this.currentTitle()),
  );

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  get displayName(): string {
    return this.auth.currentUser?.fullName ?? 'User';
  }

  get roleLabel(): string {
    return this.auth.currentUser?.role === 'OWNER' ? 'Owner' : 'Employee';
  }

  get initials(): string {
    const parts = this.displayName.split(/\s+/).filter(Boolean);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
    return (first + last).toUpperCase();
  }

  @HostListener('document:keydown.escape')
  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  signOut(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  private currentTitle(): string {
    let current: ActivatedRoute = this.route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    const title: unknown = current.snapshot.data['title'];
    return typeof title === 'string' ? title : 'ESMS';
  }
}
