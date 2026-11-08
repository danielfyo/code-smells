# Switch Statements / Repeated Switches

> **ID:** CS006 · **Category:** Object-Orientation Abusers · **Sources:** Fowler 1999/2018; Clean Code G23
>
> The same switch or if/else chain on a type is repeated in several places; every new type forces you to touch all of them.

## Definition

The **repeated switches** smell appears when the same `switch` (or `if/elif/else` chain) on a type code is
repeated in several places in the program. In the first edition of *Refactoring* the smell was simply
called *Switch Statements*; in the second edition Fowler refined it to *Repeated Switches*, because a
single, well-placed `switch` is not a problem: the **duplication** of the same decision is.

Every time a variant is added (a new customer type, a new payment method), every `switch` that decides
on it must be found and modified. *Clean Code* (G23) recommends preferring polymorphism to `if/else`
and `switch/case`.

## Symptoms

- The same `switch (type)` or `if kind == ...` appears in two or more functions.
- Adding a new variant requires searching the whole project for the type code.
- `default` branches that throw "unsupported type".
- Enumerations or strings that act as a type tag and are queried from outside.

## Common causes

- Modeling variants with a `type` field instead of with types.
- Adding new behavior as "another function with another switch" because it is quickest.
- Tagged data (JSON with a `kind` field) processed without converting it into types.

## Why it is a problem

- It violates the open/closed principle: extending means modifying many places.
- It is easy to forget one `switch` when adding a variant and produce a runtime error.
- The logic for each variant is scattered instead of grouped.

## Example (smelly)

```python
def shipping_cost(order):
    if order.shipping == "standard":
        return 4.99
    elif order.shipping == "express":
        return 9.99
    elif order.shipping == "pickup":
        return 0.0
    raise ValueError(order.shipping)

def delivery_days(order):
    if order.shipping == "standard":
        return 5
    elif order.shipping == "express":
        return 1
    elif order.shipping == "pickup":
        return 0
    raise ValueError(order.shipping)
```

## Solution (refactored)

```python
from abc import ABC, abstractmethod

class Shipping(ABC):
    @abstractmethod
    def cost(self) -> float: ...
    @abstractmethod
    def delivery_days(self) -> int: ...

class Standard(Shipping):
    def cost(self): return 4.99
    def delivery_days(self): return 5

class Express(Shipping):
    def cost(self): return 9.99
    def delivery_days(self): return 1

class Pickup(Shipping):
    def cost(self): return 0.0
    def delivery_days(self): return 0
```

Adding a new shipping method now means creating a class; no existing `switch` changes. In languages with discriminated unions (TypeScript) or exhaustive pattern matching (C#), a single compiler-checked `switch` is also a valid solution.

## Recommended refactorings

- **Replace Conditional with Polymorphism**: each branch becomes a method of a subclass or implementation.
- **Replace Type Code with Subclasses**: a preliminary step: turns the tag into types.
- **Introduce Special Case**: for the "no value" or "unknown" branch (*Null Object*).
- **Replace Conditional Logic with Strategy**: from Kerievsky, when the variation is an interchangeable algorithm.

## When it may be acceptable

- A single `switch` in a factory that translates external data into polymorphic objects.
- Exhaustive, compiler-checked `switch` statements (discriminated unions with `never`, C# switch expressions with exhaustiveness analysis).
- Closed, stable sets of variants where adding operations is more frequent than adding types (the classic "expression problem").

## Related smells

- [Primitive Obsession](../01-bloaters/primitive-obsession.md) — primitive type codes feed the `switch` statements.
- [Shotgun Surgery](../03-change-preventers/shotgun-surgery.md) — adding a variant forces you to touch every `switch`.
- [Duplicate Code](../04-dispensables/duplicate-code.md) — a repeated `switch` is structural duplication.
- [Combinatorial Explosion](../03-change-preventers/combinatorial-explosion.md) — when the variants combine with each other.
- [Type Checking with type()](../14-python/type-checking-with-type.md) — Python variant: deciding by `type(x)`.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0912 too-many-branches`, `R0911 too-many-return-statements`; Ruff `PLR0912`, `PLR0911`. |
| C# | SonarQube `S1479` (`switch` with too many cases) and `S3776`; `IDE0010`/`IDE0072` (add missing cases) help keep switches exhaustive. |
| React + TS | `@typescript-eslint/switch-exhaustiveness-check` for unions; ESLint `complexity`. |
| Go | golangci-lint `exhaustive` (exhaustiveness of `switch` over enums), `gocyclo`; gocritic `ifElseChain`. |

No tool directly detects that two `switch` statements decide on the same thing; grepping for the type code is surprisingly effective.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/oo_abusers/switch_statements/`](../../../python/code_smells/oo_abusers/switch_statements/) |
| C# | [`csharp/src/CodeSmells/OoAbusers/SwitchStatements/`](../../../csharp/src/CodeSmells/OoAbusers/SwitchStatements/) |
| React + TS | [`react-ts/src/smells/oo_abusers/switch-statements/`](../../../react-ts/src/smells/oo_abusers/switch-statements/) |
| Go | [`go/smells/oo_abusers/switch-statements/`](../../../go/smells/oo_abusers/switch-statements/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Refactoring.Guru — Switch Statements: https://refactoring.guru/smells/switch-statements
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
