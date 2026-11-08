import { handle, process, type Order } from "./Smelly";
import { selectPaidOrders, settlePendingOrder } from "./Refactored";

const orders: Order[] = [
  { id: "1", status: "pending", total: 20 },
  { id: "2", status: "pending", total: 0 },
  { id: "3", status: "shipped", total: 10 },
];

describe("ambiguous-name", () => {
  it("both versions settle pending orders the same way", () => {
    expect(orders.map(process)).toEqual(orders.map(settlePendingOrder));
    expect(orders.map(settlePendingOrder).map((o) => o.status)).toEqual(["paid", "cancelled", "shipped"]);
  });

  it("both versions filter paid orders", () => {
    const settled = orders.map(settlePendingOrder);
    expect(handle(settled)).toEqual(selectPaidOrders(settled));
    expect(selectPaidOrders(settled).map((o) => o.id)).toEqual(["1"]);
  });
});
