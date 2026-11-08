export interface Invoice {
  id: string;
  amount: number;
  dueDate: Date;
}

// REFACTOR: Replace Static with Instance + Dependency Injection. Dependencies
// are expressed as interfaces and injected through the constructor.
export interface Clock {
  today(): Date;
}

export interface FeePolicy {
  dailyRate(): number;
}

export const systemClock: Clock = { today: () => new Date() };
export const standardFees: FeePolicy = { dailyRate: () => 0.02 };

const DAY_MS = 24 * 60 * 60 * 1000;

export class InvoiceService {
  // REFACTOR: production defaults; tests pass in test doubles.
  constructor(
    private readonly clock: Clock = systemClock,
    private readonly fees: FeePolicy = standardFees,
  ) {}

  amountDue(invoice: Invoice): number {
    const lateDays = Math.floor((this.clock.today().getTime() - invoice.dueDate.getTime()) / DAY_MS);
    if (lateDays <= 0) return invoice.amount;
    return Math.round(invoice.amount * (1 + this.fees.dailyRate() * lateDays) * 100) / 100;
  }
}
