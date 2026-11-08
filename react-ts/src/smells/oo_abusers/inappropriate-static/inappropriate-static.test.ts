import { InvoiceService as SmellyService } from "./Smelly";
import { InvoiceService as RefactoredService } from "./Refactored";

const invoice = { id: "INV-1", amount: 200, dueDate: new Date("2026-03-01T00:00:00Z") };
const tenDaysLater = new Date("2026-03-11T00:00:00Z");

describe("Inappropriate Static", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("the smelly version can only be tested by faking the global clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(tenDaysLater);
    expect(SmellyService.amountDue(invoice)).toBe(240);
  });

  it("the refactored version receives an injected clock and gives the same result", () => {
    const service = new RefactoredService({ today: () => tenDaysLater });
    expect(service.amountDue(invoice)).toBe(240);
  });

  it("both agree when using the system clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-15T00:00:00Z"));
    expect(new RefactoredService().amountDue(invoice)).toBe(SmellyService.amountDue(invoice));
  });

  it("the fee policy can be replaced too", () => {
    const service = new RefactoredService({ today: () => tenDaysLater }, { dailyRate: () => 0 });
    expect(service.amountDue(invoice)).toBe(200);
  });
});
