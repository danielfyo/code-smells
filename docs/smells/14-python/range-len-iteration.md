# range(len()) Iteration

> **ID:** CS100 · **Category:** Python-specific · **Sources:** PEP 20; Pylint C0200

## Definition

A sequence is traversed by generating indices with `for i in range(len(seq))` and accessing `seq[i]`, instead of
iterating directly over the items or using `enumerate`, `zip`, `reversed` or comprehensions. It is the C-style loop
transplanted into Python.

## Symptoms

- `for i in range(len(orders)): process(orders[i])`.
- Two "parallel" lists walked with the same index: `names[i]`, `prices[i]`.
- Indices used only to read, never for anything else.
- `IndexError` from walking lists of different lengths.

## Common causes

- Habit from languages with indexed loops (C, pre-foreach Java, classic JavaScript).
- Needing the index "just in case" and not knowing about `enumerate`.
- Using parallel lists instead of a structure that groups the data.

## Why it is a problem

- **Less readable**: the reader has to translate `seq[i]` into "the current item".
- **More error-prone**: off-by-one errors, crossed indices between lists, `IndexError`.
- **Less general**: only works with indexable sequences, not generators, sets or files.
- Slightly slower: each `seq[i]` is an extra lookup.

## How it works under the hood

Python's `for` is not a counting loop: it consumes any **iterable** by calling `iter(obj)` and then `next()` until
`StopIteration`. Iterating directly over a list, a `dict`, a file or a generator already yields each item.
`enumerate(it, start=0)` lazily produces `(index, item)` tuples; `zip(a, b, strict=True)` (Python 3.10+) pairs
several iterables and, with `strict`, raises `ValueError` if lengths differ. None of them copy the data: they are
all lazy iterators.

## Example (smelly)

```python
def print_invoice(products: list[str], prices: list[float]) -> list[str]:
    lines = []
    for i in range(len(products)):           # SMELL: manual indices
        lines.append(f"{i + 1}. {products[i]}: {prices[i]:.2f} EUR")
    return lines


def total(prices: list[float]) -> float:
    result = 0.0
    for i in range(len(prices)):             # SMELL: the index serves no purpose
        result += prices[i]
    return result
```

## Solution (refactored)

```python
def print_invoice(products: list[str], prices: list[float]) -> list[str]:
    # REFACTOR: zip pairs, enumerate numbers; strict detects mismatched lists
    return [
        f"{n}. {product}: {price:.2f} EUR"
        for n, (product, price) in enumerate(zip(products, prices, strict=True), start=1)
    ]


def total(prices: list[float]) -> float:
    return sum(prices)                       # REFACTOR: built-in function
```

## Recommended refactorings

- **Iterate directly** over the items when the index is not needed.
- **`enumerate`** when the position is needed.
- **`zip`** to walk several sequences together; better still, **group the data** in a `dataclass`.
- **Built-in functions** (`sum`, `any`, `all`, `max`, `sorted`) and comprehensions instead of accumulators.
- `reversed(seq)` instead of `range(len(seq) - 1, -1, -1)`.

## When it may be acceptable

- The list is modified **by position** (`items[i] = ...`), although `enumerate` is still clearer.
- Algorithms that access neighbours (`seq[i - 1]`, `seq[i + 1]`) or skip positions; even then, consider
  `itertools.pairwise` (Python 3.10+).
- Numerical code where the index has mathematical meaning (matrices), or better, vectorized NumPy.

## Related smells

- [Loops / Imperative Loops](../06-data/loops.md)
- [Data Clumps](../01-bloaters/data-clumps.md): parallel lists are often a data clump.
- [Reinventing the Standard Library](reinventing-stdlib.md)
- [Overly Complex Comprehension](complex-comprehension.md): the opposite excess.

## Automatic detection

- **Pylint** `C0200` `consider-using-enumerate` and `C0206` `consider-using-dict-items`.
- **Ruff** offers related rules such as `SIM113` (`enumerate-for-loop`, use `enumerate` instead of a manual counter)
  and `B905` (`zip` without `strict=`).

## Implementations

- Python: [`python/code_smells/python_specific/range_len_iteration/`](../../../python/code_smells/python_specific/range_len_iteration/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- PEP 20, *The Zen of Python*: https://peps.python.org/pep-0020/
- Python docs, `enumerate`: https://docs.python.org/3/library/functions.html#enumerate
- Python docs, `zip`: https://docs.python.org/3/library/functions.html#zip
- PEP 618, *Add Optional Length-Checking To zip*: https://peps.python.org/pep-0618/
- The Little Book of Python Anti-Patterns: https://docs.quantifiedcode.com/python-anti-patterns/
