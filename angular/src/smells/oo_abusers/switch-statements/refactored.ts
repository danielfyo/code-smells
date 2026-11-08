import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ChannelType, OutgoingMessage } from './model';

// REFACTOR: Replace Conditional with Polymorphism. Each channel is one object that knows its
// label, cost and limit; a new channel is one new entry instead of edits in three switches.
export interface ChannelPolicy {
  readonly label: string;
  readonly maxLength: number;
  cost(length: number): number;
}

export const CHANNEL_POLICIES: Readonly<Record<ChannelType, ChannelPolicy>> = {
  email: { label: 'Email', maxLength: 100_000, cost: () => 0.001 },
  sms: { label: 'SMS', maxLength: 480, cost: (length) => Math.ceil(length / 160) * 0.05 },
  push: { label: 'Push', maxLength: 120, cost: () => 0 },
};

@Component({
  selector: 'cs-switch-statements-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (row of rows(); track $index) {
        <li>
          {{ row.label }} to {{ row.recipient }}: {{ row.cost.toFixed(3) }} €
          @if (row.tooLong) {
            (too long)
          }
        </li>
      }
    </ul>
  `,
})
export class OutboxRefactored {
  readonly messages = input<readonly OutgoingMessage[]>([]);

  protected readonly rows = computed(() =>
    this.messages().map((message) => {
      const policy = CHANNEL_POLICIES[message.channel];
      return {
        label: policy.label,
        recipient: message.recipient,
        cost: policy.cost(message.length),
        tooLong: message.length > policy.maxLength,
      };
    }),
  );
}
