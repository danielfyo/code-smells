import packageJson from "../../../../package.json";

// The single-command build is declared in package.json: this test guards that the
// "check" script keeps chaining the type-check and the tests.
describe("multi-step-build", () => {
  it("a single command runs type-check and tests", () => {
    const { scripts } = packageJson;
    expect(scripts.check).toContain("typecheck");
    expect(scripts.check).toContain("test");
    expect(scripts.typecheck).toBe("tsc --noEmit");
  });
});
