export interface Customer {
  name: string;
  signupYear: number;
  orders: number;
  totalSpent: number;
}

export type Tier = "Bronze" | "Silver" | "Gold";

// REFACTOR: Move Function. The tier computation moves to the customer module
// (next to the data it uses). The view just asks for the result.
export const seniority = (c: Customer, currentYear: number): number => currentYear - c.signupYear;

export const averageTicket = (c: Customer): number => (c.orders === 0 ? 0 : c.totalSpent / c.orders);

export function loyaltyTier(c: Customer, currentYear: number): Tier {
  if (c.totalSpent > 2000 || (seniority(c, currentYear) >= 5 && c.orders >= 50)) return "Gold";
  if (c.totalSpent > 500 || averageTicket(c) > 80) return "Silver";
  return "Bronze";
}

export function LoyaltyBadge({ customer, currentYear }: { customer: Customer; currentYear: number }) {
  return (
    <p>
      {customer.name} · customer for {seniority(customer, currentYear)} years · tier{" "}
      {loyaltyTier(customer, currentYear)}
    </p>
  );
}
