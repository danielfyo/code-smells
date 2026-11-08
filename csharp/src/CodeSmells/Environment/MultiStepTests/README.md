# Tests Require More Than One Step (C#)

This is an **environment** smell, so it is illustrated with documentation and scripts instead of C# code.

| Version | File | What it shows |
|---|---|---|
| Smelly | [`smelly/TESTING.md`](smelly/TESTING.md) | Running "all" the tests takes several commands, hand-started services and manual steps. |
| Refactored | [`refactored/test.sh`](refactored/test.sh) | A single command that runs the whole suite (and, optionally, collects coverage). |

## Why it smells

- **SMELL:** if running the tests takes effort, they get run less often (or only "mine").
- **SMELL:** each test project is launched separately and one of them is always forgotten.
- **SMELL:** tests depend on services that must be started by hand (database, queues...).

## Refactoring

- **REFACTOR:** `dotnet test` on the solution discovers and runs **every** test project.
- **REFACTOR:** external dependencies are replaced by in-memory doubles in unit tests and, in
  integration tests, started by the tests themselves (e.g. Testcontainers), not by hand.
- **REFACTOR:** the same command locally and in CI.

```bash
./refactored/test.sh             # whole suite
./refactored/test.sh --coverage  # whole suite + coverage (coverlet)
```

In this repository the real equivalent is `dotnet test CodeSmells.sln` from the repository root
(or `cd csharp && make test`).
