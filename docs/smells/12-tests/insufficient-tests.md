# Insufficient Tests

> **ID:** CS080 · **Category:** Test Smells · **Sources:** Clean Code T1/T2/T8

*Only the happy path is tested; there is no coverage tool and relevant cases are untested.*

## Definition

The test suite does not cover what can break: only the happy path is tested, error cases and business rules
are missing, and nobody measures how much of the code the tests execute. *Clean Code* groups several
heuristics here: T1 (*Insufficient Tests*: test everything that could possibly break), T2 (*Use a Coverage
Tool!*) and T8 (*Test Coverage Patterns Can Be Revealing*: coverage gaps reveal why tests fail).

## Symptoms

- A single test per function, with "normal" data.
- Error branches, validations and exceptions without any test.
- No coverage report, or one that nobody looks at.
- Production bugs fixed without adding a test that reproduces them.
- Fear of refactoring because "we don't know if something will break".

## Common causes

- Pressure to deliver features and the perception of tests as a cost.
- Tests written at the end, just to "tick the box".
- Hard-to-test code (rigid dependencies, side effects) that discourages writing tests.

## Why it is a problem

- **Regressions** that reach production.
- **Refactoring becomes risky**, so the code degrades.
- A false sense of security: "the tests pass" means nothing if they do not test what matters.

## Example (smelly)

```python
def test_apply_discount():
    # SMELL: happy path only; nothing about limits, errors or rules
    order = Order(total=Decimal("100"))
    apply_discount(order, code="WELCOME10")
    assert order.total == Decimal("90")
```

## Solution (refactored)

```python
@pytest.mark.parametrize(
    ("code", "total", "expected"),
    [
        ("WELCOME10", "100", "90"),   # typical case
        ("WELCOME10", "0", "0"),      # empty order
        ("VIP25", "100", "75"),       # another discount type
    ],
)
def test_apply_discount(code, total, expected):
    order = Order(total=Decimal(total))
    apply_discount(order, code=code)
    assert order.total == Decimal(expected)


def test_unknown_code_is_rejected():
    # REFACTOR: error paths are tested too
    with pytest.raises(InvalidDiscountCode):
        apply_discount(Order(total=Decimal("100")), code="NOPE")
```

## Recommended refactorings

- **Parameterized Test** (Meszaros) to cover many cases without duplicating code.
- **Add a test for every bug** before fixing it (*Clean Code* T6: *Exhaustively Test Near Bugs*).
- Introduce a **coverage tool** in CI and set a threshold on new code.
- Make the code more testable through dependency injection and **Humble Object**.
- Complement with **mutation testing** to measure assertion quality, not just coverage.

## When it may be acceptable

- Throwaway prototypes or spikes that will never reach production.
- Trivial or generated code (DTOs, bindings) where a test adds no information.
- 100% coverage is not a goal in itself: what matters is testing what can break.

## Related smells

- [Untested Boundary Conditions](untested-boundaries.md): a particular case: boundary cases are missing.
- [Ignored Tests](ignored-tests.md): tests that exist but do not run.
- [Eager Test](eager-test.md): a few tests trying to test everything.
- [Incorrect Behavior at the Boundaries](../08-error-handling/incorrect-boundary-behavior.md): the bugs that most often slip through without enough tests.

## Automatic detection

- **Python**: coverage.py / `pytest-cov` (`pytest --cov --cov-branch --cov-fail-under=80`).
- **C#**: coverlet (`dotnet test --collect:"XPlat Code Coverage"`) with ReportGenerator for reports.
- **TypeScript**: Vitest or Jest with `--coverage` (v8/c8 or istanbul providers) and coverage thresholds.
- **Go**: `go test -cover` and `-coverprofile=cover.out` with `go tool cover -html=cover.out`.
- **SonarQube**: quality gates with minimum coverage on new code.
- **Mutation testing**: mutmut (Python), Stryker.NET, StrykerJS and gremlins (Go) reveal tests that do not detect changes.

## Implementations

- Python: [`python/code_smells/tests/insufficient_tests/`](../../../python/code_smells/tests/insufficient_tests/)
- C#: [`csharp/src/CodeSmells/Tests/InsufficientTests/`](../../../csharp/src/CodeSmells/Tests/InsufficientTests/)
- React + TS: [`react-ts/src/smells/tests/insufficient-tests/`](../../../react-ts/src/smells/tests/insufficient-tests/)
- Go: [`go/smells/tests/insufficient-tests/`](../../../go/smells/tests/insufficient-tests/)
- Angular: [`angular/src/smells/tests/insufficient-tests/`](../../../angular/src/smells/tests/insufficient-tests/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 9 "Unit Tests". Prentice Hall.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Beck, K. (2002). *Test-Driven Development: By Example*. Addison-Wesley.
- Feathers, M. (2004). *Working Effectively with Legacy Code*. Prentice Hall.
