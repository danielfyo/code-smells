// SMELL: Command-Query Separation Violation. `tryAcquire()` answers a question
// ("may I make another request?") and consumes a token at the same time.
// Whoever only wants to ask (e.g. to disable a button) spends quota by accident.
export class RateLimiter {
  private tokens: number;

  constructor(private readonly capacity: number) {
    this.tokens = capacity;
  }

  tryAcquire(): boolean {
    if (this.tokens <= 0) return false;
    this.tokens--;
    return true;
  }

  refill(): void {
    this.tokens = this.capacity;
  }
}
