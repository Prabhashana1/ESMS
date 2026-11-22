import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';  

import { IconName } from '../../shared/icon/icon.component';
import { AuthService } from 'src/app/services/auth.service';
import { PageTitleService } from '../../services/page-title.service';

interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

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
    public pageTitleService: PageTitleService,
    public auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  // 1. Dynamic User Name
  get displayName(): string {
    return this.auth.currentUser?.fullName ?? 'User';
  }

  // 2. Dynamic Role Label
  get roleLabel(): string {
    return this.auth.isOwner() ? 'Owner' : 'Employee';
  }

  // 3. Dynamic Avatar Initials (උදා: Kamal Perera -> KP, Admin -> AD)
  get initials(): string {
    const name = this.displayName.trim();
    if (!name || name === 'User') return 'U';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  // HTML එකේ function එකක් විදියට කතා කළත් වැඩ කරන්න:
  getDisplayName(): string {
    return this.displayName;
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