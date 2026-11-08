# Code smells in C# / .NET 8

`Smelly` / `Refactored` examples of the generic smells plus the **20 idiomatic C# and .NET smells**.
Full index: [INDEX.md](INDEX.md).

```bash
dotnet test ../CodeSmells.sln                                         # everything (the solution lives at the repo root)
dotnet test --filter "FullyQualifiedName~CodeSmells.Tests.Bloaters"   # one category
```

- `src/CodeSmells/<Category>/<Slug>/Smelly.cs` — namespace `CodeSmells.<Category>.<Slug>.Smelly`.
- `src/CodeSmells/<Category>/<Slug>/Refactored.cs` — namespace `CodeSmells.<Category>.<Slug>.Refactored`.
- `tests/CodeSmells.Tests/<Category>/<Slug>Tests.cs` — xUnit tests.

Test smells live in the test project (`tests/CodeSmells.Tests/Tests/<Slug>/`). The examples project
suppresses some compiler warnings (`NoWarn`) because the `Smelly` versions contain intentional
anti-patterns; the `Refactored` versions should compile cleanly.
