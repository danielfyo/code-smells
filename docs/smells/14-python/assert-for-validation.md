# assert for Data Validation

> **ID:** CS108 · **Category:** Python-specific · **Sources:** Bandit B101

## Definition

The `assert` statement is used to validate input data, permissions or business rules in production code:
`assert amount > 0`, `assert user.is_admin`. Assertions are a debugging aid that **disappears** when Python runs
with optimizations (`-O`), so the validation silently stops existing.

## Symptoms

- `assert` at the start of public functions that receive data from users, APIs or files.
- Authorization checks with `assert` (`assert request.user.has_perm(...)`).
- Clients receiving `AssertionError` instead of a domain error with a useful message.
- `assert (cond, "message")` with parentheses: a non-empty tuple, therefore **always** true.

## Common causes

- It is the shortest way to express a precondition.
- Habit from tests (pytest uses `assert` for everything).
- Not knowing that `-O` and `PYTHONOPTIMIZE` strip assertions.

## Why it is a problem

- **Validations that evaporate** in environments running with `-O` (some images and packagers).
- **Security risk**: an access check written with `assert` can be skipped entirely.
- **Unhelpful errors**: `AssertionError` does not say what failed and cannot be handled specifically.
- Mixes two concepts: the programmer's internal invariants and validation of external data.

## How it works under the hood

`assert expr, msg` is equivalent to `if __debug__: if not expr: raise AssertionError(msg)`. The constant
`__debug__` is normally `True`, but it is `False` when the interpreter is started with `-O` (or `PYTHONOPTIMIZE` is
set), and in that case the compiler **emits no bytecode** for the statement: the condition is not even evaluated.
Also, because `assert` is a statement and not a function, `assert (x > 0, "msg")` evaluates a two-element tuple,
which is always truthy; CPython emits a `SyntaxWarning` for that case.

## Example (smelly)

```python
def refund(order: dict, amount: float, user: dict) -> float:
    # SMELL: with `python -O` none of these lines exist
    assert user["role"] == "admin", "Admins only"
    assert amount > 0
    assert amount <= order["paid"], "Cannot refund more than was paid"
    order["paid"] -= amount
    return order["paid"]
```

## Solution (refactored)

```python
class RefundError(ValueError):
    """Domain error for invalid refunds."""


class PermissionDenied(Exception):
    pass


def refund(order: dict, amount: float, user: dict) -> float:
    # REFACTOR: explicit validations that always run
    if user["role"] != "admin":
        raise PermissionDenied("Only admins can issue refunds")
    if amount <= 0:
        raise RefundError(f"Invalid amount: {amount}")
    if amount > order["paid"]:
        raise RefundError("Cannot refund more than was paid")
    order["paid"] -= amount
    return order["paid"]
```

## Recommended refactorings

- **Replace Assertion with Exception**: `if not cond: raise ValueError(...)` (or a domain exception).
- **Introduce domain exceptions** that callers can catch specifically.
- **Validate at the boundary** with validation libraries (Pydantic, `attrs` validators) or with types that make
  invalid states unrepresentable.
- Keep `assert` only for **internal invariants** that can never fail if the code is correct.

## When it may be acceptable

- **Tests**: pytest is built on `assert` and rewrites assertions to give detailed messages.
- **Internal invariants** and sanity checks (for example after a complex algorithm) that document assumptions and
  can be disabled without changing correct behaviour.
- Type-narrowing hints for the type checker (`assert isinstance(x, Foo)`), knowing they do not run under `-O`.

## Related smells

- [Overridden Safeties](../08-error-handling/overridden-safeties.md)
- [Incorrect Behavior at the Boundaries](../08-error-handling/incorrect-boundary-behavior.md)
- [Returning Error Codes](../08-error-handling/error-codes.md)
- [Bare except](bare-except.md)

## Automatic detection

- **Bandit** `B101` (`assert_used`).
- **Ruff** `S101` (flake8-bandit rule), usually disabled for test directories.
- **Pyflakes / Ruff** `F631` (`assert-tuple`): `assert` on a tuple, always true; **Pylint** `W0199`
  `assert-on-tuple`.

## Implementations

- Python: [`python/code_smells/python_specific/assert_for_validation/`](../../../python/code_smells/python_specific/assert_for_validation/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python Language Reference, *The assert statement*:
  https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement
- Python docs, *Command line and environment* (`-O`): https://docs.python.org/3/using/cmdline.html#cmdoption-O
- Bandit, *B101: assert_used*: https://bandit.readthedocs.io/en/latest/plugins/b101_assert_used.html
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
