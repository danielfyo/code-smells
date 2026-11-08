# Fragile Test / Testing Implementation Details

> **ID:** CS089 · **Category:** Test Smells · **Sources:** Meszaros 2007

*Tests coupled to implementation details that break with any refactoring.*

## Definition

A test breaks on changes that do not alter observable behavior: renaming a private method, reordering
internal calls, restructuring the DOM or changing the format of a message. Meszaros (*Fragile Test*)
distinguishes several causes (interface, behavior, data and context sensitivity); the most common is testing
**implementation details** rather than behavior.

## Symptoms

- Mocks that verify every internal call and its exact order.
- Access to private methods or fields from tests (reflection, `_private`, `@ts-ignore`).
- Component tests that query CSS classes, DOM structure or internal component state.
- Every refactoring forces dozens of tests to be rewritten with no change in functionality.
- Huge snapshots updated without review.

## Common causes

- Writing tests from the implementation instead of from the requirements.
- Overuse of mocks for every collaborator.
- Poor public interfaces that force tests to look inside.

## Why it is a problem

- **Tests hold refactoring back** instead of enabling it.
- **High maintenance cost** and the temptation to delete or ignore tests.
- False negatives that teach the team to "fix the test" without thinking.

## Example (smelly)

```tsx
it("adds a product to the cart", async () => {
  const { container } = render(<ProductCard product={keyboard} />);
  // SMELL: depends on CSS classes and DOM structure
  fireEvent.click(container.querySelector(".card > div.actions > button.btn-primary")!);
  expect(container.querySelector(".badge")!.textContent).toBe("1");
});
```

## Solution (refactored)

```tsx
it("adds a product to the cart", async () => {
  render(<ProductCard product={keyboard} />);
  // REFACTOR: interact as the user would (accessible role and name)
  await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
  expect(screen.getByRole("status")).toHaveTextContent("1 item in cart");
});
```

## Recommended refactorings

- **Test through the public interface** and verify observable results, not internal calls.
- Prefer **Fake Objects** and state verification over mocks with behavior verification where possible.
- **Creation Method** and builders to isolate tests from constructor changes.
- In React, Testing Library's accessible queries (`getByRole`, `getByLabelText`) instead of CSS selectors.
- Reduce snapshots to small, meaningful fragments.

## When it may be acceptable

- Verifying interactions when the interaction *is* the behavior (e.g. exactly one email is sent, or a payment gateway is called).
- Temporary characterization tests on legacy code before refactoring it.

## Related smells

- [Interdependent Tests / Shared Fixture](interdependent-tests.md): context sensitivity, another cause of fragility according to Meszaros.
- [Mystery Guest](mystery-guest.md): sensitivity to shared data.
- [Assertion Roulette](assertion-roulette.md): assertions on too many details.
- [Too Much Information / Indecent Exposure](../11-general/too-much-information.md): exposing internals invites testing them.

## Automatic detection

- **TypeScript/React**: `eslint-plugin-testing-library` (`no-container`, `no-node-access`, `prefer-screen-queries`) and `jest/no-large-snapshots`.
- **Python**: Ruff `SLF001` and Pylint `W0212` (`protected-access`) applied to tests as well.
- **C#**: review `InternalsVisibleTo` usage and strict Moq verifications (`MockBehavior.Strict`, `VerifyNoOtherCalls`).
- **Go**: prefer external test packages (`package foo_test`), which only see the exported API; the `testpackage` linter enforces it.

## Implementations

- Python: [`python/code_smells/tests/fragile_test/`](../../../python/code_smells/tests/fragile_test/)
- C#: [`csharp/src/CodeSmells/Tests/FragileTest/`](../../../csharp/src/CodeSmells/Tests/FragileTest/)
- React + TS: [`react-ts/src/smells/tests/fragile-test/`](../../../react-ts/src/smells/tests/fragile-test/)
- Go: [`go/smells/tests/fragile-test/`](../../../go/smells/tests/fragile-test/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Test smells catalog (tsDetect and related research): https://testsmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
