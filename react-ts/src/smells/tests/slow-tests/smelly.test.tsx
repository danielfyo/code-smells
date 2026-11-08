import { createExchangeService, type RatesClient } from "./production";

// SMELL: slow tests. An "almost real" client with simulated latency and the real retry
// delay (200 ms) are used. With hundreds of tests like this the suite takes minutes and nobody runs it.
// (In a real project this would be the actual network; here it is simulated with setTimeout.)
function slowRemoteClient(failFirst: boolean): RatesClient {
  let calls = 0;
  return {
    getRate: (currency) =>
      new Promise((resolve, reject) =>
        setTimeout(() => {
          calls++;
          if (failFirst && calls === 1) reject(new Error("timeout"));
          else resolve(currency === "USD" ? 1.1 : 0.85);
        }, 30),
      ),
  };
}

describe("exchange service (smelly)", () => {
  it("converts euros to dollars", async () => {
    const service = createExchangeService(slowRemoteClient(false));
    expect(await service.convert(100, "USD")).toBe(110);
  });

  it("retries after a failure", async () => {
    const start = Date.now();
    const service = createExchangeService(slowRemoteClient(true));
    expect(await service.convert(100, "GBP")).toBe(85);
    expect(Date.now() - start).toBeGreaterThanOrEqual(200); // SMELL: we pay for the real wait
  });
});
