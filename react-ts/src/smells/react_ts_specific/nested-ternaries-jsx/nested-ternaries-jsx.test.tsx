import { render } from "@testing-library/react";
import { ShipmentStatus as Smelly, type Shipment } from "./Smelly";
import { ShipmentStatus as Refactored } from "./Refactored";

const cases: Array<[Shipment, string]> = [
  [{ status: "loading" }, "Loading shipment…"],
  [{ status: "error", message: "no connection" }, "Error: no connection"],
  [{ status: "ready", trackingCode: "ES123", delivered: true }, "Delivered"],
  [{ status: "ready", trackingCode: "ES123", delivered: false }, "In transit (ES123)"],
  [{ status: "ready", trackingCode: null, delivered: false }, "Preparing the order"],
];

describe("nested-ternaries-jsx", () => {
  it.each(cases)("both versions render the same for %o", (shipment, text) => {
    const smelly = render(<Smelly shipment={shipment} />);
    const refactored = render(<Refactored shipment={shipment} />);
    expect(smelly.container.textContent).toBe(text);
    expect(refactored.container.innerHTML).toBe(smelly.container.innerHTML);
  });
});
