import { render } from "@testing-library/react";
import { LoyaltyBadge as SmellyBadge } from "./Smelly";
import { LoyaltyBadge as RefactoredBadge, loyaltyTier, type Customer } from "./Refactored";

const customers: Customer[] = [
  { name: "Olga", signupYear: 2018, orders: 60, totalSpent: 1500 },
  { name: "Raul", signupYear: 2025, orders: 2, totalSpent: 200 },
  { name: "Ines", signupYear: 2024, orders: 0, totalSpent: 0 },
  { name: "Gael", signupYear: 2023, orders: 10, totalSpent: 600 },
];

describe("Feature Envy", () => {
  it.each(customers)("same text for $name", (customer) => {
    const { container: a } = render(<SmellyBadge customer={customer} currentYear={2026} />);
    const { container: b } = render(<RefactoredBadge customer={customer} currentYear={2026} />);
    expect(b.textContent).toBe(a.textContent);
  });

  it("the business rule is tested without UI", () => {
    expect(customers.map((c) => loyaltyTier(c, 2026))).toEqual(["Gold", "Silver", "Bronze", "Silver"]);
  });
});
