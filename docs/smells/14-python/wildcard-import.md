# Wildcard Import

> **ID:** CS095 · **Category:** Python-specific · **Sources:** PEP 8

## Definition

Using `from module import *` to pull every public name of a module into the current namespace. The information
about **where each name comes from** is lost, existing names can be overwritten without warning, and static
analysis tools can no longer reason about the code.

## Symptoms

- Lines like `from pricing import *` or `from tkinter import *` in production modules.
- Names used in the file that are neither defined nor explicitly imported.
- A name changes meaning depending on the order of imports.
- The IDE cannot resolve "Go to definition" or flags variables as possibly undefined.

## Common causes

- Convenience while prototyping, or interactive sessions that end up pasted into a module.
- Library tutorials (GUI, data science) that use it for brevity.
- "Constants" or "utils" modules that get imported wholesale out of habit.

## Why it is a problem

- **Silent collisions**: if two modules export `calculate_total`, the last one imported wins.
- **Readability**: the reader cannot tell whether `round_price` is local, from `pricing` or from `utils`.
- **Fragile coupling**: adding a public name to the source module can break the modules that import it.
- **Degraded static analysis**: linters and type checkers cannot detect undefined names or unused imports.

## How it works under the hood

`from m import *` binds in the current namespace every name listed in `m.__all__`; if the module does not define
`__all__`, it imports every name that does not start with an underscore, **including names the module itself
imported** (for example `os` or `Decimal`). The bindings happen at import time and overwrite any previous name with
the same identifier. Since Python 3 this form is only allowed at module level, not inside functions.

## Example (smelly)

```python
# invoices.py
from decimal import *          # SMELL: brings Decimal, Context, ROUND_*... and much more
from pricing import *          # SMELL: what does pricing define? does it shadow decimal?
from tax_rules import *


def invoice_total(lines: list[tuple[str, int]]) -> Decimal:
    subtotal = sum(unit_price(sku) * qty for sku, qty in lines)
    return apply_tax(subtotal).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

## Solution (refactored)

```python
# invoices.py
from decimal import ROUND_HALF_UP, Decimal

from pricing import unit_price          # REFACTOR: explicit imports
from tax_rules import apply_tax


def invoice_total(lines: list[tuple[str, int]]) -> Decimal:
    subtotal = sum(unit_price(sku) * qty for sku, qty in lines)
    return apply_tax(subtotal).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

If many names are needed from one module, `import pricing` and `pricing.unit_price` is also clear.

## Recommended refactorings

- **Replace the wildcard with explicit imports** (tools such as Ruff can help list them).
- **Import the module** and qualify names (`import numpy as np`).
- In re-exporting modules (packages), **define `__all__`** to declare the public API.

## When it may be acceptable

- An `__init__.py` that deliberately re-exports the API of submodules that define `__all__`.
- Interactive sessions (REPL, exploratory notebooks).
- PEP 8 allows it to republish an internal interface as part of a public API.

## Related smells

- [Shadowing Built-ins](shadowing-builtins.md): a wildcard can overwrite `open`, `sum` or `round`.
- [Artificial Coupling](../05-couplers/artificial-coupling.md)
- [Logical Dependency Not Made Physical](../11-general/hidden-logical-dependency.md)
- [Import-time Side Effects](import-time-side-effects.md)

## Automatic detection

- **Pyflakes / Ruff** `F403` (`from module import *` used) and `F405` (name may be undefined or defined from a
  star import).
- **Pylint** `W0401` `wildcard-import` and `W0614` `unused-wildcard-import`.

## Implementations

- Python: [`python/code_smells/python_specific/wildcard_import/`](../../../python/code_smells/python_specific/wildcard_import/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- PEP 8, *Imports*: https://peps.python.org/pep-0008/#imports
- Python Language Reference, *The import statement*:
  https://docs.python.org/3/reference/simple_stmts.html#the-import-statement
- Python Tutorial, *Importing \* From a Package*:
  https://docs.python.org/3/tutorial/modules.html#importing-from-a-package
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
