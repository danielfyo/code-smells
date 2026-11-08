import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

const validJson = JSON.stringify({ id: "A1", total: 10, items: [{ sku: "x", qty: 2 }, { sku: "y", qty: 1 }] });
const badJson = JSON.stringify({ id: "A2", total: "10", items: [{ sku: "x", quantity: 2 }] });

describe("any-type", () => {
  it("with valid data both versions format the same", () => {
    expect(smelly.formatOrder(smelly.parseOrder(validJson))).toBe("Order A1: 3 units, 10 €");
    expect(refactored.formatOrder(refactored.parseOrder(validJson))).toBe("Order A1: 3 units, 10 €");
  });

  it("smelly accepts corrupt data and silently produces garbage", () => {
    const order = smelly.parseOrder(badJson);
    expect(smelly.formatOrder(order)).toBe("Order A2: NaN units, 10 €");
  });

  it("refactored rejects corrupt data at the boundary", () => {
    expect(() => refactored.parseOrder(badJson)).toThrow(TypeError);
  });
});
