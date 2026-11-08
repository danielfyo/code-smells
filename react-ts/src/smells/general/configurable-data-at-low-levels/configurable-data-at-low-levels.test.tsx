import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

describe("configurable-data-at-low-levels", () => {
  it("with the default config both versions request the same thing", async () => {
    const smellyFetcher = vi.fn().mockResolvedValue("ok");
    const refactoredFetcher = vi.fn().mockResolvedValue("ok");
    await smelly.loadCatalog(smellyFetcher);
    await refactored.loadCatalog(refactoredFetcher);
    expect(refactoredFetcher.mock.calls).toEqual(smellyFetcher.mock.calls);
  });

  it("both retry 3 times by default", async () => {
    const failing = vi.fn().mockRejectedValue(new Error("down"));
    await expect(smelly.loadCatalog(failing)).rejects.toThrow("down");
    expect(failing).toHaveBeenCalledTimes(3);
  });

  it("only refactored can target another environment without touching the code", async () => {
    const fetcher = vi.fn().mockResolvedValue("ok");
    await refactored.loadCatalog(fetcher, { baseUrl: "http://localhost:3000", timeoutMs: 100, maxAttempts: 1 });
    expect(fetcher).toHaveBeenCalledWith("http://localhost:3000/catalog", 100);
  });
});
