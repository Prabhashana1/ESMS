import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IconName } from '../icon/icon.component';

/**
 * Label + control + message wrapper.
 *
 * <app-form-field label="Email" forId="email" icon="mail" [error]="msg" hint="...">
 *   <input id="email" class="field-input field-input-icon" ... />
 *   <button fieldAction>...</button>     (optional, shown on the right inside the field)
 * </app-form-field>
 */
@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div>
      <label [attr.for]="forId" class="field-label">{{ label }}</label>
      <div class="relative">
        <app-icon
          *ngIf="icon"
          [name]="icon"
          [size]="18"
          class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        ></app-icon>
        <ng-content></ng-content>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ng-content select="[fieldAction]"></ng-content>
        </div>
      </div>
      <p *ngIf="error" class="mt-1.5 text-xs font-medium text-red-600" role="alert">{{ error }}</p>
      <p *ngIf="!error && hint" class="mt-1.5 text-xs text-slate-500">{{ hint }}</p>
    </div>
  `,
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() forId = '';
  @Input() icon: IconName | null = null;
  @Input() error = '';
  @Input() hint = '';
}
