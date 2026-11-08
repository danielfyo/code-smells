import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrdersDashboard as Smelly, type Order } from "./Smelly";
import { OrdersDashboard as Refactored, orderRevenue } from "./Refactored";

const orders: Order[] = [
  { id: 1, customer: "Anna", total: 100, status: "pending" },
  { id: 2, customer: "VIP Luke", total: 100, status: "shipped" },
];
const loadOrders = () => Promise.resolve(orders);

describe("god-component", () => {
  it.each([
    ["smelly", Smelly],
    ["refactored", Refactored],
  ])("%s loads, filters and computes revenue", async (_name, Dashboard) => {
    render(<Dashboard loadOrders={loadOrders} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(await screen.findByText("Revenue: 229.90 €")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Pending only"));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Revenue: 121.00 €")).toBeInTheDocument();
  });

  it("the business rule is tested without rendering", () => {
    expect(orderRevenue(orders[1])).toBeCloseTo(108.9);
  });
});
