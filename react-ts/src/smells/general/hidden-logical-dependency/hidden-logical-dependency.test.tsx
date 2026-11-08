import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

describe("hidden-logical-dependency", () => {
  it("with the default page size both versions agree", () => {
    const smellyPage = smelly.fetchOrdersPage(1);
    const refactoredPage = refactored.fetchOrdersPage(1);
    expect(smelly.totalPages(smellyPage.totalItems)).toBe(5);
    expect(refactored.totalPages(refactoredPage)).toBe(5);
  });

  it("if the API switches to 50 per page, smelly miscounts; refactored adapts", () => {
    const smellyPage = smelly.fetchOrdersPage(1, 50);
    expect(smelly.totalPages(smellyPage.totalItems)).toBe(5); // there are really 2 pages
    expect(refactored.totalPages(refactored.fetchOrdersPage(1, 50))).toBe(2);
  });
});
