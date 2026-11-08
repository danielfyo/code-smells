import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

const MS_PER_DAY = 86_400_000;

// REFACTOR: Move Function into the data. The membership owns its rules; it is immutable, so
// renewing returns a new value instead of mutating a shared object.
export class GymMembership {
  constructor(
    readonly member: string,
    readonly expiresOn: string,
  ) {}

  daysLeft(todayIso: string): number {
    return Math.round((Date.parse(this.expiresOn) - Date.parse(todayIso)) / MS_PER_DAY);
  }

  status(todayIso: string): string {
    const days = this.daysLeft(todayIso);
    return days < 0 ? 'expired' : `${days} days left`;
  }

  renewedForOneMonth(): GymMembership {
    const date = new Date(`${this.expiresOn}T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + 1);
    return new GymMembership(this.member, date.toISOString().slice(0, 10));
  }
}

@Component({
  selector: 'cs-data-class-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>{{ current().member }}: {{ status() }}</p>
    <button type="button" (click)="renew()">Renew</button>
  `,
})
export class MembershipCardRefactored {
  readonly membership = input.required<GymMembership>();
  readonly today = input('');

  protected readonly current = linkedSignal(() => this.membership());
  protected readonly status = computed(() => this.current().status(this.today()));

  renew(): void {
    this.current.update((membership) => membership.renewedForOneMonth());
  }
}
