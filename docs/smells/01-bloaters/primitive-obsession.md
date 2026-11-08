# Primitive Obsession

> **ID:** CS004 · **Category:** Bloaters · **Sources:** Fowler 1999
>
> Using primitive types (string, int) for domain concepts such as money, emails or ranges instead of dedicated types.

## Definition

**Primitive obsession** means representing domain concepts (money, emails, postal codes, date ranges,
identifiers) with primitive types (`string`, `int`, `float`) or generic structures (dictionaries, tuples)
instead of creating small dedicated types.

A primitive cannot validate itself, has no domain operations and cannot be told apart from another
primitive of the same type: a `string` holding an email is interchangeable with one holding a name, and a
`float` in euros can happily be added to one in dollars.

## Symptoms

- The same format validation (email regex, IBAN length) repeated in several places.
- Money represented as `float`/`double`, with the currency in a separate variable.
- `int` or `string` constants that simulate enumerations (`status = 2`, `role = "admin"`).
- Dictionaries or tuples used as if they were objects (`order["customer"]["zip"]`).
- Loose helper functions operating on a primitive (`format_phone(s)`, `is_valid_vat_id(s)`).

## Common causes

- Creating a new type seems excessive for "just a string".
- Data arrives as primitives from the database, JSON or forms.
- Unfamiliarity with value objects and branded types.

## Why it is a problem

- Validation is duplicated or, worse, forgotten at some entry point.
- Type errors the compiler cannot catch (swapping `customerId` and `orderId`).
- Rounding errors when using floating point for money.
- The concept's logic is scattered throughout the code.

## Example (smelly)

```python
def apply_discount(price: float, currency: str, percent: float) -> float:
    if currency not in ("EUR", "USD"):
        raise ValueError("currency")
    return price - price * percent / 100

def register(email: str) -> None:
    if "@" not in email:
        raise ValueError("email")
    ...
```

## Solution (refactored)

```python
from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class Money:
    amount: Decimal
    currency: str

    def __post_init__(self):
        if self.currency not in ("EUR", "USD"):
            raise ValueError("currency")

    def discounted(self, percent: Decimal) -> "Money":
        return Money(self.amount * (1 - percent / 100), self.currency)

@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self):
        if "@" not in self.value:
            raise ValueError("email")
```

Validation lives in one place and it is impossible to build an invalid `Money` or `Email`.

## Recommended refactorings

- **Replace Primitive with Object**: creates a value type with its validation and operations (formerly *Replace Data Value with Object*).
- **Replace Type Code with Subclasses**: when the primitive encodes variants with different behavior.
- **Replace Conditional with Polymorphism**: removes the `switch` statements on the type code.
- **Introduce Parameter Object**: if several primitives together form a concept (a date range).

## When it may be acceptable

- At the system boundaries (serialization, API DTOs, database columns), as long as values are converted to the domain type on entry.
- Small scripts or throwaway code.
- Performance-critical paths where the cost of wrapping is measurable (in Go or C# this can be mitigated with defined types or `readonly struct`).

## Related smells

- [Data Clumps](data-clumps.md) — several primitives traveling together are usually a value object waiting to be discovered.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md) — primitive type codes usually appear as magic literals.
- [Switch Statements / Repeated Switches](../02-oo-abusers/switch-statements.md) — `switch` statements on primitive type codes.
- [Long Parameter List](long-parameter-list.md) — long lists of primitives.
- [Stringly Typed Code](../16-react-ts/stringly-typed.md) — TypeScript variant: using `string` where a union of literals belongs.
- [Stringly-typed Dicts instead of Classes](../14-python/dict-as-object.md) — Python variant: dictionaries used as objects.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No direct rule; mypy/pyright with `NewType` and `Literal` help, as does Ruff `PLR2004` (magic values in comparisons) for type codes. |
| C# | SonarQube `S109` (magic numbers) and `S1192` (duplicated string literals) as hints; review signatures with many `string`/`decimal` parameters. |
| React + TS | `@typescript-eslint/no-magic-numbers`; use literal unions and branded types; `sonarjs/no-duplicate-string`. |
| Go | golangci-lint `goconst` (repeated strings) and `mnd` (magic numbers); use defined types (`type Email string`). |

This is a design smell: tools only detect indirect symptoms. Code review remains the best tool.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/bloaters/primitive_obsession/`](../../../python/code_smells/bloaters/primitive_obsession/) |
| C# | [`csharp/src/CodeSmells/Bloaters/PrimitiveObsession/`](../../../csharp/src/CodeSmells/Bloaters/PrimitiveObsession/) |
| React + TS | [`react-ts/src/smells/bloaters/primitive-obsession/`](../../../react-ts/src/smells/bloaters/primitive-obsession/) |
| Go | [`go/smells/bloaters/primitive-obsession/`](../../../go/smells/bloaters/primitive-obsession/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *ValueObject* (bliki): https://martinfowler.com/bliki/ValueObject.html
- Refactoring.Guru — Primitive Obsession: https://refactoring.guru/smells/primitive-obsession
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
