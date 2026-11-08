# Untested Boundary Conditions

> **ID:** CS082 · **Category:** Test Smells · **Sources:** Clean Code T3/T5/T6

*Boundary cases and the surroundings of known bugs are not tested.*

## Definition

Tests do not exercise boundary conditions (empty, zero, maximum, the exact threshold value, one above and one
below) or the surroundings of known bugs. *Clean Code* covers this in T3 (*Don't Skip Trivial Tests*), T5
(*Test Boundary Conditions*) and T6 (*Exhaustively Test Near Bugs*: bugs tend to congregate, so where there
was one it pays to test thoroughly).

## Symptoms

- Tests that only use "middle" values (a 50 order when the threshold is 100).
- No tests with empty collections, `0`, `null`, boundary dates or the exact threshold value.
- Off-by-one bugs that recur in the same area of the code.
- Bug fixes without tests for the neighboring values.

## Common causes

- Thinking in typical examples rather than equivalence partitions.
- Considering boundary cases "trivial".

## Why it is a problem

- **The most frequent bugs** (boundary, off-by-one) are precisely the ones that go undetected.
- Ambiguous requirements ("from 100 up") that are never clarified because no test pins them down.

## Example (smelly)

```go
func TestShippingCost(t *testing.T) {
    // SMELL: only values far from the 60 threshold
    if got := ShippingCost(20); got != 4.95 {
        t.Errorf("got %v", got)
    }
    if got := ShippingCost(200); got != 0 {
        t.Errorf("got %v", got)
    }
}
```

## Solution (refactored)

```go
func TestShippingCost(t *testing.T) {
    // REFACTOR: table with explicit boundaries
    cases := []struct {
        name  string
        total float64
        want  float64
    }{
        {"empty cart", 0, 4.95},
        {"just below threshold", 59.99, 4.95},
        {"exactly at threshold", 60, 0},
        {"above threshold", 60.01, 0},
    }
    for _, tc := range cases {
        t.Run(tc.name, func(t *testing.T) {
            if got := ShippingCost(tc.total); got != tc.want {
                t.Errorf("ShippingCost(%v) = %v, want %v", tc.total, got, tc.want)
            }
        })
    }
}
```

## Recommended refactorings

- **Parameterized or table-driven tests** (*Parameterized Test*) with named boundary values.
- **Boundary value analysis and equivalence partitioning** when designing cases.
- **Property-based testing** (Hypothesis, FsCheck, fast-check, Go fuzzing) to explore the extremes automatically.
- When fixing a bug, add tests for the case and its neighbors (T6).

## When it may be acceptable

- Functions without relevant boundaries (e.g. pure composition of already tested functions).
- When boundaries are tested at another level (a value type with its own tests) and the function only delegates.

## Related smells

- [Incorrect Behavior at the Boundaries](../08-error-handling/incorrect-boundary-behavior.md): the corresponding production defect.
- [Insufficient Tests](insufficient-tests.md): the general case.
- [Conditional Test Logic](conditional-test-logic.md): loops in tests sometimes hide which cases are tested.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md): unnamed thresholds that are hard to test.

## Automatic detection

- **Mutation testing**: mutmut (Python), Stryker.NET, StrykerJS and gremlins (Go) change `<` into `<=` and reveal untested boundaries; it is the most effective tool for this smell.
- **Branch coverage**: `pytest --cov-branch`, coverlet, `--coverage` in Vitest/Jest and `go test -covermode=count` show unexercised branches, although they do not guarantee boundary values.

## Implementations

- Python: [`python/code_smells/tests/untested_boundaries/`](../../../python/code_smells/tests/untested_boundaries/)
- C#: [`csharp/src/CodeSmells/Tests/UntestedBoundaries/`](../../../csharp/src/CodeSmells/Tests/UntestedBoundaries/)
- React + TS: [`react-ts/src/smells/tests/untested-boundaries/`](../../../react-ts/src/smells/tests/untested-boundaries/)
- Go: [`go/smells/tests/untested-boundaries/`](../../../go/smells/tests/untested-boundaries/)
- Angular: [`angular/src/smells/tests/untested-boundaries/`](../../../angular/src/smells/tests/untested-boundaries/)

Each folder contains the production code under test and two versions of the tests: the `smelly` one, showing
the smell (marked with `SMELL:` comments), and the `refactored` one, with the clean test (`REFACTOR:`
comments). Both versions pass; the difference lies in readability, speed or reliability.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Hunt, A. and Thomas, D. (2019). *The Pragmatic Programmer* (20th anniversary ed.). Addison-Wesley.
