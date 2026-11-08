# Inconsistent Return Statements

> **ID:** CS109 · **Category:** Python-specific · **Sources:** PEP 8; Pylint R1710

## Definition

A function returns a value on some branches (`return total`) while on others it ends without `return`, or with a
bare `return`, **implicitly** returning `None`. The caller sometimes gets a number and sometimes `None`, and neither
the signature nor the code makes it clear.

## Symptoms

- An `if` with `return value` and no `else` and no final `return`.
- `TypeError: unsupported operand type(s) for +: 'NoneType' and 'float'` in the caller.
- A mix of `return` and `return value` in the same function.
- Return annotations that lie (`-> float` when `None` is possible).

## Common causes

- Forgetting a case (the implicit "else").
- Using `None` to signal "not found" or "error" without making it explicit.
- Functions that grew by adding branches without reviewing every exit.

## Why it is a problem

- **Errors far from their cause**: the `None` travels until something tries to use it.
- **Ambiguous contract**: it is unclear whether returning `None` is intentional or an oversight.
- **Weaker static analysis**: the type checker infers `float | None` and forces checks everywhere, or detects
  nothing at all if the function is unannotated.

## How it works under the hood

In Python every function returns something: if execution reaches the end of the body or hits a `return` with no
expression, the returned value is `None`. There is no compile-time error for "not all code paths return a value" as
in C# or Java. PEP 8 asks for consistency: if any branch returns an expression, all of them should, and where there
is no value, `return None` should be written explicitly, with an explicit `return` at the end of the function if it
is reachable.

## Example (smelly)

```python
def shipping_cost(country: str, weight_kg: float):
    if country == "ES":
        return 4.95 if weight_kg <= 2 else 7.95
    elif country in {"FR", "PT", "IT"}:
        return 9.95
    # SMELL: every other country implicitly returns None


def checkout_total(subtotal: float, country: str, weight: float) -> float:
    return subtotal + shipping_cost(country, weight)   # TypeError for "US"
```

## Solution (refactored)

```python
class UnsupportedDestination(ValueError):
    pass


def shipping_cost(country: str, weight_kg: float) -> float:
    # REFACTOR: every path returns a float or raises an explicit exception
    if country == "ES":
        return 4.95 if weight_kg <= 2 else 7.95
    if country in {"FR", "PT", "IT"}:
        return 9.95
    raise UnsupportedDestination(f"We do not ship to {country}")
```

If "no cost" is a legitimate result, declare `-> float | None` and write `return None` explicitly, so that both the
caller and the type checker know.

## Recommended refactorings

- **Make the default case explicit**: `return None`, a default value or an exception.
- **Replace Error Code with Exception** when `None` meant "error".
- **Annotate the return type** (`-> float` or `-> float | None`) so mypy/Pyright can verify it.
- **Introduce Special Case / Null Object** if many callers handle `None` the same way.

## When it may be acceptable

- Functions that **never** return a value (procedures): all bare `return`s are consistent.
- Functions that explicitly return `Optional` and write `return None` on each branch that needs it.

## Related smells

- [Null Check / Null Abuse](../06-data/null-abuse.md)
- [Returning Error Codes](../08-error-handling/error-codes.md)
- [Obvious Behavior Is Unimplemented](../11-general/obvious-behavior-unimplemented.md)
- [Naked Returns in Long Functions (Go)](../17-go/naked-returns.md)
- [Missing Type Hints / Any Abuse](missing-type-hints.md)

## Automatic detection

- **Pylint** `R1710` `inconsistent-return-statements`.
- **Ruff / flake8-return** `RET501` (unnecessary `return None` in a function that returns nothing), `RET502`
  (bare `return` in a function that returns values) and `RET503` (missing explicit `return` at the end).
- **mypy** reports `Missing return statement` when the return annotation does not allow `None`.

## Implementations

- Python: [`python/code_smells/python_specific/inconsistent_return/`](../../../python/code_smells/python_specific/inconsistent_return/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- PEP 8, *Programming Recommendations* ("Be consistent in return statements"):
  https://peps.python.org/pep-0008/#programming-recommendations
- Python Language Reference, *The return statement*:
  https://docs.python.org/3/reference/simple_stmts.html#the-return-statement
- Pylint, *Messages overview*: https://pylint.readthedocs.io/en/stable/user_guide/messages/messages_overview.html
- Ruff, *Rules*: https://docs.astral.sh/ruff/rules/
