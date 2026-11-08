import { Component, Input } from '@angular/core';
import type { ChannelType, OutgoingMessage } from './model';

// SMELL: Switch Statements. The same `switch (channel)` appears in label, cost and limit.
// Adding WhatsApp means finding and editing every switch (and hoping none is forgotten).
@Component({
  selector: 'cs-switch-statements-smelly',
  template: `
    <ul>
      @for (message of messages; track $index) {
        <li>
          {{ label(message.channel) }} to {{ message.recipient }}: {{ cost(message).toFixed(3) }} €
          @if (message.length > maxLength(message.channel)) {
            (too long)
          }
        </li>
      }
    </ul>
  `,
})
export class OutboxSmelly {
  @Input() messages: OutgoingMessage[] = [];

  label(channel: ChannelType): string {
    switch (channel) {
      case 'email':
        return 'Email';
      case 'sms':
        return 'SMS';
      case 'push':
        return 'Push';
    }
  }

  cost(message: OutgoingMessage): number {
    switch (message.channel) {
      case 'email':
        return 0.001;
      case 'sms':
        return Math.ceil(message.length / 160) * 0.05;
      case 'push':
        return 0;
    }
  }

  maxLength(channel: ChannelType): number {
    switch (channel) {
      case 'email':
        return 100_000;
      case 'sms':
        return 480;
      case 'push':
        return 120;
    }
  }
}
