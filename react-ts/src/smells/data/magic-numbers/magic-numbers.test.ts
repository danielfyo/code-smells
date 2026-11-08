import { nextRetryDelay as smelly } from "./Smelly";
import { nextRetryDelay as refactored, MAX_ATTEMPTS, type ErrorKind } from "./Refactored";

describe("Magic Numbers", () => {
  it("both retry policies agree in every case", () => {
    const kinds: ErrorKind[] = ["transient", "fatal"];
    for (const status of [200, 404, 429, 500, 503]) {
      for (let attempt = 0; attempt <= MAX_ATTEMPTS + 1; attempt++) {
        for (const kind of kinds) {
          expect(refactored(status, attempt, kind)).toBe(smelly(status, attempt, kind));
        }
      }
    }
  });

  it("applies exponential backoff", () => {
    expect([0, 1, 2].map((a) => refactored(503, a, "transient"))).toEqual([250, 500, 1000]);
    expect(refactored(503, 3, "transient")).toBeNull();
  });
});
