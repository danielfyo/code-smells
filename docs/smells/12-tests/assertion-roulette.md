# Assertion Roulette

> **ID:** CS084 · **Category:** Test Smells · **Sources:** van Deursen 2001; Meszaros 2007

*Many assertions without messages in one test: when it fails, nobody knows which one or why.*

## Definition

A test contains many assertions without descriptive messages, so when it fails it is unclear which one
failed and why. Described by van Deursen et al. (2001) and covered by Meszaros (*Assertion Roulette*), it is
especially harmful in frameworks that only report the line number, or in long tests whose assertions compare
similar values.

## Symptoms

- Dozens of consecutive `assert`/`Assert.Equal`/`expect` without messages.
- Generic failure messages ("expected 2 but was 3") without knowing what they refer to.
- Assertions checking a large object field by field.
- Having to debug the test to understand a failure.

## Common causes

- Tests that check too many things at once (see *Eager Test*).
- No structural equality or custom assertions available.

## Why it is a problem

- **Slow diagnosis** of failures.
- **Masked failures**: in many frameworks the first failing assertion hides the rest.
- Tests that are hard to read as specifications.

## Example (smelly)

```typescript
it("creates the invoice", () => {
  const invoice = createInvoice(order);
  // SMELL: if it fails, which of the 2s was it?
  expect(invoice.lines.length).toBe(2);
  expect(invoice.total).toBe(121);
  expect(invoice.tax).toBe(21);
  expect(invoice.lines[0].amount).toBe(2);
  expect(invoice.customerId).toBe("c-1");
  expect(invoice.status).toBe("draft");
});
```

## Solution (refactored)

```typescript
it("creates the invoice with tax computed on the net amount", () => {
  const invoice = createInvoice(order);
  // REFACTOR: one structural assertion with a readable diff on failure
  expect(invoice).toMatchObject({
    customerId: "c-1",
    status: "draft",
    net: 100,
    tax: 21,
    total: 121,
  });
});

it("creates one line per ordered product", () => {
  expect(createInvoice(order).lines.map((l) => l.sku)).toEqual(["KB-01", "MS-02"]);
});
```

## Recommended refactorings

- **Add Assertion Explanation** (van Deursen et al.): descriptive messages.
- **Custom Assertion** (Meszaros) or comparison against an **Expected Object**.
- **Split the test** into several, each with a single concept.
- Use grouped assertions where the framework offers them (`Assert.Multiple` in NUnit and xUnit v3, `expect.soft` in Vitest/Playwright).

## When it may be acceptable

- Several assertions verifying a single concept (properties of one result object) when the framework shows a clear diff.
- Characterization tests of legacy code as an intermediate step.

## Related smells

- [Eager Test](eager-test.md): a test that tests many things usually has many assertions.
- [Fragile Test / Testing Implementation Details](fragile-test.md): assertions on too many details.
- [Conditional Test Logic](conditional-test-logic.md): assertions inside loops make it worse.

## Automatic detection

- **Python**: Ruff `PT018` (composite assertion that should be split) and `PT009` (unittest-style assertions); pytest's assertion rewriting shows values, which mitigates the problem.
- **TypeScript**: `jest/max-expects` limits the number of `expect` calls per test.
- **C# and Go**: no standard rules; code review. In Go, `testifylint` helps use testify assertions correctly.
- **Research**: tsDetect (testsmells.org) detects *Assertion Roulette* in Java/JUnit tests.

## Implementations

- Python: [`python/code_smells/tests/assertion_roulette/`](../../../python/code_smells/tests/assertion_roulette/)
- C#: [`csharp/src/CodeSmells/Tests/AssertionRoulette/`](../../../csharp/src/CodeSmells/Tests/AssertionRoulette/)
- React + TS: [`react-ts/src/smells/tests/assertion-roulette/`](../../../react-ts/src/smells/tests/assertion-roulette/)
- Go: [`go/smells/tests/assertion-roulette/`](../../../go/smells/tests/assertion-roulette/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- van Deursen, A., Moonen, L., van den Bergh, A. and Kok, G. (2001). "Refactoring Test Code". *Proceedings of the 2nd International Conference on Extreme Programming and Flexible Processes (XP2001)*.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Test smells catalog (tsDetect and related research): https://testsmells.org
