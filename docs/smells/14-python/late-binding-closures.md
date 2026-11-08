# Late-Binding Closures

> **ID:** CS097 · **Category:** Python-specific · **Sources:** Python Guide

## Definition

Functions (lambdas or nested functions) are created inside a loop and use the loop variable. Each function is
expected to "remember" the value of its iteration, but they all capture **the variable**, not its value, and when
they run they all see the last value it took.

## Symptoms

- `handlers = [lambda: notify(user) for user in users]` and every notification goes to the last user.
- Callbacks registered in a loop (buttons, events, scheduled jobs) that all act on the same item.
- Discount functions or validators generated in a loop that always return the same result.

## Common causes

- Assuming the closure copies the value when it is created.
- Dynamically generating callbacks or strategies from a configuration list.
- Translating code from languages with different capture semantics.

## Why it is a problem

- **Silent bug**: no error or warning; the wrong data is simply used.
- Hard to spot in code review: the code looks correct at a glance.
- In business code it may apply the wrong price, discount or recipient.

## How it works under the hood

Python resolves a function's free names **when the function runs**, not when it is defined. When a nested function
uses a variable from an enclosing scope, the compiler creates a *cell* shared between the outer scope and the
closure (visible in `func.__closure__`). A `for` loop reassigns the same variable on every iteration — it does not
create a new one — so every closure points at the same cell and, when called after the loop, reads its final
value. Comprehensions have their own scope, but inside it the variable is still a single one for the whole loop,
so the problem remains.

## Example (smelly)

```python
TIERS = {"bronze": 0.05, "silver": 0.10, "gold": 0.20}


def build_discounts() -> dict[str, callable]:
    discounts = {}
    for tier, rate in TIERS.items():
        # SMELL: the lambda captures the variable `rate`, not its current value
        discounts[tier] = lambda price: price * (1 - rate)
    return discounts


build_discounts()["bronze"](100)  # 80.0 instead of 95.0
```

## Solution (refactored)

```python
from collections.abc import Callable
from functools import partial


def _apply_rate(price: float, rate: float) -> float:
    return price * (1 - rate)


def build_discounts() -> dict[str, Callable[[float], float]]:
    # REFACTOR: partial binds the value when each function is created
    return {tier: partial(_apply_rate, rate=rate) for tier, rate in TIERS.items()}


build_discounts()["bronze"](100)  # 95.0
```

A compact (less explicit) alternative: `lambda price, rate=rate: price * (1 - rate)`, which relies on default
values being evaluated at definition time.

## Recommended refactorings

- **`functools.partial`** to bind arguments explicitly.
- **Factory function**: `def make_discount(rate): return lambda price: price * (1 - rate)`; each call creates a new
  scope with its own cell.
- **Default argument** as a capture trick (document it, since it exposes an extra parameter).
- **Replace Function with Object**: a small class or `dataclass` with `__call__` if the strategy grows.

## When it may be acceptable

- When you really want to read the *current* value of the variable at call time (for example, a closure that
  reads a counter that keeps changing). Make it clear through naming or a comment.

## Related smells

- [Stale Closure / Missing Dependencies (React + TS)](../16-react-ts/stale-closure.md)
- [Loop Variable Capture (Go)](../17-go/loop-variable-capture.md)
- [Mutable Default Argument](mutable-default-argument.md)
- [Obscured Intent / Clever Code](../11-general/obscured-intent.md)

## Automatic detection

- **flake8-bugbear / Ruff** `B023` (`function-uses-loop-variable`).
- **Pylint** `W0640` `cell-var-from-loop`.

## Implementations

- Python: [`python/code_smells/python_specific/late_binding_closures/`](../../../python/code_smells/python_specific/late_binding_closures/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- The Hitchhiker's Guide to Python, *Common Gotchas — Late Binding Closures*:
  https://docs.python-guide.org/writing/gotchas/
- Python FAQ, "Why do lambdas defined in a loop with different values all return the same result?":
  https://docs.python.org/3/faq/programming.html#why-do-lambdas-defined-in-a-loop-with-different-values-all-return-the-same-result
- Python docs, `functools.partial`: https://docs.python.org/3/library/functools.html#functools.partial
- Python Language Reference, *Resolution of names*:
  https://docs.python.org/3/reference/executionmodel.html#resolution-of-names
