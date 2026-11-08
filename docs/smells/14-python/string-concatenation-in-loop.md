# String Concatenation in Loop

> **ID:** CS102 · **Category:** Python-specific · **Sources:** Python docs

## Definition

A long string is built by accumulating fragments with `s += fragment` (or `s = s + fragment`) inside a loop.
Because Python strings are immutable, each concatenation may create a new object and copy everything accumulated
so far, giving a potentially **quadratic** cost and code that is less expressive than `str.join`.

## Symptoms

- `report = ""` followed by a `for` loop with `report += ...`.
- Separators added by hand and then trimmed (`report[:-2]`) to drop the trailing comma.
- CSV, HTML or text report generation that slows down with thousands of lines.

## Common causes

- It is the most direct way to express it and works fine with a few items.
- Not knowing `str.join`, `io.StringIO` or f-strings.
- Code that started with a couple of lines and grew to process whole files.

## Why it is a problem

- **Unpredictable performance**: may be O(n²) in time and memory depending on the interpreter and context.
- **Readability**: separator and formatting logic is mixed with iteration.
- **Edge-case bugs**: missing or extra separators at the start or end.

## How it works under the hood

`str` is immutable: `a + b` allocates a new string of length `len(a) + len(b)` and copies both. In a loop of n
iterations, 1 + 2 + ... + n fragments are copied, i.e. O(n²) characters. CPython includes an optimization that,
when the left-hand string has **a single reference**, tries to grow it in place; that is why the loop sometimes
looks fast. But it does not happen in other implementations (PyPy) or when another reference exists (for example
`self.report += ...` or the string being stored in a list), and PEP 8 explicitly says not to rely on it.
`"".join(iterable)` first computes the total length and copies each fragment exactly once: O(n). The documentation
of sequence types warns about the quadratic cost of concatenating immutable sequences.

## Example (smelly)

```python
def orders_to_csv(orders: list[tuple[int, str, float]]) -> str:
    csv = "id,customer,total\n"
    for order_id, customer, total in orders:
        # SMELL: each += may copy everything accumulated so far
        csv += str(order_id) + "," + customer + "," + str(round(total, 2)) + "\n"
    return csv


def tags_label(tags: list[str]) -> str:
    label = ""
    for tag in tags:
        label += tag + ", "
    return label[:-2]   # SMELL: patch for the trailing separator
```

## Solution (refactored)

```python
def orders_to_csv(orders: list[tuple[int, str, float]]) -> str:
    # REFACTOR: join + f-strings: a single copy and readable formatting
    rows = (f"{order_id},{customer},{total:.2f}" for order_id, customer, total in orders)
    return "\n".join(["id,customer,total", *rows]) + "\n"


def tags_label(tags: list[str]) -> str:
    return ", ".join(tags)
```

For real CSV, the `csv` module (with `io.StringIO` as the target) also handles escaping of commas and quotes.

## Recommended refactorings

- **`str.join`** over a list or a generator expression.
- **f-strings** for formatting each fragment.
- **`io.StringIO`** when the string is built in many different places or incrementally.
- **Use the right module** (`csv`, `json`, templates) instead of formatting by hand.

## When it may be acceptable

- Loops with a small, bounded number of iterations where clarity does not suffer.
- Concatenating two or three strings outside a loop: `a + b` is perfectly readable.

## Related smells

- [String Concatenation in Loops (C#)](../15-csharp/string-concat-in-loop.md)
- [Loops / Imperative Loops](../06-data/loops.md)
- [Reinventing the Standard Library](reinventing-stdlib.md)
- [range(len()) Iteration](range-len-iteration.md)

## Automatic detection

Pylint and Ruff have no standard rule specifically for string `+=` in loops. It is detected with profilers
(`cProfile`, `timeit`), in code review or with custom Semgrep rules. Ruff `PERF401` (`manual-list-comprehension`)
detects the analogous pattern of building lists with `append` in a loop.

## Implementations

- Python: [`python/code_smells/python_specific/string_concatenation_in_loop/`](../../../python/code_smells/python_specific/string_concatenation_in_loop/)

Python-specific smell: there is no implementation in the other languages of the repository.

## References

- Python docs, *Common Sequence Operations* (note on concatenating immutable sequences):
  https://docs.python.org/3/library/stdtypes.html#common-sequence-operations
- Python docs, `str.join`: https://docs.python.org/3/library/stdtypes.html#str.join
- PEP 8, *Programming Recommendations* (do not rely on CPython's in-place `+=` optimization):
  https://peps.python.org/pep-0008/#programming-recommendations
- Python docs, `io.StringIO`: https://docs.python.org/3/library/io.html#io.StringIO
