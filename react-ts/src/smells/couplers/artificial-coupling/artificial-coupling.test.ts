import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

describe("Artificial Coupling", () => {
  it("signup validates and paginates the same way", () => {
    for (const email of ["ana@mail.com", "ana@", "no at sign"]) {
      expect(Refactored.validateSignup(email)).toBe(Smelly.validateSignup(email));
    }
    for (const total of [0, 1, 20, 41]) {
      expect(Refactored.userPages(total)).toBe(Smelly.userPages(total));
    }
  });

  it("the invoice PDF paginates the same way", () => {
    const lines = Array.from({ length: 45 }, (_, i) => `line ${i}`);
    const expected = new Smelly.InvoicePdfRenderer().render("F-9", lines);
    expect(new Refactored.InvoicePdfRenderer().render("F-9", lines)).toEqual(expected);
    expect(expected).toEqual(["F-9 p1: 20 lines", "F-9 p2: 20 lines", "F-9 p3: 5 lines"]);
  });
});
