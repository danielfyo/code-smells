import { ChangeDetectionStrategy, Component, Injectable, inject, signal } from '@angular/core';

export interface SessionUser {
  name: string;
  role: string;
}

// REFACTOR: Replace drilling with an injectable store. The component that needs the session
// injects it directly; the layers in between no longer know it exists.
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly current = signal<SessionUser | null>({ name: 'Ana', role: 'admin' });
  readonly user = this.current.asReadonly();

  logout(): void {
    this.current.set(null);
  }
}

@Component({
  selector: 'cs-input-drilling-refactored-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (session.user(); as user) {
      <span class="user">{{ user.name }} ({{ user.role }})</span>
      <button type="button" class="logout" (click)="session.logout()">Log out</button>
    }
  `,
})
export class UserBadgeComponent {
  protected readonly session = inject(SessionStore);
}

@Component({
  selector: 'cs-input-drilling-refactored-sidebar',
  imports: [UserBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<aside><cs-input-drilling-refactored-badge /></aside>`,
})
export class SidebarComponent {}

@Component({
  selector: 'cs-input-drilling-refactored-layout',
  imports: [SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="layout"><cs-input-drilling-refactored-sidebar /></div>`,
})
export class LayoutComponent {}

@Component({
  selector: 'cs-input-drilling-refactored',
  imports: [LayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (session.user()) {
      <cs-input-drilling-refactored-layout />
    } @else {
      <p class="signed-out">Signed out</p>
    }
  `,
})
export class AccountPageComponent {
  protected readonly session = inject(SessionStore);
}
