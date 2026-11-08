// REFACTOR: Separate Query from Modifier. `canAcquire()` and `remaining` only
// query (they can be called as often as you like); `acquire()` is the only
// command that changes state, and it fails explicitly when no quota is left.
export class RateLimiter {
  private tokens: number;

  constructor(private readonly capacity: number) {
    this.tokens = capacity;
  }

  get remaining(): number {
    return this.tokens;
  }

  canAcquire(): boolean {
    return this.tokens > 0;
  }

  acquire(): void {
    if (!this.canAcquire()) throw new Error("Rate limit reached");
    this.tokens--;
  }

  refill(): void {
    this.tokens = this.capacity;
  }
}
