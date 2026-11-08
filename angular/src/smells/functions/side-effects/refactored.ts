import { Injectable, signal } from '@angular/core';

const MAX_FAILED_ATTEMPTS = 3;

// REFACTOR: Separate Query from Modifier. `matchesPin` is a pure question; `login` is the
// command that changes state, and its name says so.
@Injectable({ providedIn: 'root' })
export class Atm {
  private readonly pin = '4321';
  private readonly failedAttemptsState = signal(0);
  private readonly sessionOpenState = signal(false);

  readonly failedAttempts = this.failedAttemptsState.asReadonly();
  readonly sessionOpen = this.sessionOpenState.asReadonly();

  matchesPin(candidate: string): boolean {
    return candidate === this.pin;
  }

  isLocked(): boolean {
    return this.failedAttemptsState() >= MAX_FAILED_ATTEMPTS;
  }

  login(candidate: string): boolean {
    if (this.isLocked()) return false;
    if (this.matchesPin(candidate)) {
      this.failedAttemptsState.set(0);
      this.sessionOpenState.set(true);
      return true;
    }
    this.failedAttemptsState.update((n) => n + 1);
    return false;
  }
}
