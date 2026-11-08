import { transfer as smelly, type Ledger } from "./Smelly";
import { transfer as refactored, TransferError } from "./Refactored";

const makeLedger = (): Ledger => ({
  balances: new Map([
    ["ana", 100],
    ["bea", 0],
    ["till-b", 0],
  ]),
  frozen: new Set(["till-b"]),
});

describe("Swallowed Exceptions", () => {
  it("on the happy path both transfer the same way", () => {
    const a = makeLedger();
    const b = makeLedger();
    smelly(a, "ana", "bea", 30);
    refactored(b, "ana", "bea", 30);
    expect([...b.balances]).toEqual([...a.balances]);
  });

  it("bug: the smelly version silently loses money", () => {
    const ledger = makeLedger();
    expect(() => smelly(ledger, "ana", "till-b", 40)).not.toThrow();
    const total = [...ledger.balances.values()].reduce((s, v) => s + v, 0);
    expect(total).toBe(60); // 40 have vanished!
  });

  it("the refactored version compensates and reports", () => {
    const ledger = makeLedger();
    expect(() => refactored(ledger, "ana", "till-b", 40)).toThrow(TransferError);
    expect(ledger.balances.get("ana")).toBe(100);
    expect(() => refactored(ledger, "bea", "ana", 1)).toThrow("Insufficient funds");
  });
});
