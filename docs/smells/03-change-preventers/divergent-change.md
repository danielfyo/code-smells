# Divergent Change

> **ID:** CS012 · **Category:** Change Preventers · **Sources:** Fowler 1999
>
> The same class is modified for many different reasons (it violates the single responsibility principle).

## Definition

**Divergent change** occurs when the same class or module is modified for different, unrelated reasons:
today because the export format changes, tomorrow because a pricing rule changes, and the day after
because the database is migrated. Fowler describes it as "having to change these three methods every
time we get a new database and these four methods every time there is a new financial instrument".

It is how a class with several responsibilities shows up in the change history.

## Symptoms

- The version control history shows commits on very different topics touching the same file.
- Groups of methods that only change together with each other and never with the rest.
- The class imports libraries from different layers (persistence, presentation, networking).
- Different teams edit the same file for different reasons.

## Common causes

- Organizing code by entity ("everything about the customer goes here") instead of by responsibility.
- Incremental growth without reviewing cohesion.
- Architectural layers mixed in the same class.

## Why it is a problem

- Every change risks breaking unrelated functionality.
- Frequent merge conflicts.
- It is impossible to deploy or test one aspect without dragging the others along.

## Example (smelly)

```python
class ProductReport:
    def __init__(self, conn):
        self.conn = conn

    def load(self):             # changes if the database changes
        return self.conn.execute("SELECT name, price FROM products").fetchall()

    def apply_vat(self, rows):  # changes if tax rules change
        return [(n, round(p * 1.21, 2)) for n, p in rows]

    def to_csv(self, rows):     # changes if the output format changes
        return "\n".join(f"{n};{p}" for n, p in rows)
```

## Solution (refactored)

```python
class ProductRepository:
    def __init__(self, conn):
        self.conn = conn
    def all(self):
        return self.conn.execute("SELECT name, price FROM products").fetchall()

class VatCalculator:
    def __init__(self, rate: float):
        self.rate = rate
    def apply(self, rows):
        return [(n, round(p * (1 + self.rate), 2)) for n, p in rows]

class CsvFormatter:
    def format(self, rows):
        return "\n".join(f"{n};{p}" for n, p in rows)
```

Each resulting class has a single reason to change; a database migration no longer touches the tax or formatting code.

## Recommended refactorings

- **Split Phase**: separates processing into sequential stages with an intermediate data structure.
- **Extract Class**: each axis of change becomes its own class.
- **Move Function**: relocates methods to the modules matching their responsibility.
- **Extract Function**: a preliminary step to separate intertwined parts inside one method.

## When it may be acceptable

- Small modules where splitting would add more indirection than clarity.
- Early prototype stages, while the axes of change are still unknown.

## Related smells

- [Shotgun Surgery](shotgun-surgery.md) — its complementary opposite: one reason, many classes.
- [Large Class / God Class](../01-bloaters/large-class.md) — large classes usually suffer from divergent change.
- [Mixed Levels of Abstraction](../07-functions/mixed-abstraction-levels.md) — mixing layers in the same class is a frequent cause.
- [God Component / Large Component](../16-react-ts/god-component.md) — the equivalent for React components.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | History analysis with tools such as `code-maat` or `git log --stat`; Pylint `R0904 too-many-public-methods` as a hint. |
| C# | `CA1506` (excessive class coupling) and NDepend cohesion metrics (LCOM). |
| React + TS | Churn metrics per file (e.g. with `code-maat`); ESLint `max-lines` as a hint. |
| Go | Churn analysis of the history; golangci-lint `maintidx` as a hint of hard-to-maintain modules. |

Divergent change is easier to see in the history than in the code: files with many commits on different topics are clear candidates (hotspot analysis).

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/change_preventers/divergent_change/`](../../../python/code_smells/change_preventers/divergent_change/) |
| C# | [`csharp/src/CodeSmells/ChangePreventers/DivergentChange/`](../../../csharp/src/CodeSmells/ChangePreventers/DivergentChange/) |
| React + TS | [`react-ts/src/smells/change_preventers/divergent-change/`](../../../react-ts/src/smells/change_preventers/divergent-change/) |
| Go | [`go/smells/change_preventers/divergent-change/`](../../../go/smells/change_preventers/divergent-change/) |
| Angular | [`angular/src/smells/change_preventers/divergent-change/`](../../../angular/src/smells/change_preventers/divergent-change/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Divergent Change: https://refactoring.guru/smells/divergent-change
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
