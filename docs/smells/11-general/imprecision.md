# Be Precise / Imprecision

> **ID:** CS075 · **Category:** General · **Sources:** Clean Code G26

*Using float for money, ignoring concurrency or assuming a query returns exactly one result.*

## Definition

Decisions made out of laziness or assumption rather than precision: using `float` for money, assuming a query
returns exactly one result, ignoring concurrency, not checking for `null`, rounding without a policy. *Clean
Code* (G26, *Be Precise*) asks for every decision in the code to be deliberate: if you call a function that
may return `null`, check it; if concurrent updates are possible, lock.

## Symptoms

- Monetary amounts in `float`/`double`/`number` with results such as `0.30000000000000004`.
- `results[0]` or `.First()` without checking that there is exactly one result.
- Equality comparisons between floating-point numbers.
- Reads and writes of shared state without synchronization ("they almost never collide").
- Dates without a time zone or rounding without a defined mode.

## Common causes

- Thinking only about the usual case.
- Unfamiliarity with the binary representation of floating-point numbers.
- Hurrying to finish.

## Why it is a problem

- **Cent-level errors** that accumulate in invoices and reports that do not add up.
- **Race conditions** that are intermittent and hard to reproduce.
- Production exceptions when the assumption does not hold (zero or several results).

## Example (smelly)

```python
def invoice_total(lines: list[Line]) -> float:
    # SMELL: float for money and implicit rounding
    return sum(line.price * line.qty * 1.21 for line in lines)


def find_customer(email: str) -> Customer:
    # SMELL: assumes there is always exactly one result
    return db.query(Customer).filter_by(email=email).all()[0]
```

## Solution (refactored)

```python
VAT = Decimal("0.21")


def invoice_total(lines: list[Line]) -> Decimal:
    # REFACTOR: Decimal and explicit rounding to the cent
    net = sum((line.price * line.qty for line in lines), Decimal("0"))
    return (net * (1 + VAT)).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)


def find_customer(email: str) -> Customer:
    # REFACTOR: one() fails explicitly if there are 0 or more than 1 results
    return db.query(Customer).filter_by(email=email).one()
```

## Recommended refactorings

- **Replace Primitive with Object**: a `Money` type backed by `Decimal`/`decimal` or integer cents.
- **Introduce Assertion**, or use APIs that express cardinality (`one()`, `Single()`, `SingleOrDefault()`).
- **Introduce Special Case** for missing results.
- Protect shared state with synchronization primitives, or design it to be immutable.

## When it may be acceptable

- Scientific or graphics calculations where `float` is the right representation and comparisons use a tolerance.
- Prototypes and exploratory analysis where precision is not critical.

## Related smells

- [Primitive Obsession](../01-bloaters/primitive-obsession.md): money as `float`.
- [Incorrect Behavior at the Boundaries](../08-error-handling/incorrect-boundary-behavior.md): assumptions about boundaries.
- [Null Check / Null Abuse](../06-data/null-abuse.md): not checking for missing values.
- [Logical Dependency Not Made Physical](hidden-logical-dependency.md): assuming instead of asking.
- [Concurrent Map Access without Sync](../17-go/unsynchronized-map.md): ignored concurrency in Go.

## Automatic detection

- **Python**: linters do not detect money in `float`, but typing amounts as `Decimal` and checking with mypy prevents mixing; use `pytest.approx` for float comparisons.
- **C#**: SonarQube `S1244` (floating-point equality); nullability analysis (`CS8602`, `CS8604`).
- **TypeScript**: SonarQube and `strictNullChecks`/`noUncheckedIndexedAccess` (index accesses that may be `undefined`).
- **Go**: `go test -race` (race detector) and `go vet`; `gosec` and `staticcheck` flag some imprecise uses.

## Implementations

- Python: [`python/code_smells/general/imprecision/`](../../../python/code_smells/general/imprecision/)
- C#: [`csharp/src/CodeSmells/General/Imprecision/`](../../../csharp/src/CodeSmells/General/Imprecision/)
- React + TS: [`react-ts/src/smells/general/imprecision/`](../../../react-ts/src/smells/general/imprecision/)
- Go: [`go/smells/general/imprecision/`](../../../go/smells/general/imprecision/)
- Angular: [`angular/src/smells/general/imprecision/`](../../../angular/src/smells/general/imprecision/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
