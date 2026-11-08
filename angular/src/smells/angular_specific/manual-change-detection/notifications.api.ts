import { Injectable } from '@angular/core';

/** Loads unread notifications. Tests replace `load` with a promise they control. */
@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  load(): Promise<string[]> {
    return Promise.resolve(['Your order shipped', 'New message from support']);
  }
}
