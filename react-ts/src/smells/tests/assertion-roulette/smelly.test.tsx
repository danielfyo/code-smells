import { parseAddress } from "./production";

// SMELL: assertion roulette. Many assertions without messages in a single test with a
// generic name. When it fails the report says "expected '' to be '28013'" and you have to
// guess which case and which field it refers to.
describe("parseAddress (smelly)", () => {
  it("works", () => {
    const a = parseAddress("Baker Street, 12, 28013 Madrid");
    expect(a.street).toBe("Baker Street");
    expect(a.number).toBe("12");
    expect(a.postalCode).toBe("28013");
    expect(a.city).toBe("Madrid");
    const b = parseAddress("Ocean Drive, 3, 08002 Barcelona");
    expect(b.street).toBe("Ocean Drive");
    expect(b.postalCode).toBe("08002");
    const c = parseAddress("Main Street, 1, 50001 Salt Lake City");
    expect(c.city).toBe("Salt Lake City");
    const d = parseAddress("No number");
    expect(d.number).toBe("");
    expect(d.city).toBe("");
  });
});
