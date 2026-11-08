import { render } from "@testing-library/react";
import { OrderBadge as Smelly } from "./Smelly";
import { OrderBadge as Refactored, type Order } from "./Refactored";

const orders: Order[] = [
  { id: "1", status: "pending", currency: "EUR", amount: 10 },
  { id: "2", status: "shipped", currency: "USD", amount: 20, trackingCode: "TRK9" },
  { id: "3", status: "cancelled", currency: "EUR", amount: 5, cancelReason: "out of stock" },
];

describe("stringly-typed", () => {
  it.each(orders)("both versions render order $id the same", (order) => {
    const smelly = render(<Smelly order={order} />);
    const refactored = render(<Refactored order={order} />);
    expect(refactored.container.textContent).toBe(smelly.container.textContent);
  });

  it("smelly accepts typos the compiler cannot catch", () => {
    const { container } = render(<Smelly order={{ id: "4", status: "shiped", currency: "eur", amount: 1 }} />);
    expect(container.textContent).toBe("Unknown · 1 ?");
    // In refactored, status: "shiped" or currency: "eur" are compile errors.
  });
});
