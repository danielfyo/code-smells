# Repository conventions

This document defines how every code smell is organized. **`catalog.json`** (generated from
`tools/catalog_data.py`) is the single source of truth: id, slug, category, documentation path and code paths.

## Principles

1. **Every smell has two versions per language**: `smelly` (with the smell) and `refactored` (the fix).
   Both implement **the same observable behavior** on a small, realistic example (orders, invoices,
   users, inventory, bookings...). No `foo`/`bar`.
2. **Tests prove the equivalence** — or the bug the smell causes, when the smell is a latent defect
   (e.g. mutable default argument, goroutine leak, `async void`). Tests must always pass.
3. **Teaching comments**: the smelly version marks with `SMELL:` where it smells and why; the refactored
   version marks with `REFACTOR:` which technique was applied (Extract Function, Replace Conditional
   with Polymorphism, Introduce Parameter Object...).
4. **Short, focused examples** (usually 20-120 lines per file); one smell per folder.
5. Everything builds / type-checks / passes its tests with a single command per language.

## Layout per language

| Language | Smell folder | Files | Command |
|---|---|---|---|
| Python 3.11+ | `python/code_smells/<category>/<slug_snake>/` | `__init__.py`, `smelly.py`, `refactored.py`, `test_<slug_snake>.py` | `cd python && python3 -m pytest` |
| C# / .NET 8 | `csharp/src/CodeSmells/<Category>/<SlugPascal>/` | `Smelly.cs`, `Refactored.cs` (namespaces `CodeSmells.<Category>.<SlugPascal>.Smelly` / `.Refactored`); tests in `csharp/tests/CodeSmells.Tests/<Category>/<SlugPascal>Tests.cs` | `dotnet test CodeSmells.sln` (repo root) |
| React + TS | `react-ts/src/smells/<category>/<slug>/` | `Smelly.tsx` / `Refactored.tsx` (or `.ts` when there is no UI), `<slug>.test.tsx` | `cd react-ts && npm run check` |
| Go 1.24 | `go/smells/<category>/<slug>/` | `smelly/` and `refactored/` subpackages, each with its `.go` and `_test.go` | `cd go && go vet ./... && go test ./...` |

Code categories: `bloaters`, `oo_abusers`, `change_preventers`, `dispensables`, `couplers`, `data`,
`functions`, `error_handling`, `comments`, `names`, `general`, `tests`, `environment`,
`python_specific`, `csharp_specific`, `react_ts_specific`, `go_specific`.

### Special cases

- **Test smells (`tests/`)**: the code under test lives in a production file; the smelly test files
  contain the smelly test and the refactored ones the clean test. Both pass (sleepy tests wait < 300 ms).
- **Environment smells (`environment/`)**: illustrated with a `smelly/BUILD.md` listing manual steps
  versus a single-command `Makefile`/script in `refactored/`, plus a small test where it makes sense.
- **Latent-bug smells**: the test documents the wrong behavior of the smelly version and the correct
  behavior of the refactored one.

## Documentation template (`docs/smells/<NN-category>/<slug>.md`)

```
# <Name>
> **ID:** CSxxx · **Category:** ... · **Sources:** ...
## Definition
## Symptoms
## Common causes
## Why it is a problem
## Example (smelly) / ## Solution (refactored)
## Recommended refactorings
## When it may be acceptable
## Related smells
## Automatic detection
## Implementations
## References
```

## Quality gates

- `smelly` files are exempt from linters on purpose: Ruff `extend-exclude`, mypy `exclude` +
  `follow_imports = "skip"`, `.editorconfig` treats `Smelly*.cs` as generated code, CodeQL `paths-ignore`.
- Everything else must pass: Ruff + mypy `--strict` (Python), warnings as errors with .NET analyzers
  `latest-recommended` (C#), TypeScript `strict` (React + TS), `gofmt` + `go vet` + `go test -race` (Go).
- Generated files (`catalog.json`, `docs/CATALOG.md`, `*/INDEX.md`) must match `tools/build_catalog.py`.
- `make all` runs exactly what CI runs.

## Commits

The history follows [Conventional Commits](https://www.conventionalcommits.org/):
`feat(python): add long-method example`, `docs: describe shotgun surgery`, `fix(go): ...`,
`test(csharp): ...`, `build: ...`, `ci: ...`, `chore: ...`. Pull request titles are validated in CI, and
[release-please](https://github.com/googleapis/release-please) builds `CHANGELOG.md` and releases from them.
