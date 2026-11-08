import { shippingReport as smelly, type Shipment } from "./Smelly";
import { shippingReport as refactored } from "./Refactored";

const shipments: Shipment[] = [
  { weightKg: 2, zone: "local", express: false },
  { weightKg: 14, zone: "national", express: true },
  { weightKg: 30, zone: "international", express: false },
];

describe("short-names-long-scopes", () => {
  it("both versions produce the same report", () => {
    const expected = { total: 3 + (6 + 2) * 1.5 + (15 + 10), heavy: 2, express: 1 };
    expect(smelly(shipments)).toEqual(expected);
    expect(refactored(shipments)).toEqual(expected);
  });
});
