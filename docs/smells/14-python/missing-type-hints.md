# Missing Type Hints / Any Abuse

> **ID:** CS112 · **Category:** Python-specific · **Sources:** PEP 484

## Definition

Functions, methods and classes in a module's public API have no type annotations, or have them but full of `Any`,
unparameterized `dict` or `object`. The code works, but type checkers (mypy, Pyright) cannot verify it, the IDE
cannot help, and readers do not know the contract without reading the implementation.

## Symptoms

- `def calculate(order, rules, opts=None):` with no hint about what those objects are.
- `def process(data: Any) -> Any` or `-> dict` on public functions.
- Docstrings describing types in free text ("order: dict with keys ...").
- `# type: ignore` comments scattered around to silence errors.
- Editor autocompletion offers nothing useful for the returned value.

## Common causes

- Code that predates annotations or was migrated from Python 2.
- A perception that annotations are "bureaucracy" in a dynamic language.
- Using `Any` as a quick way out of a hard-to-express type.

## Why it is a problem

- **Runtime errors** that static analysis would have found (unexpected `None`, missing fields, arguments in the
  wrong order).
- **`Any` is contagious**: it disables checking for everything it touches and spreads to callers.
- **Riskier refactoring**: there is no safety net when a signature changes.
- **Lost implicit documentation**: the signature is the best description of the contract.

## How it works under the hood

Annotations (PEP 484, PEP 526) **are not checked at runtime**: the interpreter stores them in `__annotations__` and
otherwise ignores them. Their value lies in external tools: mypy, Pyright or Pyre analyse the code and verify type
consistency. `typing.Any` is compatible with everything in both directions, so any operation on an `Any` is
accepted unchecked. `object`, by contrast, only allows what every object has, forcing narrowing with `isinstance`.
Unannotated functions are treated by mypy, by default, as if all parameters and the return were `Any`, and their
bodies are not even checked. Tools like `Protocol`, `TypedDict`, `TypeVar`, generics and `Literal` can express
almost any contract without resorting to `Any`.

## Example (smelly)

```python
from typing import Any


def apply_discount(order, code, rules: Any = None):
    # SMELL: what is order? rules? what is returned?
    rules = rules or {}
    rate = rules.get(code, 0)
    return {**order, "total": order["total"] * (1 - rate)}


def load_rules(path) -> Any:   # SMELL: Any propagates to every caller
    ...
```

## Solution (refactored)

```python
from collections.abc import Mapping
from dataclasses import dataclass, replace
from decimal import Decimal


@dataclass(frozen=True)
class Order:
    id: int
    total: Decimal


# REFACTOR: complete signatures; Mapping documents that rules are only read
def apply_discount(order: Order, code: str, rules: Mapping[str, Decimal]) -> Order:
    rate = rules.get(code, Decimal("0"))
    return replace(order, total=order.total * (1 - rate))


def load_rules(path: str) -> dict[str, Decimal]: ...
```

## Recommended refactorings

- **Annotate the public API first** (exported functions, public methods) and work inwards.
- **Replace `Any`** with concrete types, `object`, `Protocol`, `TypedDict`, generics (`TypeVar`) or unions.
- **Introduce domain types** (`dataclass`, `NewType`) instead of `dict` and primitives.
- **Enable the type checker in CI** incrementally (`--disallow-untyped-defs` per module).
- Use `reveal_type()` and `--warn-return-any` to discover where `Any` sneaks in.

## When it may be acceptable

- Throwaway scripts, notebooks and prototypes.
- Boundaries with truly dynamic data (arbitrary JSON), ideally encapsulated and converted to types early.
- Interop with untyped libraries, isolating the `Any` in a thin layer (or using stubs).
- Trivial internal code where the type checker's inference is already enough (local variables).

## Related smells

- [any Abuse (React + TS)](../16-react-ts/any-type.md)
- [Empty Interface Abuse (Go)](../17-go/empty-interface-abuse.md)
- [Stringly-typed Dicts instead of Classes](dict-as-object.md)
- [Primitive Obsession](../01-bloaters/primitive-obsession.md)

## Automatic detection

- **mypy**: `--strict`, `--disallow-untyped-defs`, `--disallow-any-explicit`, `--disallow-any-generics`,
  `--warn-return-any`.
- **Pyright / Pylance** in `strict` mode (`reportUnknownParameterType`, `reportMissingParameterType`...).
- **Ruff / flake8-annotations** `ANN001` (missing argument annotation), `ANN201` (missing return annotation on a
  public function) and `ANN401` (`Any` used for arguments or return).

## Implementations

- Python: [`python/code_smells/python_specific/missing_type_hints/`](../../../python/code_smells/python_specific/missing_type_hints/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- PEP 484, *Type Hints*: https://peps.python.org/pep-0484/
- Python docs, `typing`: https://docs.python.org/3/library/typing.html
- mypy documentation: https://mypy.readthedocs.io/en/stable/
- Typing documentation (*Static Typing with Python*): https://typing.readthedocs.io/en/latest/
