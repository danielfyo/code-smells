# Monkey Patching in Production Code

> **ID:** CS104 · **Category:** Python-specific · **Sources:** Python community

## Definition

Production code replaces, at runtime, attributes, methods or functions of classes and modules **it does not own**
(standard library, third parties or another team): `requests.get = my_get`, `datetime.datetime.now = ...`,
`Order.total = new_function`. The program's behaviour no longer matches what those modules' source code says.

## Symptoms

- Assignments to attributes of imported modules: `json.dumps = custom_dumps`.
- Modules named `patches.py` or `hacks.py` that "must be imported first".
- Behaviour that changes depending on which module was imported first.
- Bugs that disappear (or reappear) when a dependency is upgraded.

## Common causes

- Quickly fixing a bug or gap in a third-party library.
- Adding methods to foreign classes for convenience.
- Test techniques (`mock.patch`) carried over into production code.

## Why it is a problem

- **Global, surprising behaviour**: the patch affects the whole process, including code that does not expect it.
- **Import-order dependence**: whoever did `from requests import get` before the patch keeps the original function.
- **Fragile across upgrades**: it relies on internals the original author may change.
- **Hard debugging**: the code that runs is not the code you see when jumping to the definition.

## How it works under the hood

Python modules and classes are objects with a mutable `__dict__`, so `setattr(module, "f", g)` or
`SomeClass.method = func` replaces the binding for everyone who accesses it **through the module or class**. A
function assigned to a class becomes a method because functions are descriptors (`__get__` creates the bound
method). However, names already copied with `from module import f` still point to the original object, because the
import bound the function itself, not the module attribute. Built-in types written in C (`str`, `dict`,
`datetime.datetime`) do not allow attribute assignment, which pushes people towards even more convoluted patches.

## Example (smelly)

```python
# billing/patches.py
import decimal

from shop import pricing

_original_price = pricing.Product.final_price


def _final_price_with_rounding(self) -> decimal.Decimal:
    # SMELL: rewrites another module's method at runtime
    return _original_price(self).quantize(decimal.Decimal("0.01"))


pricing.Product.final_price = _final_price_with_rounding   # affects the whole process
```

## Solution (refactored)

```python
# billing/invoicing.py
from decimal import Decimal

from shop.pricing import Product


def billable_price(product: Product) -> Decimal:
    # REFACTOR: new behaviour in a function of our own that wraps the original
    return product.final_price().quantize(Decimal("0.01"))


class BillableProduct(Product):
    # or, if we control object creation, an explicit subclass
    def final_price(self) -> Decimal:
        return super().final_price().quantize(Decimal("0.01"))
```

## Recommended refactorings

- **Wrapper / Adapter**: wrap the foreign object or function behind an interface you own.
- **Subclass** or **composition** when you control how objects are created.
- **Dependency injection**: receive the function or client as a parameter instead of patching the global.
- **Contribute the fix** upstream or pin a fixed version.
- In tests, use `unittest.mock.patch` or pytest's `monkeypatch`, which restore state afterwards.

## When it may be acceptable

- **Tests**: `mock.patch` and `monkeypatch` exist precisely for this and undo the change.
- Instrumentation tools (APM, tracing, `gevent.monkey`) designed and documented to patch, applied once at startup.
- A temporary patch for a critical third-party bug: isolated, documented, and with a test that fails once the fixed
  version is available.

## Related smells

- [Incomplete Library Class](../05-couplers/incomplete-library-class.md)
- [Import-time Side Effects](import-time-side-effects.md)
- [Global Data](../05-couplers/global-data.md)
- [Oddball Solution](../11-general/oddball-solution.md)

## Automatic detection

There is no standard Pylint or Ruff rule. Type checkers help (mypy and Pyright complain when assigning to a method
or to a module attribute with an incompatible type, e.g. `Cannot assign to a method`), as do custom Semgrep rules
that look for assignments to attributes of imported modules outside test code.

## Implementations

- Python: [`python/code_smells/python_specific/monkey_patching/`](../../../python/code_smells/python_specific/monkey_patching/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python docs, `unittest.mock` — *Where to patch*: https://docs.python.org/3/library/unittest.mock.html#where-to-patch
- Python docs, *Descriptor HowTo Guide* (functions and methods): https://docs.python.org/3/howto/descriptor.html
- pytest docs, *How to monkeypatch/mock modules and environments*:
  https://docs.pytest.org/en/stable/how-to/monkeypatch.html
