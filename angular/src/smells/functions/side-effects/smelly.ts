import { Injectable } from '@angular/core';

// SMELL: Side Effects. The name promises a question ("is the PIN correct?") but the method also
// counts failures, locks the account and opens a session. Calling it "just to check" (from a
// template, a guard or a test) changes the system.
@Injectable({ providedIn: 'root' })
export class AtmSmelly {
  failedAttempts = 0;
  locked = false;
  sessionOpen = false;
  private readonly pin = '4321';

  isPinCorrect(candidate: string): boolean {
    if (this.locked) return false;
    if (candidate === this.pin) {
      this.failedAttempts = 0;
      this.sessionOpen = true;
      return true;
    }
    this.failedAttempts++;
    if (this.failedAttempts >= 3) this.locked = true;
    return false;
  }
}
