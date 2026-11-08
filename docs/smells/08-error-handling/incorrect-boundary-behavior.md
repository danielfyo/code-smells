# Incorrect Behavior at the Boundaries

> **ID:** CS050 · **Category:** Error Handling · **Sources:** Clean Code G3/G33

*Boundary conditions (empty, zero, last element, off-by-one) that are scattered or not handled.*

## Definition

The code does not handle boundary conditions correctly: empty collections, zero, negative values, the first or
last element, inclusive versus exclusive limits, overflows. *Clean Code* covers this in G3 (*Incorrect
Behavior at the Boundaries*: "don't rely on your intuition; look for every boundary condition and write a
test for it") and G33 (*Encapsulate Boundary Conditions*: scattered `+1`/`-1` adjustments should be
concentrated in one named place).

## Symptoms

- Expressions like `len(x) - 1`, `i + 1` or `<= n` repeated in several places with different criteria.
- Divisions by `len(items)` without checking that the collection is non-empty.
- Off-by-one bugs in pagination, date ranges or discount tiers.
- Mixed `<` and `<=` comparisons for the same concept (e.g. "orders over 100").
- Functions that fail with `IndexError`, `NaN` or `nil` on empty input.

## Common causes

- Thinking only about the typical case during development.
- Ambiguous requirements ("from 100 up": does that include 100?).
- Index arithmetic repeated rather than encapsulated.

## Why it is a problem

- **Intermittent errors** that only show up with infrequent data (last day of the month, empty cart).
- **Inconsistencies** between modules that interpret the same limit differently.
- Production failures such as division by zero, `NaN` or index exceptions.

## Example (smelly)

```python
def average_ticket(orders: list[Order]) -> float:
    # SMELL: blows up on an empty list
    return sum(o.total for o in orders) / len(orders)


def page(items: list[Item], number: int, size: int) -> list[Item]:
    # SMELL: the +1 / -1 is repeated and easy to get wrong
    start = (number - 1) * size
    return items[start : start + size - 1]  # drops the last item of every page
```

## Solution (refactored)

```python
def average_ticket(orders: list[Order]) -> float:
    # REFACTOR: the empty case is handled explicitly
    if not orders:
        return 0.0
    return sum(o.total for o in orders) / len(orders)


def page(items: list[Item], number: int, size: int) -> list[Item]:
    # REFACTOR: boundary encapsulated in named variables (G33)
    first_index = (number - 1) * size
    end_exclusive = first_index + size
    return items[first_index:end_exclusive]
```

## Recommended refactorings

- **Extract Variable** to name the limits (`end_exclusive`, `last_index`).
- **Extract Function** to encapsulate boundary arithmetic (`page_bounds`, `is_in_range`).
- **Introduce Special Case** for the empty case when it has domain behavior.
- **Replace Primitive with Object**: a `DateRange` or `Range` type with clear inclusive/exclusive semantics.
- **Introduce Assertion** for preconditions (`size > 0`).

## When it may be acceptable

- Prototypes or one-off scripts where the input is controlled.
- When the contract states the input cannot be empty and this is validated at the system boundary (with an assertion).

## Related smells

- [Untested Boundary Conditions](../12-tests/untested-boundaries.md): the other side: boundaries that are not tested either.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md): stray `+1` and `-1` are magic numbers.
- [Be Precise / Imprecision](../11-general/imprecision.md): assuming instead of checking.
- [Missing Explanatory Variables](../11-general/missing-explanatory-variables.md): naming limits clarifies intent.
- [range(len()) Iteration](../14-python/range-len-iteration.md): index-based iteration in Python invites off-by-one errors.

## Automatic detection

- **All languages**: property-based testing (Hypothesis in Python, FsCheck in .NET, fast-check in TypeScript, native fuzzing with `go test -fuzz` in Go) generates boundary cases automatically.
- **Mutation testing** (mutmut, Stryker.NET, StrykerJS, gremlins for Go) mutates `<` into `<=` and `+1` into `-1`, revealing untested boundaries.
- **Static analysis**: SonarQube detects some obvious divisions by zero and out-of-range accesses; Pyright/mypy, C# nullability analysis and TypeScript `strict` mode warn about accessing possibly missing values.

## Implementations

- Python: [`python/code_smells/error_handling/incorrect_boundary_behavior/`](../../../python/code_smells/error_handling/incorrect_boundary_behavior/)
- C#: [`csharp/src/CodeSmells/ErrorHandling/IncorrectBoundaryBehavior/`](../../../csharp/src/CodeSmells/ErrorHandling/IncorrectBoundaryBehavior/)
- React + TS: [`react-ts/src/smells/error_handling/incorrect-boundary-behavior/`](../../../react-ts/src/smells/error_handling/incorrect-boundary-behavior/)
- Go: [`go/smells/error_handling/incorrect-boundary-behavior/`](../../../go/smells/error_handling/incorrect-boundary-behavior/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Hunt, A. and Thomas, D. (2019). *The Pragmatic Programmer* (20th anniversary ed.). Addison-Wesley.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
