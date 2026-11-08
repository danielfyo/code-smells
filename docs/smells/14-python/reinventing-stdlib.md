# Reinventing the Standard Library

> **ID:** CS106 · **Category:** Python-specific · **Sources:** Python community

## Definition

Utilities that Python already provides as built-in functions or in the standard library are reimplemented by hand:
counters with dictionaries, grouping, path manipulation with strings, list flattening, maximum search, dates... The
result is more code, more bugs and less readability than the standard, well-tested version that every Python
developer already knows.

## Symptoms

- `if key in counts: counts[key] += 1 else: counts[key] = 1` (→ `collections.Counter` / `defaultdict`).
- `path + "/" + name` or `path.split("/")[-1]` (→ `pathlib.Path`).
- Loops with a flag to find whether any item matches a condition (→ `any` / `all`).
- Home-made `flatten`, `chunks`, `unique_preserving_order` helpers (→ `itertools`, `dict.fromkeys`).
- Manual sorting or minimum search with loops (→ `sorted`, `min(key=...)`, `heapq`).

## Common causes

- Not knowing how broad the standard library is ("batteries included").
- Habits from languages with smaller libraries.
- Old code written before `pathlib`, `dataclasses` or `itertools.pairwise` existed.

## Why it is a problem

- **More bugs**: edge cases (empty lists, Windows path separators, ties) that the stdlib already handles.
- **More code to maintain and test**.
- **Worse readability**: `Counter(words).most_common(3)` is understood instantly; a ten-line loop is not.
- **Performance**: many stdlib functions are implemented in C.

## How it works under the hood

Python ships built-in functions (`sum`, `any`, `all`, `min`, `max`, `sorted`, `enumerate`, `zip`) that work on any
iterable and accept `key` functions. Modules such as `collections` (`Counter`, `defaultdict`, `deque`, `ChainMap`),
`itertools` (`groupby`, `chain`, `batched` in 3.12, `pairwise` in 3.10), `functools` (`cache`, `reduce`,
`partial`), `pathlib`, `statistics`, `bisect` and `heapq` cover most common needs. Many are lazy (iterators) and
written in C in CPython, making them faster and more memory-efficient than an equivalent pure-Python loop.

## Example (smelly)

```python
import os


def top_customers(orders: list[tuple[str, float]], n: int) -> list[str]:
    totals = {}
    for customer, amount in orders:          # SMELL: defaultdict/Counter by hand
        if customer in totals:
            totals[customer] += amount
        else:
            totals[customer] = amount
    ranked = sorted(totals.items(), key=lambda kv: kv[1], reverse=True)
    return [customer for customer, _ in ranked[:n]]


def report_path(base: str, customer: str) -> str:
    return base + os.sep + "reports" + os.sep + customer + ".csv"   # SMELL
```

## Solution (refactored)

```python
from collections import Counter
from pathlib import Path


def top_customers(orders: list[tuple[str, float]], n: int) -> list[str]:
    # REFACTOR: Counter sums per key and ranks with most_common
    totals: Counter[str] = Counter()
    for customer, amount in orders:
        totals[customer] += amount
    return [customer for customer, _ in totals.most_common(n)]


def report_path(base: Path, customer: str) -> Path:
    return base / "reports" / f"{customer}.csv"     # REFACTOR: pathlib
```

## Recommended refactorings

- **Substitute Algorithm**: replace the home-made implementation with the equivalent standard function.
- **Introduce `pathlib`** for any path manipulation.
- **`collections`** for counting, grouping and queues; **`itertools`** for combining iterables.
- **Built-ins with `key=`** instead of search loops.
- Periodically review each Python release's "What's New".

## When it may be acceptable

- The standard version does not meet a real requirement (precision, measured performance, different semantics).
- Teaching purposes (implementing an algorithm to learn it), outside production code.
- The function does not exist in the minimum supported Python version (with a comment and a plan).

## Related smells

- [Duplicate Code](../04-dispensables/duplicate-code.md)
- [Loops / Imperative Loops](../06-data/loops.md)
- [Oddball Solution](../11-general/oddball-solution.md)
- [range(len()) Iteration](range-len-iteration.md)

## Automatic detection

- **Ruff** `SIM110` / `SIM111` (loops that reimplement `any` / `all`), `PTH` rules from flake8-use-pathlib (e.g.
  `PTH118` for `os.path.join`), `FURB` rules (refurb) that suggest modern alternatives, and `UP` (pyupgrade) for
  newer syntax and APIs.
- **Pylint** `R1714` `consider-using-in`, `R1728` `consider-using-generator` and other `consider-using-*` checks.

## Implementations

- Python: [`python/code_smells/python_specific/reinventing_stdlib/`](../../../python/code_smells/python_specific/reinventing_stdlib/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python docs, *Built-in Functions*: https://docs.python.org/3/library/functions.html
- Python docs, `collections`: https://docs.python.org/3/library/collections.html
- Python docs, `itertools`: https://docs.python.org/3/library/itertools.html
- Python docs, `pathlib`: https://docs.python.org/3/library/pathlib.html
- Ruff, *Rules*: https://docs.astral.sh/ruff/rules/
