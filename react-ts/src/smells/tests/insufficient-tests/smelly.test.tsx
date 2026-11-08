import { shippingCost } from "./production";

// SMELL: insufficient tests. Only the most obvious happy path is tested. Free shipping,
// overweight, the other zones and the invalid-weight error are not: any of those rules
// could break and this suite would stay green.
describe("shippingCost (smelly)", () => {
  it("computes shipping", () => {
    expect(shippingCost(2, "peninsula", 30)).toBe(4);
  });
});
