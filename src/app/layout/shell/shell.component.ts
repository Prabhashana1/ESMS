import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { IconName } from '../../shared/icon/icon.component';

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
      label: 'Workforce',
      items: [
        { label: 'Employees', path: '/employees', icon: 'users' },
        { label: 'Positions', path: '/positions', icon: 'briefcase' },
        { label: 'Attendance', path: '/attendance', icon: 'clock' },
        { label: 'Leave requests', path: '/leave', icon: 'calendar' },
      ],
    },
    {
      label: 'Payroll',
      items: [
        { label: 'Loans & advances', path: '/loans', icon: 'banknote' },
        { label: 'Salary management', path: '/salary', icon: 'coins' },
        { label: 'Pay slips & reports', path: '/reports', icon: 'document' },
      ],
    },
    {
      label: 'System',
      items: [{ label: 'Settings', path: '/settings', icon: 'sliders' }],
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
    return this.auth.currentUser?.role === 'ADMIN' ? 'Administrator' : 'Employee';
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
