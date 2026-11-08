import { render } from "@testing-library/react";
import { FreeShippingBanner as SmellyBanner, type Basket } from "./Smelly";
import { FreeShippingBanner as RefactoredBanner, qualifiesForFreeShipping } from "./Refactored";

const base: Basket = {
  subtotal: 30,
  items: 2,
  country: "ES",
  hasOversizedItem: false,
  customer: { isPremium: false, ordersLastYear: 1 },
};

const baskets: Basket[] = [
  base,
  { ...base, subtotal: 60 },
  { ...base, subtotal: 60, hasOversizedItem: true },
  { ...base, subtotal: 60, country: "FR" },
  { ...base, customer: { isPremium: true, ordersLastYear: 0 } },
  { ...base, customer: { isPremium: false, ordersLastYear: 12 } },
  { ...base, coupon: "freeShip" },
  { ...base, subtotal: 60, items: 0 },
];

describe("Complicated Boolean Expression", () => {
  it.each(baskets.map((b, i) => [i, b] as const))("basket %i: same banner", (_i, basket) => {
    const { container: a } = render(<SmellyBanner basket={basket} />);
    const { container: b } = render(<RefactoredBanner basket={basket} />);
    expect(b.innerHTML).toBe(a.innerHTML);
  });

  it("the named rules can be checked separately", () => {
    expect(baskets.map(qualifiesForFreeShipping)).toEqual([false, true, false, false, true, true, true, false]);
  });
});
