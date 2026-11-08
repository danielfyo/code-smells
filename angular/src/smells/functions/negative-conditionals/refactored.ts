import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// REFACTOR: Rename to positive form / Reverse Conditional. Inputs state what IS true and each
// branch starts with the positive case.
@Component({
  selector: 'cs-negative-conditionals-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (verified()) {
      <p>Account verified</p>
    } @else {
      <p>Please verify your e-mail</p>
    }
    <p>{{ reminderText() }}</p>
  `,
})
export class AccountBannerRefactored {
  readonly verified = input(true);
  readonly remindersEnabled = input(true);
  readonly unpaidInvoices = input(0);

  protected readonly reminderText = computed(() => {
    if (!this.remindersEnabled()) return 'Reminders off';
    const unpaid = this.unpaidInvoices();
    return unpaid > 0 ? `You have ${unpaid} unpaid invoices` : 'All invoices paid';
  });
}
