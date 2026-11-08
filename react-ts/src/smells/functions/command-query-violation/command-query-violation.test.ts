import { RateLimiter as SmellyLimiter } from "./Smelly";
import { RateLimiter as RefactoredLimiter } from "./Refactored";

describe("Command-Query Separation Violation", () => {
  it("used only to consume, both allow the same requests", () => {
    const smelly = new SmellyLimiter(2);
    const refactored = new RefactoredLimiter(2);
    const smellyResults = [smelly.tryAcquire(), smelly.tryAcquire(), smelly.tryAcquire()];
    const refactoredResults = [0, 1, 2].map(() => {
      if (!refactored.canAcquire()) return false;
      refactored.acquire();
      return true;
    });
    expect(refactoredResults).toEqual(smellyResults);
  });

  it("bug: in the smelly version querying consumes quota", () => {
    const limiter = new SmellyLimiter(2);
    const buttonEnabled = limiter.tryAcquire(); // we only wanted to render the button
    expect(buttonEnabled).toBe(true);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(false); // one fewer real request!
  });

  it("in the refactored version querying is harmless", () => {
    const limiter = new RefactoredLimiter(2);
    expect(limiter.canAcquire()).toBe(true);
    expect(limiter.canAcquire()).toBe(true);
    limiter.acquire();
    limiter.acquire();
    expect(limiter.remaining).toBe(0);
    expect(() => limiter.acquire()).toThrow("Rate limit reached");
  });
});
