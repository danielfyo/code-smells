# Conditional Test Logic

> **ID:** CS087 · **Category:** Test Smells · **Sources:** Meszaros 2007

*Tests with if statements, loops or try/catch that may never execute their assertions.*

## Definition

A test contains `if`, loops, `switch` or `try/catch` that decide what runs or what gets checked. Meszaros
(*Conditional Test Logic*) warns that test code should be linear: with conditional logic, some assertions
may never run and the test passes without verifying anything; moreover, the test itself would need tests.

## Symptoms

- `if` around assertions (`if result: assert ...`).
- Loops that iterate over data and assert inside, without saying which case failed.
- `try`/`catch` in the test that catches the expected exception by hand or swallows failures.
- Tests that pass even when the collection is empty (the loop never iterates).

## Common causes

- Trying to cover several cases with a single test.
- Unfamiliarity with parameterized tests or with `pytest.raises`/`Assert.Throws`/`toThrow`.
- Nondeterministic results "controlled" with conditions.

## Why it is a problem

- **False positives**: the test passes without having verified anything.
- **Tests that are hard to understand** and debug.
- Logic in tests that may have its own bugs.

## Example (smelly)

```typescript
it("rejects expired coupons", async () => {
  const coupons = await loadCoupons();
  for (const coupon of coupons) {
    if (coupon.expiresAt < now) {
      try {
        applyCoupon(cart, coupon);
      } catch (e) {
        // SMELL: if it does not throw, or there are no expired coupons, the test still passes
        expect((e as Error).message).toContain("expired");
      }
    }
  }
});
```

## Solution (refactored)

```typescript
it.each([
  ["expired yesterday", daysAgo(1)],
  ["expired a year ago", daysAgo(365)],
])("rejects a coupon %s", (_label, expiresAt) => {
  const coupon = aCoupon({ expiresAt });
  // REFACTOR: linear test; the exception assertion always runs
  expect(() => applyCoupon(cart, coupon)).toThrow(/expired/);
});
```

## Recommended refactorings

- **Parameterized Test** instead of loops.
- The framework's **exception assertions** (`pytest.raises`, `Assert.Throws`, `expect(...).toThrow`, checking `err` with `errors.Is` in Go).
- **Guard Assertion** (Meszaros) instead of `if` around assertions.
- **Test Utility Method**, tested separately, if the logic is unavoidable.

## When it may be acceptable

- Go table-driven tests, where the `for _, tc := range cases` loop with `t.Run` is idiomatic (each case is a named subtest).
- Loops checking every element of a result, provided the test first asserts that the collection is not empty.

## Related smells

- [Assertion Roulette](assertion-roulette.md): assertions in loops without messages.
- [Eager Test](eager-test.md): a test trying to cover many cases.
- [Swallowed Exceptions / Afraid to Fail](../08-error-handling/swallowed-exceptions.md): `try/catch` that swallows failures, now in tests.
- [Fragile Test / Testing Implementation Details](fragile-test.md): logic in tests often mirrors implementation details.

## Automatic detection

- **Python**: Ruff `PT017` (assertion inside `except`), `PT011`/`PT012` (correct use of `pytest.raises`).
- **TypeScript**: `jest/no-conditional-expect`, `jest/no-conditional-in-test` and `jest/expect-expect` (or their `@vitest/eslint-plugin` equivalents).
- **C#**: SonarQube `S2699` (tests without assertions) catches part of the problem; review `try/catch` in tests.
- **Go**: no standard rule; `thelper` and `tparallel` help structure subtests correctly.
- **Research**: tsDetect (testsmells.org) detects *Conditional Test Logic* in Java.

## Implementations

- Python: [`python/code_smells/tests/conditional_test_logic/`](../../../python/code_smells/tests/conditional_test_logic/)
- C#: [`csharp/src/CodeSmells/Tests/ConditionalTestLogic/`](../../../csharp/src/CodeSmells/Tests/ConditionalTestLogic/)
- React + TS: [`react-ts/src/smells/tests/conditional-test-logic/`](../../../react-ts/src/smells/tests/conditional-test-logic/)
- Go: [`go/smells/tests/conditional-test-logic/`](../../../go/smells/tests/conditional-test-logic/)
- Angular: [`angular/src/smells/tests/conditional-test-logic/`](../../../angular/src/smells/tests/conditional-test-logic/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- van Deursen, A., Moonen, L., van den Bergh, A. and Kok, G. (2001). "Refactoring Test Code". *Proceedings of the 2nd International Conference on Extreme Programming and Flexible Processes (XP2001)*.
- Test smells catalog (tsDetect and related research): https://testsmells.org
