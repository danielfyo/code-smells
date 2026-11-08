# global Statement

> **ID:** CS103 · **Category:** Python-specific · **Sources:** Pylint W0603

## Definition

Functions use `global name` to reassign variables defined at module level. Program state ends up living in shared
variables that any function can change, instead of flowing through parameters, return values or objects with clear
responsibilities.

## Symptoms

- `global counter`, `global current_user`, `global _cache` at the top of functions.
- Functions with no parameters and no return value whose effect is to modify the module.
- Tests that must "reset" module variables between cases, or that fail depending on order.
- Functions whose result depends on earlier calls to other functions.

## Common causes

- Scripts that grew into applications without being redesigned.
- Avoiding passing parameters through several layers.
- Hand-rolled caches, counters or global configuration.

## Why it is a problem

- **Hidden coupling**: the function signature does not reveal that it reads or writes external state.
- **Fragile, interdependent tests**: state leaks from one test into another.
- **Race conditions** in threaded programs (web servers, workers).
- **No local reasoning**: to understand one function you need to know the whole module.

## How it works under the hood

In Python, **assigning** to a name inside a function makes it a local variable of that function (decided when the
body is compiled). That is why, without `global`, `counter += 1` raises `UnboundLocalError`. The declaration
`global counter` tells the compiler to resolve that name in the module namespace (`module.__dict__`), allowing it
to be rebound. Reading a global does not require `global`; mutating a global object (`CACHE[key] = value`) does not
either, although the design problem is the same. `nonlocal` is the equivalent for enclosing scopes of nested
functions.

## Example (smelly)

```python
_next_invoice_number = 1
_issued: list[str] = []


def issue_invoice(customer: str) -> str:
    global _next_invoice_number          # SMELL: module state modified in place
    number = f"INV-{_next_invoice_number:05d}"
    _next_invoice_number += 1
    _issued.append(f"{number} {customer}")
    return number


def reset() -> None:                     # SMELL: tests need this
    global _next_invoice_number, _issued
    _next_invoice_number, _issued = 1, []
```

## Solution (refactored)

```python
from dataclasses import dataclass, field


@dataclass
class InvoiceRegistry:
    # REFACTOR: state lives in an explicit object that is injected
    next_number: int = 1
    issued: list[str] = field(default_factory=list)

    def issue(self, customer: str) -> str:
        number = f"INV-{self.next_number:05d}"
        self.next_number += 1
        self.issued.append(f"{number} {customer}")
        return number


registry = InvoiceRegistry()   # each test creates its own, no reset needed
```

## Recommended refactorings

- **Encapsulate the state in a class** and pass the instance to whoever needs it (dependency injection).
- **Pass parameters and return results** instead of communicating through module variables.
- **Pure functions** when state is not essential.
- For caches, `functools.lru_cache` / `functools.cache`; for configuration, an immutable object loaded at startup;
  for per-request context, `contextvars.ContextVar`.

## When it may be acceptable

- Small, single-use scripts.
- Lazy initialization of a well-encapsulated module singleton (for example, a client created on first call),
  protected with a lock if threads are involved.
- Module constants (read, never reassigned) do not need `global` at all.

## Related smells

- [Global Data](../05-couplers/global-data.md)
- [Mutable Data](../06-data/mutable-data.md)
- [Static Mutable State (C#)](../15-csharp/static-mutable-state.md)
- [Mutable Package-level State (Go)](../17-go/package-level-state.md)
- [Interdependent Tests / Shared Fixture](../12-tests/interdependent-tests.md)

## Automatic detection

- **Pylint** `W0603` `global-statement`, `W0602` `global-variable-not-assigned` and `W0604` `global-at-module-level`.
- **Ruff** `PLW0603` (`global-statement`) and `PLW0602`.

## Implementations

- Python: [`python/code_smells/python_specific/global_statement/`](../../../python/code_smells/python_specific/global_statement/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python Language Reference, *The global statement*:
  https://docs.python.org/3/reference/simple_stmts.html#the-global-statement
- Python FAQ, "What are the rules for local and global variables in Python?":
  https://docs.python.org/3/faq/programming.html#what-are-the-rules-for-local-and-global-variables-in-python
- Python docs, `contextvars`: https://docs.python.org/3/library/contextvars.html
- Pylint, *Messages overview*: https://pylint.readthedocs.io/en/stable/user_guide/messages/messages_overview.html
