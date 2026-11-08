import { createExchangeService, type RatesClient } from "./production";

// REFACTOR: in-memory test doubles (no latency) and fake timers for the retry delay.
// The test is instant and deterministic.
function fakeClient(responses: Array<number | Error>): RatesClient {
  const queue = [...responses];
  return {
    getRate: async () => {
      const next = queue.shift();
      if (next === undefined) throw new Error("no responses configured");
      if (next instanceof Error) throw next;
      return next;
    },
  };
}

describe("exchange service (refactored)", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("converts euros to dollars", async () => {
    const service = createExchangeService(fakeClient([1.1]));
    expect(await service.convert(100, "USD")).toBe(110);
  });

  it("retries after a failure without really waiting", async () => {
    vi.useFakeTimers();
    const service = createExchangeService(fakeClient([new Error("timeout"), 0.85]));
    const result = service.convert(100, "GBP");
    await vi.advanceTimersByTimeAsync(200);
    expect(await result).toBe(85);
  });
});
