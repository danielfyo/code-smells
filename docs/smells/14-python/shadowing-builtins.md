# Shadowing Built-ins

> **ID:** CS107 · **Category:** Python-specific · **Sources:** Pylint W0622

## Definition

Variables, parameters, attributes or functions are given the same names as Python's built-in functions and types:
`list`, `dict`, `id`, `type`, `input`, `filter`, `sum`, `max`, `open`, `format`... Within that scope the built-in is
hidden, and any attempt to use it fails or, worse, does something else.

## Symptoms

- `def find_user(id): ...`, `list = get_orders()`, `type = "premium"`, `sum = 0`.
- `TypeError: 'list' object is not callable` or `'str' object is not callable` far from the assignment.
- Errors that only appear in interactive sessions or notebooks after a particular cell has run.

## Common causes

- Built-in names are natural domain words (`id`, `type`, `filter`, `input`, `hash`).
- Not knowing which names are built-ins (they are not keywords, so the interpreter does not complain).
- Direct translation of data models or database columns.

## Why it is a problem

- **Confusing errors** when the built-in is needed later in the same function or module.
- **Readability**: the reader assumes `list` is the built-in type.
- **Fragility**: an innocent change (adding `list(...)` to the function) breaks the code.
- At module level the problem affects every function in the file and anyone doing `import *`.

## How it works under the hood

Python resolves names following the **LEGB** rule: Local, Enclosing (outer functions), Global (module) and Built-in
(the `builtins` module). Built-ins are the last level, so any local or global assignment with the same name hides
them. Unlike `if`, `class` or `def`, names like `list` or `id` **are not reserved keywords**, so the compiler does
not object. The built-in is still reachable through `import builtins; builtins.list`, but that is a symptom rather
than a solution.

## Example (smelly)

```python
def find_orders(id: int, type: str, orders: list[dict]) -> list[dict]:
    # SMELL: `id`, `type` and then `filter` hide built-ins
    filter = [o for o in orders if o["customer_id"] == id and o["type"] == type]
    return filter


def export(orders: list[dict]) -> str:
    list = sorted(o["code"] for o in orders)      # SMELL: hides the list type
    return ", ".join(list(dict.fromkeys(list)))   # TypeError: 'list' object is not callable
```

## Solution (refactored)

```python
def find_orders(customer_id: int, order_type: str, orders: list[dict]) -> list[dict]:
    # REFACTOR: descriptive names that do not collide with built-ins
    return [o for o in orders if o["customer_id"] == customer_id and o["type"] == order_type]


def export(orders: list[dict]) -> str:
    codes = sorted(o["code"] for o in orders)
    return ", ".join(list(dict.fromkeys(codes)))
```

If a name is unavoidable (for example, a parameter of a public API), PEP 8 suggests a trailing underscore:
`type_`, `id_`.

## Recommended refactorings

- **Rename Variable** to a more specific domain name: `customer_id`, `order_type`, `codes`, `total`.
- **Trailing underscore** (`type_`, `filter_`) when the generic name really is the right one.
- Review field names translated from databases or JSON.

## When it may be acceptable

- Class or instance **attributes** (`self.id`, `order.type`): they do not hide the built-in because they are always
  accessed through the dot. Many ORMs and dataclasses use them naturally.
- Keyword arguments of established public APIs, where renaming would break clients.
- One- or two-line scopes where the built-in is never needed (still better avoided).

## Related smells

- [Mysterious / Uncommunicative Name](../10-names/uncommunicative-name.md)
- [Ambiguous Name](../10-names/ambiguous-name.md)
- [Wildcard Import](wildcard-import.md): another way to overwrite names without noticing.

## Automatic detection

- **Pylint** `W0622` `redefined-builtin`.
- **Ruff / flake8-builtins** `A001` (variable), `A002` (argument), `A003` (class attribute) and, in recent versions,
  `A004`/`A005` for imports and modules that shadow built-ins or standard-library modules.

## Implementations

- Python: [`python/code_smells/python_specific/shadowing_builtins/`](../../../python/code_smells/python_specific/shadowing_builtins/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python docs, *Built-in Functions*: https://docs.python.org/3/library/functions.html
- Python Language Reference, *Resolution of names*:
  https://docs.python.org/3/reference/executionmodel.html#resolution-of-names
- PEP 8, *Descriptive: Naming Styles* (trailing `_` to avoid conflicts):
  https://peps.python.org/pep-0008/#descriptive-naming-styles
- Python docs, `builtins`: https://docs.python.org/3/library/builtins.html
