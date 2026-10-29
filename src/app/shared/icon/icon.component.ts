import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Simple 24x24 outline icons, drawn as strokes so they take the surrounding text colour. */
const ICONS = {
  grid: ['M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'],
  users: [
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    'M2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6',
    'M16 4.3a3.5 3.5 0 0 1 0 6.4',
    'M18 14.3c2 .8 3.5 2.7 3.5 5.2',
  ],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8'],
  briefcase: [
    'M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z',
    'M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
    'M3 13h18',
  ],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
  calendar: [
    'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z',
    'M8 3v4M16 3v4M4 11h16',
  ],
  banknote: [
    'M3 7h18v10H3z',
    'M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    'M6 10v.01M18 14v.01',
  ],
  coins: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    'M14.5 9.5c-.4-.9-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5',
    'M12 6.5V8M12 16v1.5',
  ],
  document: [
    'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z',
    'M14 3v5h5',
    'M9 13h6M9 17h6',
  ],
  sliders: [
    'M4 7h10M18 7h2M4 17h2M10 17h10',
    'M16 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
    'M8 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  ],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  x: ['M6 6l12 12M18 6L6 18'],
  plus: ['M12 5v14M5 12h14'],
  check: ['M5 13l4 4L19 7'],
  'check-circle': ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M8 12.5l2.7 2.7L16 9.5'],
  alert: [
    'M10.3 4.2L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z',
    'M12 9v4M12 17h.01',
  ],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2 2 4-4'],
  mail: [
    'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
    'M3 7l9 6 9-6',
  ],
  lock: [
    'M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z',
    'M8 11V8a4 4 0 0 1 8 0v3',
  ],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  'eye-off': [
    'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M4 4l16 16',
  ],
  building: ['M5 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17', 'M15 9h3a1 1 0 0 1 1 1v11', 'M3 21h18', 'M9 7h2M9 11h2M9 15h2'],
  pin: [
    'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z',
    'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  ],
  phone: ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z'],
  id: [
    'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
    'M8 11.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z',
    'M5.5 16c.3-1.5 1.4-2.3 2.5-2.3s2.2.8 2.5 2.3',
    'M14 9.5h4M14 13h4',
  ],
  'chevron-down': ['M6 9l6 6 6-6'],
} satisfies Record<string, string[]>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path *ngFor="let d of paths" [attr.d]="d" />
    </svg>
  `,
})
export class IconComponent {
  @Input() name: IconName = 'grid';
  @Input() size = 20;
  @Input() strokeWidth = 1.75;

  get paths(): readonly string[] {
    return ICONS[this.name];
  }
}
