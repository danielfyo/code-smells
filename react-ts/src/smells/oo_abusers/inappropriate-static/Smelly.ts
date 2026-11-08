// SMELL: Inappropriate Static. The current date and the late-fee rate come
// from static "utility" methods. They are hidden dependencies: they cannot be
// replaced, so testing requires tampering with the global clock.
export class SystemClock {
  static today(): Date {
    return new Date();
  }
}

export class LateFeePolicy {
  static dailyRate(): number {
    return 0.02;
  }
}

export interface Invoice {
  id: string;
  amount: number;
  dueDate: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export class InvoiceService {
  // SMELL: the signature does not reveal that it depends on the clock or on the fee policy.
  static amountDue(invoice: Invoice): number {
    const lateDays = Math.floor((SystemClock.today().getTime() - invoice.dueDate.getTime()) / DAY_MS);
    if (lateDays <= 0) return invoice.amount;
    return Math.round(invoice.amount * (1 + LateFeePolicy.dailyRate() * lateDays) * 100) / 100;
  }
}
