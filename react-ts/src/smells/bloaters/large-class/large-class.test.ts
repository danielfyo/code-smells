import { LibraryManager as SmellyLibrary } from "./Smelly";
import { LibraryManager as RefactoredLibrary, FineLedger } from "./Refactored";

type Library = SmellyLibrary | RefactoredLibrary;

function scenario(lib: Library) {
  lib.addBook("111", "Dune");
  lib.addBook("222", "Neuromancer");
  lib.addMember("m1", "Ana", "ana@mail.com");
  lib.lend("111", "m1", 0);
  const availableWhileLent = lib.isAvailable("111");
  lib.giveBack("111", 20); // 6 days late
  const fine = lib.fineOf("m1");
  let blocked = false;
  try {
    lib.lend("222", "m1", 21);
  } catch {
    blocked = true;
  }
  lib.payFine("m1");
  lib.lend("222", "m1", 22);
  return { availableWhileLent, fine, blocked, report: lib.report() };
}

describe("Large Class", () => {
  it("the refactored facade behaves exactly like the God Class", () => {
    expect(scenario(new RefactoredLibrary())).toEqual(scenario(new SmellyLibrary()));
  });

  it("charges a fine for late returns", () => {
    const result = scenario(new RefactoredLibrary());
    expect(result).toEqual({
      availableWhileLent: false,
      fine: 3,
      blocked: true,
      report: "Books: 2, lent: 1, members: 1",
    });
  });

  it("the extracted classes can be tested in isolation", () => {
    const ledger = new FineLedger();
    ledger.charge("x", -2);
    expect(ledger.of("x")).toBe(0);
    ledger.charge("x", 4);
    expect(ledger.of("x")).toBe(2);
  });

  it("both versions validate the member's email", () => {
    expect(() => new SmellyLibrary().addMember("a", "A", "bad")).toThrow("Invalid email");
    expect(() => new RefactoredLibrary().addMember("a", "A", "bad")).toThrow("Invalid email");
  });
});
