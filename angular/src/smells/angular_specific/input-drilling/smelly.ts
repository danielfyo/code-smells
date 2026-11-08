import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

export interface SessionUser {
  name: string;
  role: string;
}

// SMELL: input drilling. `user` and `logout` travel Page -> Layout -> Sidebar -> UserBadge.
// Layout and Sidebar do not use them; they only forward them, so every intermediate component
// changes whenever the badge needs one more field, and their APIs are polluted.
@Component({
  selector: 'cs-input-drilling-smelly-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="user">{{ user().name }} ({{ user().role }})</span>
    <button type="button" class="logout" (click)="logout.emit()">Log out</button>
  `,
})
export class SmellyUserBadgeComponent {
  readonly user = input.required<SessionUser>();
  readonly logout = output();
}

@Component({
  selector: 'cs-input-drilling-smelly-sidebar',
  imports: [SmellyUserBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<aside><cs-input-drilling-smelly-badge [user]="user()" (logout)="logout.emit()" /></aside>`,
})
export class SmellySidebarComponent {
  readonly user = input.required<SessionUser>(); // only forwarded
  readonly logout = output(); // only forwarded
}

@Component({
  selector: 'cs-input-drilling-smelly-layout',
  imports: [SmellySidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="layout"><cs-input-drilling-smelly-sidebar [user]="user()" (logout)="logout.emit()" /></div>`,
})
export class SmellyLayoutComponent {
  readonly user = input.required<SessionUser>(); // only forwarded
  readonly logout = output(); // only forwarded
}

@Component({
  selector: 'cs-input-drilling-smelly',
  imports: [SmellyLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (user(); as current) {
      <cs-input-drilling-smelly-layout [user]="current" (logout)="user.set(null)" />
    } @else {
      <p class="signed-out">Signed out</p>
    }
  `,
})
export class SmellyAccountPageComponent {
  readonly user = signal<SessionUser | null>({ name: 'Ana', role: 'admin' });
}
