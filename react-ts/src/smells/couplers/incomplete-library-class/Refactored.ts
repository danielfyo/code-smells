// REFACTOR: Introduce Local Extension. What `Date` lacks is added once in a
// dedicated module (`businessDate`), without touching the global prototype.
// Every client reuses it.
export const businessDate = {
  isWeekend(date: Date): boolean {
    const day = date.getUTCDay();
    return day === 0 || day === 6;
  },

  addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date.getTime());
    let added = 0;
    while (added < days) {
      result.setUTCDate(result.getUTCDate() + 1);
      if (!businessDate.isWeekend(result)) added++;
    }
    return result;
  },

  formatEs(date: Date): string {
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${date.getUTCFullYear()}`;
  },
};

const PAYMENT_TERM_BUSINESS_DAYS = 10;

export const estimatedDelivery = (orderDate: Date, businessDays: number): string =>
  businessDate.formatEs(businessDate.addBusinessDays(orderDate, businessDays));

export const paymentDeadline = (invoiceDate: Date): string =>
  businessDate.formatEs(businessDate.addBusinessDays(invoiceDate, PAYMENT_TERM_BUSINESS_DAYS));
