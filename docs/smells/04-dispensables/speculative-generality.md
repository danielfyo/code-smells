# Speculative Generality

> **ID:** CS020 · **Category:** Dispensables · **Sources:** Fowler 1999
>
> Abstractions, hooks and parameters created "just in case" that nobody needs (YAGNI).

## Definition

**Speculative generality** appears when someone says "I think we'll need this someday" and adds hooks,
parameters, abstract classes or configuration that nobody uses yet. It is the code-level counterpart of
the YAGNI principle (*You Aren't Gonna Need It*).

Fowler points out a clear clue: if the only users of an abstraction are the tests, it is probably
unnecessary.

## Symptoms

- Interfaces or abstract classes with a single implementation and no plans for more.
- Parameters that always receive the same value or are ignored.
- Empty "extension" methods or hooks.
- Configuration for options that no client uses.
- Generic names (`AbstractProcessorFactory`, `BaseHandler<T>`) for concrete problems.

## Common causes

- Anticipating future requirements that nobody asked for.
- Applying design patterns out of habit.
- Believing that generalizing later will be more expensive than doing it now.

## Why it is a problem

- The code is harder to understand than the problem it solves.
- Premature abstractions are usually wrong and later get in the way of the real requirement.
- More surface to maintain and test.

## Example (smelly)

```python
from abc import ABC, abstractmethod

class ExportStrategy(ABC):
    @abstractmethod
    def export(self, rows, options=None, hooks=None): ...

class CsvExportStrategy(ExportStrategy):  # the only implementation
    def export(self, rows, options=None, hooks=None):
        return "\n".join(",".join(map(str, r)) for r in rows)

class ExporterFactory:
    @staticmethod
    def create(kind="csv"):
        return CsvExportStrategy()
```

## Solution (refactored)

```python
def export_csv(rows) -> str:
    return "\n".join(",".join(map(str, r)) for r in rows)
```

When a real second format appears, the abstraction can be introduced with knowledge of both cases.

## Recommended refactorings

- **Collapse Hierarchy**: removes abstract classes with no real variation.
- **Inline Function**: and **Inline Class**: remove unnecessary delegation.
- **Change Function Declaration**: removes parameters nobody uses.
- **Remove Dead Code**: for hooks and methods with no callers.

## When it may be acceptable

- Libraries and frameworks whose purpose is precisely to be extended by third parties.
- Interfaces that exist to isolate an external dependency in tests (a deliberate seam).
- Requirements confirmed for the next iteration, not mere assumptions.

## Related smells

- [Lazy Class / Lazy Element](lazy-class.md) — speculative abstractions are often lazy classes.
- [Dead Code](dead-code.md) — unused hooks and parameters.
- [Middle Man](../05-couplers/middle-man.md) — delegation layers added "just in case".
- [Interface Pollution](../17-go/interface-pollution.md) — Go variant: interfaces defined before they are needed.
- [Premature Memoization](../16-react-ts/premature-memoization.md) — React variant: speculative optimizations.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Ruff `ARG001`/`ARG002` and Pylint `W0613 unused-argument` (unused parameters); `vulture` for unused classes and methods. |
| C# | `IDE0060` (unused parameter), SonarQube `S1172`; `CA1040` (empty interfaces); NDepend can list interfaces with a single implementation. |
| React + TS | `@typescript-eslint/no-unused-vars` (including arguments), `@typescript-eslint/no-empty-function`; `knip` for unused exports. |
| Go | golangci-lint `unparam` (parameters that always receive the same value or are unused), `unused`; `interfacebloat`. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/dispensables/speculative_generality/`](../../../python/code_smells/dispensables/speculative_generality/) |
| C# | [`csharp/src/CodeSmells/Dispensables/SpeculativeGenerality/`](../../../csharp/src/CodeSmells/Dispensables/SpeculativeGenerality/) |
| React + TS | [`react-ts/src/smells/dispensables/speculative-generality/`](../../../react-ts/src/smells/dispensables/speculative-generality/) |
| Go | [`go/smells/dispensables/speculative-generality/`](../../../go/smells/dispensables/speculative-generality/) |
| Angular | [`angular/src/smells/dispensables/speculative-generality/`](../../../angular/src/smells/dispensables/speculative-generality/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *Yagni* (bliki): https://martinfowler.com/bliki/Yagni.html
- Refactoring.Guru — Speculative Generality: https://refactoring.guru/smells/speculative-generality
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
