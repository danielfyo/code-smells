# Clutter

> **ID:** CS022 · **Category:** Dispensables · **Sources:** Clean Code G12
>
> Empty constructors, unused variables, unnecessary imports and noise that adds nothing.

## Definition

**Clutter** (*Clean Code* G12) is everything that adds nothing and just takes up space: empty default
constructors, variables declared and never used, unnecessary imports, functions that are never called,
comments with no information, redundant conversions or forgotten debugging code. Martin sums it up: keep
your source files clean, well organized and free of clutter.

Individually each element is harmless; accumulated, they make what matters get lost in the noise.

## Symptoms

- Unused imports, variables or parameters.
- Empty constructors, or constructors that only call the base constructor without arguments.
- Superfluous `pass`, `return;` or `else`; redundant conversions and checks.
- Leftover debugging (`print`, `console.log`, `fmt.Println`).
- Commented-out code blocks and empty or auto-generated comments.

## Common causes

- IDE templates and generators that add default code.
- Refactorings that do not clean up after themselves.
- No linters or automatic formatters in the workflow.

## Why it is a problem

- More noise when reading and reviewing diffs.
- Unnecessary dependencies (imports) that can slow down loading or create cycles.
- It looks careless and lowers the team's quality bar (broken windows theory).

## Example (smelly)

```csharp
using System;
using System.Text;          // SMELL: unused
using System.Threading;     // SMELL: unused

public class CustomerService
{
    public CustomerService() { }   // SMELL: empty constructor

    public string Greeting(Customer c)
    {
        string unused = "";         // SMELL: unused variable
        Console.WriteLine("debug"); // SMELL: leftover debugging
        if (c.IsVip == true) { return $"Hello, {c.Name}!"; }
        else { return $"Hello, {c.Name}"; }
    }
}
```

## Solution (refactored)

```csharp
public class CustomerService
{
    public string Greeting(Customer c) =>
        c.IsVip ? $"Hello, {c.Name}!" : $"Hello, {c.Name}";
}
```

## Recommended refactorings

- **Remove Dead Code**: deletes unused variables, functions and imports.
- **Inline Variable**: removes temporary variables that add no name.
- **Consolidate Conditional Expression**: simplifies redundant branches.

## When it may be acceptable

- Empty constructors required by a framework or serializer (document the reason).
- Explicit code for consistency with a team convention (e.g. an explicit `else` in symmetric business rules).

## Related smells

- [Dead Code](dead-code.md) — much of the clutter is dead code on a small scale.
- [Commented-Out Code](../09-comments/commented-out-code.md) — another common source of noise.
- [Redundant Comment](../09-comments/redundant-comment.md) — comments that provide no information.
- [#region Abuse](../15-csharp/region-abuse.md) — in C#, regions that hide clutter.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Ruff `F401`, `F841`, `PIE790` (unnecessary `pass`), `T201` (`print`), `RET505` (`else` after `return`), `SIM` (simplifications); Pylint `W0611`, `W0612`, `W0107`. |
| C# | `IDE0005` (unnecessary usings), `IDE0059` (unnecessary assignment), `CS0219`; SonarQube `S1186` (empty methods), `S1125` (redundant boolean literals), `S1481` (unused local variables). |
| React + TS | ESLint `no-unused-vars`/`@typescript-eslint/no-unused-vars`, `no-console`, `no-useless-constructor`/`@typescript-eslint/no-useless-constructor`, `no-else-return`, `no-extra-boolean-cast`, `no-unneeded-ternary`. |
| Go | The compiler rejects unused imports and variables; `gofmt -s`, `goimports`; golangci-lint `unused`, `unconvert`, `wastedassign`, `forbidigo` (forbid `fmt.Print*`). |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/dispensables/clutter/`](../../../python/code_smells/dispensables/clutter/) |
| C# | [`csharp/src/CodeSmells/Dispensables/Clutter/`](../../../csharp/src/CodeSmells/Dispensables/Clutter/) |
| React + TS | [`react-ts/src/smells/dispensables/clutter/`](../../../react-ts/src/smells/dispensables/clutter/) |
| Go | [`go/smells/dispensables/clutter/`](../../../go/smells/dispensables/clutter/) |
| Angular | [`angular/src/smells/dispensables/clutter/`](../../../angular/src/smells/dispensables/clutter/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
