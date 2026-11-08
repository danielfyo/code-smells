export interface Customer {
  name: string;
  signupYear: number;
  orders: number;
  totalSpent: number;
}

// SMELL: Feature Envy. The presentational component is obsessed with the data
// of `Customer`: it reads four of its fields to decide the loyalty tier. That
// business rule belongs to the customer, not to the view.
export function LoyaltyBadge({ customer, currentYear }: { customer: Customer; currentYear: number }) {
  const years = currentYear - customer.signupYear;
  const averageTicket = customer.orders === 0 ? 0 : customer.totalSpent / customer.orders;
  let tier = "Bronze";
  if (customer.totalSpent > 2000 || (years >= 5 && customer.orders >= 50)) {
    tier = "Gold";
  } else if (customer.totalSpent > 500 || averageTicket > 80) {
    tier = "Silver";
  }
  return (
    <p>
      {customer.name} · customer for {years} years · tier {tier}
    </p>
  );
}
