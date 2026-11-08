import { Pipe, PipeTransform } from '@angular/core';

// REFACTOR: let the structure enforce the rule. Kinds are a closed union and all their data lives
// in one table typed with `satisfies Record<NotificationKind, ...>`: adding a kind without its
// icon and label is a compile error, not a forgotten "remember to".
export const NOTIFICATION_KINDS = ['order', 'payment', 'refund'] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

interface NotificationStyle {
  icon: string;
  label: string;
}

const NOTIFICATION_STYLES = {
  order: { icon: '[box]', label: 'New order' },
  payment: { icon: '[card]', label: 'Payment received' },
  refund: { icon: '[back]', label: 'Refund issued' },
} as const satisfies Record<NotificationKind, NotificationStyle>;

@Pipe({ name: 'notificationIcon' })
export class NotificationIconPipe implements PipeTransform {
  transform(kind: NotificationKind): string {
    return NOTIFICATION_STYLES[kind].icon;
  }
}

@Pipe({ name: 'notificationLabel' })
export class NotificationLabelPipe implements PipeTransform {
  transform(kind: NotificationKind): string {
    return NOTIFICATION_STYLES[kind].label;
  }
}
