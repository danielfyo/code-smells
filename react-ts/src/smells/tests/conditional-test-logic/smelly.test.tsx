import { orderPriority } from "./production";

// SMELL: conditional test logic. Loops, ifs and try/catch make the assertions depend on
// control flow: if the condition isn't met or no exception is thrown, the test passes
// without checking anything. On top of that, the test reimplements the production logic.
describe("orderPriority (smelly)", () => {
  it("classifies orders", () => {
    for (const total of [50, 150, 600]) {
      const priority = orderPriority(total, false);
      if (total >= 500) {
        expect(priority).toBe("high");
      } else if (total >= 100) {
        expect(priority).toBe("normal");
      } else {
        expect(priority).toBe("low");
      }
    }
  });

  it("rejects negatives", () => {
    try {
      orderPriority(-1, false);
      // SMELL: if it doesn't throw, the test still passes (an explicit fail is missing).
    } catch (error) {
      expect(error).toBeInstanceOf(RangeError);
    }
  });
});
