# Stringly-typed Dicts instead of Classes

> **ID:** CS105 · **Category:** Python-specific · **Sources:** Python community

## Definition

Domain entities (orders, users, invoices) travel through the program as dictionaries with "magic" string keys
(`order["customer_email"]`) instead of named types such as `dataclass`, `NamedTuple` or `TypedDict`. The data
structure exists only in the head of whoever wrote the code.

## Symptoms

- Functions that take `data: dict` and access many literal keys.
- `KeyError` in production because of a misspelled (`"totl"`) or missing key.
- `.get("x", default)` repeated everywhere "just in case".
- Docs or comments describing which keys the dictionary must contain.
- No autocompletion in the IDE and no errors from the type checker.

## Common causes

- Data arrives as JSON and is passed as-is through every layer.
- Quick prototypes that were never formalized.
- A perception that defining a class is "too much ceremony" in Python.

## Why it is a problem

- **Runtime errors** that a type would have caught during static analysis.
- **No home for behaviour**: order logic is scattered across loose functions.
- **Risky refactoring**: renaming a key means searching for strings across the codebase.
- **Implicit contracts**: it is unclear which keys are required and what their types are.

## How it works under the hood

A `dict` accepts any hashable key and any value; the interpreter cannot know which keys "should" exist.
`@dataclass` generates `__init__`, `__repr__` and `__eq__` from class annotations (with optional `frozen=True`,
`slots=True` or `kw_only=True`). `typing.NamedTuple` creates an immutable tuple with named fields.
`typing.TypedDict` (PEP 589) creates no new runtime class — it is still a `dict` — but it lets mypy or Pyright check
keys and value types, which makes it ideal for JSON at the boundaries. For runtime validation of external data,
libraries such as Pydantic or `attrs` with validators are used.

## Example (smelly)

```python
def order_total(order: dict) -> float:
    # SMELL: magic keys; nothing stops you writing "quantiy" or forgetting "discount"
    subtotal = sum(line["price"] * line["quantity"] for line in order["lines"])
    discount = order.get("discount", 0)
    return round(subtotal * (1 - discount), 2)


order_total({
    "customer": "ana@example.com",
    "lines": [{"sku": "KB-01", "price": 49.9, "quantity": 2}],
    "discount": 0.1,
})
```

## Solution (refactored)

```python
from dataclasses import dataclass, field
from decimal import Decimal


@dataclass(frozen=True)
class OrderLine:
    sku: str
    price: Decimal
    quantity: int


@dataclass(frozen=True)
class Order:
    customer: str
    lines: list[OrderLine] = field(default_factory=list)
    discount: Decimal = Decimal("0")

    def total(self) -> Decimal:
        # REFACTOR: a named type, with behaviour next to the data
        subtotal = sum((line.price * line.quantity for line in self.lines), Decimal("0"))
        return (subtotal * (1 - self.discount)).quantize(Decimal("0.01"))
```

## Recommended refactorings

- **Replace Record with Data Class**: introduce `dataclass` / `NamedTuple` for entities.
- **`TypedDict`** when the value must remain a `dict` (JSON responses, kwargs).
- **Parse at the boundary**: convert JSON into typed objects as it enters the system (Pydantic, `attrs`,
  `from_dict` functions) and work with types inside.
- **Move Function**: move the logic that operates on the dict into methods of the new type.

## When it may be acceptable

- Truly dynamic data (arbitrary user-defined keys, metadata, per-key counters).
- Very thin boundary code that just forwards JSON without interpreting it.
- Short-lived exploratory or data-analysis scripts.

## Related smells

- [Primitive Obsession](../01-bloaters/primitive-obsession.md)
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md)
- [Stringly Typed Code (React + TS)](../16-react-ts/stringly-typed.md)
- [Data Clumps](../01-bloaters/data-clumps.md)
- [Missing Type Hints / Any Abuse](missing-type-hints.md)

## Automatic detection

No linter rule says "use a class instead of a dict". Type checkers in strict mode help (mypy `--strict`, Pyright
`strict`), since they force `dict[str, Any]` annotations and make the `Any` visible (Ruff `ANN401` flags it), as
does code review looking for repeated literal-key access.

## Implementations

- Python: [`python/code_smells/python_specific/dict_as_object/`](../../../python/code_smells/python_specific/dict_as_object/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python docs, `dataclasses`: https://docs.python.org/3/library/dataclasses.html
- Python docs, `typing.TypedDict`: https://docs.python.org/3/library/typing.html#typing.TypedDict
- Python docs, `typing.NamedTuple`: https://docs.python.org/3/library/typing.html#typing.NamedTuple
- PEP 557, *Data Classes*: https://peps.python.org/pep-0557/
- PEP 589, *TypedDict*: https://peps.python.org/pep-0589/
