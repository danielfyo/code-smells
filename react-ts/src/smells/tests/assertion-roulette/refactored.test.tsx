import { parseAddress } from "./production";

// REFACTOR: one case per test with a descriptive name and one assertion on the whole
// object: the toEqual diff shows exactly which field fails and in which case.
// When more than one assertion is needed, each carries its own message.
describe("parseAddress (refactored)", () => {
  it.each([
    ["Baker Street, 12, 28013 Madrid", { street: "Baker Street", number: "12", postalCode: "28013", city: "Madrid" }],
    ["Ocean Drive, 3, 08002 Barcelona", { street: "Ocean Drive", number: "3", postalCode: "08002", city: "Barcelona" }],
  ])("splits every field of '%s'", (line, expected) => {
    expect(parseAddress(line)).toEqual(expected);
  });

  it("supports multi-word cities", () => {
    expect(parseAddress("Main Street, 1, 50001 Salt Lake City").city).toBe("Salt Lake City");
  });

  it("leaves missing fields empty", () => {
    const address = parseAddress("No number");
    expect(address.number, "missing number").toBe("");
    expect(address.city, "missing city").toBe("");
  });
});
