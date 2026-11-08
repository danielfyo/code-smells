# Using `is` for Value Comparison

> **ID:** CS096 · **Category:** Python-specific · **Sources:** Python docs

## Definition

The identity operator `is` (are they the **same object**?) is used to compare values, when the right tool is the
equality operator `==` (do they have the **same value**?). The code appears to work when tested with small numbers
or short strings thanks to CPython internal optimizations, and fails with other values.

## Symptoms

- `if quantity is 1:`, `if status is "paid":` or `if total is 0.0:`.
- `SyntaxWarning: "is" with a literal. Did you mean "=="?` when the module runs (Python 3.8+).
- Comparisons that work in the REPL but fail with data read from a file, the network or a database.
- The reverse case: `x == None` or `flag == True` where `is` is idiomatic.

## Common causes

- Reading `is` as the English "is equal to".
- Having seen `is None` and generalizing it to any value.
- Manual tests with small values that happen to return `True`.

## Why it is a problem

- **Intermittent failures**: `x is 256` may be true while `x is 257` is false for the same code.
- **Dependence on implementation details**: behaviour changes between CPython, PyPy or versions.
- Subtle business bugs: a `"paid"` status parsed from JSON is not the same object as the literal in the code.

## How it works under the hood

`a is b` compares `id(a) == id(b)`; `a == b` calls `a.__eq__(b)`. CPython **caches small integers** (-5 to 256)
and **interns** some strings (literals that look like identifiers, attribute names), so two expressions with those
values often yield the same object. An integer computed outside that range, or a string built at runtime
(`"pa" + suffix`, `input()`, `json.loads`), creates new objects and `is` returns `False`. `is` is only correct for
**singletons**: `None`, `True`/`False` (when you want exactly the boolean), `NotImplemented`, `Ellipsis`, `Enum`
members, or custom sentinels (`object()`).

## Example (smelly)

```python
def can_ship(order: dict) -> bool:
    # SMELL: compares identities; the "paid" from JSON is a different object
    if order["status"] is "paid" and order["items"] is not 0:
        return True
    return False


big_order = {"status": "".join(["pa", "id"]), "items": 1000}
can_ship(big_order)  # False, even though the order is paid
```

## Solution (refactored)

```python
from enum import Enum


class Status(Enum):
    PENDING = "pending"
    PAID = "paid"


def can_ship(status: Status, items: int) -> bool:
    # REFACTOR: == for values; `is` only for singletons such as Enum members
    return status is Status.PAID and items != 0


can_ship(Status("paid"), 1000)  # True
```

## Recommended refactorings

- **Use `==` / `!=`** for numbers, strings, collections and domain objects.
- **Reserve `is` for singletons**: `if value is None`, `Enum` members, sentinels.
- **Replace Primitive with Enum**: replace magic status strings with an `Enum`, which also makes `is` legitimate.

## When it may be acceptable

- Comparing with `None`, with sentinels created with `object()` or with `Enum` members.
- Explicitly checking that two references point to the same object (cycle detection, identity caches), knowing
  that this is what you want.

## Related smells

- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md)
- [Primitive Obsession](../01-bloaters/primitive-obsession.md)
- [Type Checking with type()](type-checking-with-type.md)
- [Be Precise / Imprecision](../11-general/imprecision.md)

## Automatic detection

- **CPython** emits a `SyntaxWarning` when compiling `is` / `is not` against a literal (since 3.8).
- **Pyflakes / Ruff** `F632` (`is-literal`).
- **Pylint** `R0123` `literal-comparison`.
- Reverse case: **pycodestyle / Ruff** `E711` (comparison to `None` with `==`) and `E712` (to `True`/`False`);
  **Pylint** `C0121` `singleton-comparison`.

## Implementations

- Python: [`python/code_smells/python_specific/identity_vs_equality/`](../../../python/code_smells/python_specific/identity_vs_equality/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python Language Reference, *Comparisons*: https://docs.python.org/3/reference/expressions.html#comparisons
- PEP 8, *Programming Recommendations* (comparisons to singletons):
  https://peps.python.org/pep-0008/#programming-recommendations
- Python docs, *What's New In Python 3.8* (SyntaxWarning for `is` with literals):
  https://docs.python.org/3/whatsnew/3.8.html
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
