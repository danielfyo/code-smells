# Overly Complex Comprehension

> **ID:** CS110 · **Category:** Python-specific · **Sources:** Google Python Style Guide

## Definition

A list, dict or set comprehension (or a generator expression) piles up several `for` clauses, several `if`
filters, nested conditional expressions and calls with side effects into a single expression. What should be an
obvious transformation becomes a puzzle that has to be read several times.

## Symptoms

- Two or more `for` clauses combined with `if` filters.
- `a if c else b` expressions nested inside the result expression.
- Comprehensions spanning several lines with hard-to-follow indentation.
- The walrus operator (`:=`) used to reuse computations inside the comprehension.
- Comprehensions used only for their side effects (`[print(x) for x in items]`).

## Common causes

- A belief that comprehensions are always "more Pythonic".
- Premature optimization: thinking one line is faster than a loop.
- Adding conditions one at a time to a comprehension that started out simple.

## Why it is a problem

- **Readability**: the reading order of nested `for` clauses is not intuitive.
- **Hard debugging**: you cannot set breakpoints or add `print` calls between steps.
- **Hidden bugs**: an `if` in the wrong position silently changes from a filter into a conditional expression.
- Error messages and tracebacks point at one huge line.

## How it works under the hood

In a comprehension, `for` and `if` clauses are evaluated **left to right, like nested loops**:
`[f(x, y) for x in a if p(x) for y in b(x)]` is equivalent to an outer `for x` with an `if`, containing an inner
`for y`. A trailing `if` is a **filter**; an `a if c else b` at the front is a **conditional expression** that does
not filter. Since Python 3 each comprehension has its own scope (the iteration variable does not leak), and since
3.12 (PEP 709) comprehensions are *inlined* instead of creating a separate function, but their cost is essentially
that of the equivalent loop: the performance gain does not justify sacrificing clarity.

## Example (smelly)

```python
def pending_alerts(warehouses: list[dict]) -> list[str]:
    # SMELL: three levels, filters and nested conditionals in one expression
    return [
        f"{w['name']}:{p['sku']}:{'URGENT' if p['stock'] == 0 else 'low' if p['stock'] < p['min'] else 'ok'}"
        for w in warehouses if w["active"]
        for p in w["products"] if not p.get("discontinued")
        if p["stock"] < p["min"] or (p["stock"] == 0 and w["region"] in ("EU", "UK"))
    ]
```

## Solution (refactored)

```python
def stock_level(product: dict) -> str:
    if product["stock"] == 0:
        return "URGENT"
    return "low" if product["stock"] < product["min"] else "ok"


def needs_alert(product: dict) -> bool:
    return not product.get("discontinued") and product["stock"] < product["min"]


def pending_alerts(warehouses: list[dict]) -> list[str]:
    # REFACTOR: named functions + an explicit loop for the nesting
    alerts = []
    for warehouse in warehouses:
        if not warehouse["active"]:
            continue
        alerts.extend(
            f"{warehouse['name']}:{p['sku']}:{stock_level(p)}"
            for p in warehouse["products"] if needs_alert(p)
        )
    return alerts
```

## Recommended refactorings

- **Extract Function** for conditions and transformations (`needs_alert`, `stock_level`).
- **Replace Comprehension with Loop** when there is more than one `for` or complex conditional logic.
- **Split into steps** with well-named intermediate generators (`active = (w for w in ws if w.active)`).
- Use a plain `for` loop when the goal is side effects.

## When it may be acceptable

- Two very simple `for` clauses to flatten or build an obvious Cartesian product
  (`[cell for row in grid for cell in row]`), although `itertools.chain.from_iterable` may be clearer.
- Single-clause comprehensions with a simple filter: precisely the ideal use case.

## Related smells

- [Obscured Intent / Clever Code](../11-general/obscured-intent.md)
- [Complicated Boolean Expression](../07-functions/complicated-boolean-expression.md)
- [Deep Nesting / Arrow Code](../07-functions/deep-nesting.md)
- [Missing Explanatory Variables](../11-general/missing-explanatory-variables.md)
- [range(len()) Iteration](range-len-iteration.md): the opposite extreme.

## Automatic detection

No standard Pylint or Ruff rule directly measures comprehension complexity. Complexity metrics help (McCabe, Ruff
`C901`, `radon`), as do line-length limits (`E501`) and stricter linters such as wemake-python-styleguide, which
limit the number of `for` clauses in a comprehension. The `C4` rules (flake8-comprehensions) cover the opposite case:
unnecessary comprehensions.

## Implementations

- Python: [`python/code_smells/python_specific/complex_comprehension/`](../../../python/code_smells/python_specific/complex_comprehension/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Google Python Style Guide, *Comprehensions & Generator Expressions*:
  https://google.github.io/styleguide/pyguide.html#27-comprehensions--generator-expressions
- Python Language Reference, *Displays for lists, sets and dictionaries*:
  https://docs.python.org/3/reference/expressions.html#displays-for-lists-sets-and-dictionaries
- PEP 709, *Inlined comprehensions*: https://peps.python.org/pep-0709/
- PEP 20, *The Zen of Python* ("Flat is better than nested"): https://peps.python.org/pep-0020/
