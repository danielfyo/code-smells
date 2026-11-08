# Hidden Temporal Coupling

> **ID:** CS031 · **Category:** Couplers · **Sources:** Clean Code G31
>
> Calls must happen in a specific order, but nothing in the code enforces or reveals it.

## Definition

**Hidden temporal coupling** (*Clean Code* G31) occurs when several operations must run in a given order
but nothing in the code enforces it or makes it visible. If `calculate()` is called before `load()`, the
result is wrong or the program fails, and only the documentation (if any) or experience warns you.

Martin proposes making the coupling explicit: each step produces what the next one needs, so it is
impossible to call them in another order.

## Symptoms

- `init()`, `open()`, `prepare()` methods that must be remembered before calling others.
- Methods with no parameters or return value that communicate through fields.
- "Object not initialized" errors or null values at runtime.
- Comments such as "call X before Y".

## Common causes

- Splitting a process into methods that share state through fields.
- Objects with incomplete constructors and later configuration.
- APIs designed as sequences of calls (setup, execution, cleanup) without structure.

## Why it is a problem

- Mistakes that are easy to make and hard to diagnose.
- Reordering apparently harmless code introduces failures.
- The API is hard to use correctly without knowing its implementation.

## Example (smelly)

```python
class PayrollRun:
    def load_employees(self, repo):
        self.employees = repo.all()

    def compute_salaries(self):
        # SMELL: fails if load_employees() was not called first
        self.salaries = {e.id: e.base * 1.05 for e in self.employees}

    def export(self):
        return sorted(self.salaries.items())
```

## Solution (refactored)

```python
def load_employees(repo) -> list[Employee]:
    return repo.all()

def compute_salaries(employees: list[Employee]) -> dict[int, float]:
    return {e.id: e.base * RAISE_FACTOR for e in employees}

def export(salaries: dict[int, float]) -> list[tuple[int, float]]:
    return sorted(salaries.items())

# The order is enforced by the data: each step needs the previous step's result
report = export(compute_salaries(load_employees(repo)))
```

## Recommended refactorings

- **Split Phase**: each stage receives the previous stage's result as a parameter.
- **Replace Temp with Query**: together with passing data through parameters instead of fields.
- **Replace Constructor with Factory Function**: guarantees that the object is born fully initialized.
- **Combine Functions into Transform**: groups steps that always go together.

## When it may be acceptable

- Inherently sequential protocols (open, read, close) when the language offers constructs that guarantee them: `with` in Python, `using` in C#, `defer` in Go.
- Builders that validate in `build()` that all mandatory steps have been performed.

## Related smells

- [Temporary Field](../02-oo-abusers/temporary-field.md) — temporary fields are the usual channel of temporal coupling.
- [Side Effects](../07-functions/side-effects.md) — functions with side effects impose hidden orderings.
- [Logical Dependency Not Made Physical](../11-general/hidden-logical-dependency.md) — logical dependencies not expressed in the code.
- [Not Using Context Managers](../14-python/missing-context-manager.md) — in Python, resources without `with` that depend on calling `close()`.
- [init() Abuse](../17-go/init-abuse.md) — in Go, ordering dependencies between `init` functions.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0201 attribute-defined-outside-init` flags attributes created outside `__init__`, typical of this smell. |
| C# | With nullable reference types enabled, `CS8618`/`CS8602` reveal fields that depend on later initialization. |
| React + TS | `strictPropertyInitialization` in `tsconfig`; in React, `react-hooks/exhaustive-deps` helps make effect dependencies explicit. |
| Go | No specific linter; `go vet` (`copylocks`, `lostcancel`) detects some incorrect usage protocols. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/hidden_temporal_coupling/`](../../../python/code_smells/couplers/hidden_temporal_coupling/) |
| C# | [`csharp/src/CodeSmells/Couplers/HiddenTemporalCoupling/`](../../../csharp/src/CodeSmells/Couplers/HiddenTemporalCoupling/) |
| React + TS | [`react-ts/src/smells/couplers/hidden-temporal-coupling/`](../../../react-ts/src/smells/couplers/hidden-temporal-coupling/) |
| Go | [`go/smells/couplers/hidden-temporal-coupling/`](../../../go/smells/couplers/hidden-temporal-coupling/) |
| Angular | [`angular/src/smells/couplers/hidden-temporal-coupling/`](../../../angular/src/smells/couplers/hidden-temporal-coupling/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
