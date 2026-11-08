# Eager Test

> **ID:** CS086 · **Category:** Test Smells · **Sources:** van Deursen 2001

*A single test verifies many different behaviors at once.*

## Definition

A single test verifies many different behaviors of the object under test, usually by calling several
production methods in sequence. Described by van Deursen et al. (2001), it makes it hard to understand which
behavior is being specified and what failed. Meszaros relates it to *Obscure Test* and to the principle of
verifying one condition per test.

## Symptoms

- Tests with generic names (`test_cart`, `TestOrderWorks`).
- Calls to several different production methods in the same test, with interleaved assertions.
- Very long tests with repeated arrange-act-assert phases.
- A failure in the first part prevents knowing whether the rest works.

## Common causes

- Saving shared setup by writing a single test.
- Writing tests as usage scripts instead of behavior specifications.

## Why it is a problem

- **Hard diagnosis**: a failure could come from any of the behaviors.
- **Poor documentation**: the test does not express a concrete rule.
- Long tests that are hard to maintain.

## Example (smelly)

```csharp
[Fact]
public void Cart_works()
{
    // SMELL: add, remove, discount and total in a single test
    var cart = new Cart();
    cart.Add(Keyboard, 2);
    Assert.Equal(2, cart.Count);
    cart.Remove(Keyboard);
    Assert.Equal(0, cart.Count);
    cart.Add(Mouse, 1);
    cart.ApplyCoupon("TEN");
    Assert.Equal(18m, cart.Total);
}
```

## Solution (refactored)

```csharp
// REFACTOR: one test per behavior, named after it
[Fact]
public void Adding_a_product_increases_the_count()
{
    var cart = new Cart();
    cart.Add(Keyboard, 2);
    Assert.Equal(2, cart.Count);
}

[Fact]
public void Coupon_reduces_the_total_by_ten_percent()
{
    var cart = CartWith(Mouse); // Creation Method
    cart.ApplyCoupon("TEN");
    Assert.Equal(18m, cart.Total);
}
```

## Recommended refactorings

- **Extract Method / split the test** (van Deursen et al.) into several tests with one behavior each.
- **Creation Method** or fixtures to share setup without sharing the test.
- Name each test after the rule it verifies (*should*/*when*/*given* style).

## When it may be acceptable

- End-to-end or acceptance tests that walk through a complete user scenario.
- Stateful flow tests (state machines) where the sequence is what is being tested, with assertion messages.

## Related smells

- [Assertion Roulette](assertion-roulette.md): a common consequence of an eager test.
- [Insufficient Tests](insufficient-tests.md): a few tests trying to cover everything.
- [Binary Operator in Name](../10-names/binary-operator-in-name.md): the production-code equivalent: doing several things.
- [Conditional Test Logic](conditional-test-logic.md): eager tests tend to accumulate logic.

## Automatic detection

- **TypeScript**: `jest/max-expects` and `jest/max-nested-describe` as an approximation.
- **Python**: Pylint `R0915` (`too-many-statements`) applied to tests; Ruff `PLR0915`.
- **C# and Go**: method length metrics (SonarQube, `funlen` in golangci-lint) applied to test code.
- **Research**: tsDetect (testsmells.org) detects *Eager Test* in Java by counting calls to production methods.

## Implementations

- Python: [`python/code_smells/tests/eager_test/`](../../../python/code_smells/tests/eager_test/)
- C#: [`csharp/src/CodeSmells/Tests/EagerTest/`](../../../csharp/src/CodeSmells/Tests/EagerTest/)
- React + TS: [`react-ts/src/smells/tests/eager-test/`](../../../react-ts/src/smells/tests/eager-test/)
- Go: [`go/smells/tests/eager-test/`](../../../go/smells/tests/eager-test/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- van Deursen, A., Moonen, L., van den Bergh, A. and Kok, G. (2001). "Refactoring Test Code". *Proceedings of the 2nd International Conference on Extreme Programming and Flexible Processes (XP2001)*.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Test smells catalog (tsDetect and related research): https://testsmells.org
