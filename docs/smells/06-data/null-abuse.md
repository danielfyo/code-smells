# Null Check / Null Abuse

> **ID:** CS035 · **Category:** Data Dealers · **Sources:** Jerzyk 2023; Hoare
>
> Returning and checking for null everywhere instead of using null objects, optionals or explicit errors.

## Definition

**Null abuse** means using `null`/`None`/`nil`/`undefined` as a catch-all answer ("not found", "error",
"no value yet", "default value") and filling the code with defensive checks. Tony Hoare, who introduced
the null reference in ALGOL W in 1965, called it his "billion-dollar mistake".

Jerzyk and Madeyski's catalog includes the *Null Check* smell: every null check is a question that the
design could have answered with a more expressive type (optionals, null objects, explicit errors or
empty collections).

## Symptoms

- `if x is not None` / `x != null` checks repeated at many levels.
- Functions that return `null` to signal different errors.
- Collections that can be `null` instead of empty.
- `NullReferenceException`, `TypeError: cannot read properties of undefined` or nil pointer panics.
- Frequent use of suppression operators (`!` in TS/C#).

## Common causes

- Languages and libraries where `null` is the default value of references.
- Not distinguishing between "legitimate absence" and "error".
- Disabling or not using the compiler's nullability analysis.

## Why it is a problem

- Runtime errors far from where the null originated.
- Defensive code that obscures the main logic.
- The meaning of null stays implicit and varies between functions.

## Example (smelly)

```python
def find_customer(customer_id):
    row = db.get(customer_id)
    if row is None:
        return None
    return Customer(**row)

def discount_for(customer_id):
    customer = find_customer(customer_id)
    if customer is None:
        return 0
    if customer.loyalty is None:
        return 0
    if customer.loyalty.tier is None:
        return 0
    return customer.loyalty.tier.discount
```

## Solution (refactored)

```python
class NoLoyalty:
    """REFACTOR: Introduce Special Case (Null Object)."""
    discount = 0

class Customer:
    def __init__(self, name, loyalty=None):
        self.name = name
        self.loyalty = loyalty or NoLoyalty()

def find_customer(customer_id) -> Customer:
    row = db.get(customer_id)
    if row is None:
        raise CustomerNotFound(customer_id)
    return Customer(**row)

def discount_for(customer: Customer) -> int:
    return customer.loyalty.discount
```

The absence of a loyalty program is modeled with a null object and the absence of the customer with an explicit error; the chained checks disappear.

## Recommended refactorings

- **Introduce Special Case**: replaces null with an object that has default behavior (*Null Object*; formerly *Introduce Null Object*).
- **Replace Error Code with Exception**: when null signals an error.
- **Introduce Assertion**: documents and checks that a value cannot be null.
- **Replace Primitive with Object**: use explicit optional types (`Optional`, `T | None`, `T?`) checked by the compiler.

## When it may be acceptable

- Legitimate absence typed explicitly (`T | None` in Python with mypy, `T?` with nullability enabled in C#, `T | undefined` with `strictNullChecks`), checked in a single place.
- In Go, the `value, ok` or `value, err` pattern is idiomatic and is not abuse.
- Boundaries with external APIs that return nulls, as long as they are converted on entry.

## Related smells

- [Message Chains (Train Wreck)](../05-couplers/message-chains.md) — long chains multiply null checks.
- [Returning Error Codes](../08-error-handling/error-codes.md) — returning `null` as an error code.
- [Temporary Field](../02-oo-abusers/temporary-field.md) — fields that are null most of the time.
- [Null-Forgiving Operator Abuse](../15-csharp/null-forgiving-abuse.md) — C# variant with the `!` operator.
- [Non-null Assertion Abuse](../16-react-ts/non-null-assertion.md) — TypeScript variant.
- [Typed nil in Interface](../17-go/typed-nil-interface.md) — the Go pitfall of typed `nil` values in interfaces.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | mypy/pyright in strict mode (explicit `Optional`, `strict_optional`); Ruff `RET` rules for inconsistent returns; Pylint `R1710 inconsistent-return-statements`. |
| C# | `<Nullable>enable</Nullable>` with warnings `CS8600`-`CS8604` and `CS8618` treated as errors; SonarQube `S2259` (null dereference). |
| React + TS | `strictNullChecks`; `@typescript-eslint/no-non-null-assertion`, `@typescript-eslint/no-unnecessary-condition`, `@typescript-eslint/prefer-optional-chain`. |
| Go | golangci-lint `nilnil` (returning `nil, nil`), `nilerr`; `nilaway` (a standalone tool from Uber for `nil` dereferences); staticcheck `SA5011`. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/data/null_abuse/`](../../../python/code_smells/data/null_abuse/) |
| C# | [`csharp/src/CodeSmells/Data/NullAbuse/`](../../../csharp/src/CodeSmells/Data/NullAbuse/) |
| React + TS | [`react-ts/src/smells/data/null-abuse/`](../../../react-ts/src/smells/data/null-abuse/) |
| Go | [`go/smells/data/null-abuse/`](../../../go/smells/data/null-abuse/) |
| Angular | [`angular/src/smells/data/null-abuse/`](../../../angular/src/smells/data/null-abuse/) |

## References

- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Hoare, C. A. R. (2009). "Null References: The Billion Dollar Mistake". Talk at QCon London.
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
