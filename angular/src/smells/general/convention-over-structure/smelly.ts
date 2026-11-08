import { Pipe, PipeTransform } from '@angular/core';

// SMELL: convention over structure. Kinds are plain strings and every pipe owns its own switch.
// The only safety net is this comment:
// IMPORTANT: when you add a new notification kind, remember to update NotificationIconPipe AND
// NotificationLabelPipe (and the e-mail templates, and...).
export type NotificationKind = string;

@Pipe({ name: 'smellyNotificationIcon' })
export class SmellyNotificationIconPipe implements PipeTransform {
  transform(kind: NotificationKind): string {
    switch (kind) {
      case 'order':
        return '[box]';
      case 'payment':
        return '[card]';
      case 'refund':
        return '[back]';
      default:
        return '[?]';
    }
  }
}

@Pipe({ name: 'smellyNotificationLabel' })
export class SmellyNotificationLabelPipe implements PipeTransform {
  transform(kind: NotificationKind): string {
    switch (kind) {
      case 'order':
        return 'New order';
      case 'payment':
        return 'Payment received';
      // SMELL: someone added 'refund' to the icon pipe and forgot this one: no compile error.
      default:
        return 'Notification';
    }
  }
}
