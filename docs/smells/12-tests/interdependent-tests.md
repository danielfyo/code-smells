# Interdependent Tests / Shared Fixture

> **ID:** CS090 · **Category:** Test Smells · **Sources:** Meszaros 2007

*Tests that share mutable state and only pass in a specific order.*

## Definition

Tests share mutable state (a shared fixture, global or class variables, a database, files) and therefore
only pass when run in a specific order or in isolation. Meszaros describes this as *Interacting Tests* (a
form of *Erratic Test*) and relates it to the use of a *Shared Fixture*; the result is failures that appear
or disappear depending on order or parallelism.

## Symptoms

- A test passes alone and fails in the suite, or vice versa.
- Module variables, static fields or singletons modified by tests.
- A test that relies on another one having created a record first.
- Failures when parallel or random-order execution is enabled.

## Common causes

- Reusing an expensive fixture to save time.
- Global state in production code (singletons, static caches).
- No cleanup (teardown) after each test.

## Why it is a problem

- **Erratic failures** that cannot be reproduced reliably.
- **The suite cannot be parallelized**.
- One failing test triggers a cascade of failures in others, hiding the real cause.

## Example (smelly)

```python
cart = Cart()  # SMELL: shared, mutable module-level fixture


def test_add_product():
    cart.add("KB-01", qty=1)
    assert cart.count == 1


def test_total_is_zero_for_empty_cart():
    # Fails if run after test_add_product
    assert cart.total == 0
```

## Solution (refactored)

```python
@pytest.fixture
def cart() -> Cart:
    # REFACTOR: Fresh Fixture; each test gets its own cart
    return Cart()


def test_add_product(cart):
    cart.add("KB-01", qty=1)
    assert cart.count == 1


def test_total_is_zero_for_empty_cart(cart):
    assert cart.total == 0
```

## Recommended refactorings

- **Fresh Fixture** (Meszaros): create the state in each test.
- **Immutable Shared Fixture** if creation is expensive.
- **Make Resource Unique** (van Deursen et al.): unique names or identifiers per test in databases or files.
- **Automated Teardown**, per-test rolled-back transactions or ephemeral databases.
- Remove global state from production code through dependency injection.

## When it may be acceptable

- Expensive read-only fixtures (an immutable reference database) shared by design.
- End-to-end suites that model an explicit sequential flow, documented as such.

## Related smells

- [Global Data](../05-couplers/global-data.md): global state is the most frequent root cause.
- [Static Mutable State](../15-csharp/static-mutable-state.md): mutable static state in C#.
- [Mutable Package-level State](../17-go/package-level-state.md): package-level state in Go.
- [Mystery Guest](mystery-guest.md): shared external resources.
- [Fragile Test / Testing Implementation Details](fragile-test.md): context sensitivity.

## Automatic detection

- **Python**: `pytest-randomly` (random order) and `pytest-xdist` (parallel) bring dependencies to the surface.
- **C#**: xUnit runs test classes in parallel by default; NUnit and MSTest offer configurable parallelism and ordering.
- **TypeScript**: Jest `--randomize` and Vitest `sequence.shuffle`; both run files in parallel.
- **Go**: `go test -shuffle=on` and `-count=N`; `go test -race`; the `paralleltest` and `tparallel` linters encourage `t.Parallel()`.

## Implementations

- Python: [`python/code_smells/tests/interdependent_tests/`](../../../python/code_smells/tests/interdependent_tests/)
- C#: [`csharp/src/CodeSmells/Tests/InterdependentTests/`](../../../csharp/src/CodeSmells/Tests/InterdependentTests/)
- React + TS: [`react-ts/src/smells/tests/interdependent-tests/`](../../../react-ts/src/smells/tests/interdependent-tests/)
- Go: [`go/smells/tests/interdependent-tests/`](../../../go/smells/tests/interdependent-tests/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- van Deursen, A., Moonen, L., van den Bergh, A. and Kok, G. (2001). "Refactoring Test Code". *Proceedings of the 2nd International Conference on Extreme Programming and Flexible Processes (XP2001)*.
- Test smells catalog (tsDetect and related research): https://testsmells.org
