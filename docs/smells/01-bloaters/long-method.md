# Long Method

> **ID:** CS001 · **Category:** Bloaters · **Sources:** Fowler 1999; Clean Code G30
>
> A function does too many things and spans too many lines; the longer it is, the harder it is to understand, test and reuse.

## Definition

A **long method** is a function that has accumulated so many lines and responsibilities that it can no
longer be understood at a glance. Fowler and Beck observe that the programs that age best are those with
short, well-named functions: whenever you feel the need to write a comment explaining a block, that
block is asking to become a function of its own.

Length itself is not the problem; what usually comes with it is: mixed levels of abstraction, local
variables that live for dozens of lines, and several chained tasks (validate, compute, persist, notify)
inside the same body.

## Symptoms

- The function does not fit on the screen or clearly exceeds 20-30 lines.
- Comments act as section headings ("// compute taxes", "# send email").
- Several local variables are declared at the top and reused across different blocks.
- High cyclomatic or cognitive complexity: many nested `if`, loops and `try` blocks.
- It is hard to name it without using the word "and".
- Tests need a lot of setup to cover a single path.

## Common causes

- Adding functionality "at the end of the method" because it is the fastest option.
- Fear of small functions due to a supposed performance or navigation cost.
- Generated code or code copied from examples without restructuring.
- Lack of tests, which makes extracting parts risky.

## Why it is a problem

- It is hard to understand: the reader must mentally rebuild the steps and the intermediate state.
- The parts are not reusable, so logic ends up duplicated in other methods.
- Tests are big and brittle, and failures are hard to pinpoint.
- Changes cause frequent merge conflicts because everyone touches the same function.

## Example (smelly)

```python
def process_order(order, db, mailer):
    # validate
    if not order.items:
        raise ValueError("empty order")
    for item in order.items:
        if item.qty <= 0:
            raise ValueError("bad qty")
    # compute total
    total = 0
    for item in order.items:
        total += item.price * item.qty
    if order.customer.is_vip:
        total *= 0.9
    total = round(total * 1.21, 2)
    # persist and notify
    db.save(order.id, total)
    mailer.send(order.customer.email, f"Total: {total}")
    return total
```

## Solution (refactored)

```python
def process_order(order, db, mailer):
    validate(order)
    total = compute_total(order)
    db.save(order.id, total)
    mailer.send(order.customer.email, f"Total: {total}")
    return total

def validate(order):
    if not order.items:
        raise ValueError("empty order")
    if any(item.qty <= 0 for item in order.items):
        raise ValueError("bad qty")

def compute_total(order):
    subtotal = sum(item.price * item.qty for item in order.items)
    if order.customer.is_vip:
        subtotal *= VIP_DISCOUNT
    return round(subtotal * (1 + VAT_RATE), 2)
```

Each section comment has become a named function; the main method now reads like a table of contents.

## Recommended refactorings

- **Extract Function**: the main technique: each block with a clear purpose becomes a named function.
- **Replace Temp with Query**: removes local variables that get in the way of extraction.
- **Introduce Parameter Object**: when the extracted functions would need too many arguments.
- **Replace Function with Command**: for methods with so much local state that extraction is impractical (formerly *Replace Method with Method Object*).
- **Decompose Conditional**: turns long conditions and branches into named calls.
- **Split Loop**: separates loops that do two things at once so each can be extracted.

## When it may be acceptable

- Linear, well-commented algorithms (e.g. a state machine or a parser) where splitting would scatter the logic.
- Generated code that is not maintained by hand.
- Long but trivial configuration tables or mappings (one line per case).
- Integration tests with a clear sequential script (a long but readable arrange-act-assert).

## Related smells

- [Large Class / God Class](large-class.md) — long methods usually live in large classes.
- [Mixed Levels of Abstraction](../07-functions/mixed-abstraction-levels.md) — a frequent cause: low-level details mixed with business steps.
- [Deep Nesting / Arrow Code](../07-functions/deep-nesting.md) — long methods tend to nest conditionals and loops.
- [Comments (as deodorant)](../04-dispensables/excessive-comments.md) — section comments are the clearest sign that something should be extracted.
- [Duplicate Code](../04-dispensables/duplicate-code.md) — non-reusable parts end up copied into other methods.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0915 too-many-statements`, `R0912 too-many-branches`, `R0914 too-many-locals`; Ruff `PLR0915`, `PLR0912`, `C901` (McCabe complexity); radon (`radon cc`). |
| C# | SonarQube/SonarLint `S138` (functions with too many lines) and `S3776` (cognitive complexity); analyzer `CA1502` (excessive complexity) and Visual Studio code metrics. |
| React + TS | ESLint `max-lines-per-function`, `max-statements`, `complexity`; `sonarjs/cognitive-complexity`. |
| Go | golangci-lint: `funlen`, `gocyclo`, `gocognit`, `cyclop`; revive `function-length`, `cognitive-complexity`. |

Thresholds are indicative (e.g. 50 lines or cognitive complexity 15): use them as an alarm to trigger a review, not as an absolute rule.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/bloaters/long_method/`](../../../python/code_smells/bloaters/long_method/) |
| C# | [`csharp/src/CodeSmells/Bloaters/LongMethod/`](../../../csharp/src/CodeSmells/Bloaters/LongMethod/) |
| React + TS | [`react-ts/src/smells/bloaters/long-method/`](../../../react-ts/src/smells/bloaters/long-method/) |
| Go | [`go/smells/bloaters/long-method/`](../../../go/smells/bloaters/long-method/) |
| Angular | [`angular/src/smells/bloaters/long-method/`](../../../angular/src/smells/bloaters/long-method/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Long Method: https://refactoring.guru/smells/long-method
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
