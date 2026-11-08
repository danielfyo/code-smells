# Mutable Default Argument

> **ID:** CS093 · **Category:** Python-specific · **Sources:** Little Book of Python Anti-Patterns

## Definition

A function declares a mutable object (`[]`, `{}`, `set()`, a class instance...) as the default value of a
parameter. Because Python evaluates default values **only once**, every call that omits that argument shares the
same object, and any mutation "leaks" from one call into the next.

## Symptoms

- Signatures such as `def add_item(item, cart=[])` or `def register(user, cache={})`.
- The function body mutates the parameter (`append`, `update`, item assignment...).
- Bugs that only show up on the second call or later, and disappear when the process restarts.
- Tests that pass in isolation but fail when run together.

## Common causes

- Assuming Python behaves like languages where the default is created on every call.
- Wanting to avoid the `if x is None: x = []` boilerplate.
- Using the default value as a deliberate but undocumented "cache".

## Why it is a problem

- **Hidden shared state**: data from one call (an order, a user) appears in another.
- **Information leaks** between requests in long-running web servers.
- **Non-deterministic failures** that depend on execution order and are very hard to debug.
- The effect is invisible at the call site: the error surfaces far from its cause.

## How it works under the hood

The `def` statement is executable: when the interpreter runs it, it creates the function object and, at that
moment, evaluates the default expressions and stores them in `func.__defaults__` (or `__kwdefaults__`). On each
call without the argument, the parameter is bound to **the same object** stored there. With immutable objects
(`0`, `""`, `None`, tuples) nobody notices, because they are never modified; with mutable objects, each mutation is
stored inside the function itself. You can observe it by inspecting `add_item.__defaults__` after a few calls.

## Example (smelly)

```python
def add_item(item: str, cart: list[str] = []) -> list[str]:
    # SMELL: the list is created only once, when the function is defined
    cart.append(item)
    return cart


first = add_item("keyboard")   # ['keyboard']
second = add_item("mouse")     # ['keyboard', 'mouse']  <- the previous cart!
```

## Solution (refactored)

```python
def add_item(item: str, cart: list[str] | None = None) -> list[str]:
    # REFACTOR: None sentinel and a fresh object on every call
    if cart is None:
        cart = []
    cart.append(item)
    return cart


# Alternative that does not mutate its input: return a new collection
def with_item(item: str, cart: tuple[str, ...] = ()) -> tuple[str, ...]:
    return (*cart, item)
```

If `None` is a legitimate value, use a private sentinel: `_MISSING = object()` and `if cart is _MISSING:`.

## Recommended refactorings

- **Replace the default with a sentinel** (`None` or `object()`) and create the object inside the function.
- **Use an immutable default** (`()`, `frozenset()`) when the value is only read.
- **Separate query from modifier**: return a new collection instead of mutating the argument.
- In dataclasses, use `field(default_factory=list)` (the library itself rejects `list` as a default).

## When it may be acceptable

- Intentional memoization (`def fib(n, _cache={})`) in small scripts, as long as it is documented; even then,
  `functools.lru_cache` or `functools.cache` is the idiomatic choice.
- Mutable defaults that the function **never** modifies or returns (risky: a future change can break it).

## Related smells

- [Mutable Data](../06-data/mutable-data.md)
- [Global Data](../05-couplers/global-data.md): the default value acts as a disguised global.
- [Side Effects](../07-functions/side-effects.md)
- [Late-Binding Closures](late-binding-closures.md): another surprise about *when* things are evaluated.

## Automatic detection

- **Pylint** `W0102` `dangerous-default-value`.
- **Ruff / flake8-bugbear** `B006` (`mutable-argument-default`) and `B008` (function calls in argument defaults,
  which are also evaluated only once).
- **Ruff** `RUF009` for function calls in dataclass field defaults.

## Implementations

- Python: [`python/code_smells/python_specific/mutable_default_argument/`](../../../python/code_smells/python_specific/mutable_default_argument/)

Python-specific smell: there is no C#, React + TS or Go implementation.

## References

- Python FAQ, "Why are default values shared between objects?":
  https://docs.python.org/3/faq/programming.html#why-are-default-values-shared-between-objects
- Python Language Reference, *Function definitions*:
  https://docs.python.org/3/reference/compound_stmts.html#function-definitions
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
- The Hitchhiker's Guide to Python, *Common Gotchas*: https://docs.python-guide.org/writing/gotchas/
