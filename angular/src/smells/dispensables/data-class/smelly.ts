import { Component, Input } from '@angular/core';

// SMELL: Data Class. GymMembershipSmelly is only fields with getters and setters. The rules about
// memberships (days left, expiry, renewal) live in the component, so every other screen that
// shows a membership will have to copy them.
export class GymMembershipSmelly {
  private member = '';
  private expiresOn = '';

  getMember(): string {
    return this.member;
  }
  setMember(member: string): void {
    this.member = member;
  }
  getExpiresOn(): string {
    return this.expiresOn;
  }
  setExpiresOn(date: string): void {
    this.expiresOn = date;
  }
}

@Component({
  selector: 'cs-data-class-smelly',
  template: `
    <p>{{ membership.getMember() }}: {{ status() }}</p>
    <button type="button" (click)="renew()">Renew</button>
  `,
})
export class MembershipCardSmelly {
  @Input({ required: true }) membership!: GymMembershipSmelly;
  @Input() today = '';

  status(): string {
    const days = Math.round((Date.parse(this.membership.getExpiresOn()) - Date.parse(this.today)) / 86_400_000);
    return days < 0 ? 'expired' : `${days} days left`;
  }

  renew(): void {
    const date = new Date(this.membership.getExpiresOn() + 'T00:00:00Z');
    date.setUTCMonth(date.getUTCMonth() + 1);
    this.membership.setExpiresOn(date.toISOString().slice(0, 10));
  }
}
