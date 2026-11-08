# Contributing

Thanks for helping improve this code smell catalog! Contributions of every size are welcome:
typo fixes, clearer explanations, better examples, new smells or new detection rules.

## Ground rules

- **One catalog, one source of truth.** Every smell is declared in `tools/catalog_data.py`.
  `catalog.json`, `docs/CATALOG.md` and the per-language `INDEX.md` files are **generated**: never edit
  them by hand, run `python3 tools/build_catalog.py` instead. CI fails if they drift.
- **Smelly and refactored versions.** Each smell shows a `smelly` version (marked with `SMELL:` comments)
  and a `refactored` version (marked with `REFACTOR:` comments naming the technique). Tests prove both
  behave the same, or expose the bug the smell hides.
- **Equivalence across languages.** Generic smells exist in Python, C#, React + TypeScript, Go and Angular.
  A change to one example should be mirrored in the other four, with equivalent tests.
- **Smelly code is bad on purpose.** Linters and analyzers are disabled for `smelly` files only; everything
  else (refactored code, production code of the test smells, clean tests) must pass every check.
- **English only** for code, comments, docs, commits and pull requests.

## Prerequisites

| Toolchain | Version |
| --- | --- |
| Python | 3.11+ |
| .NET SDK | 8.0 (see `global.json`) |
| Node.js | 22.22+ (required by Angular 22) |
| Go | 1.24+ |

## Running the checks

```bash
make all                     # everything below

# Catalog, generated files and documentation links
python3 tools/build_catalog.py && git diff --exit-code
python3 tools/check_catalog.py --strict
python3 tools/check_links.py

# Python
cd python && pip install -e ".[dev]" && ruff check . && ruff format --check . && mypy && pytest

# C# / .NET (from the repository root)
dotnet test CodeSmells.sln

# React + TypeScript
cd react-ts && npm ci && npm run typecheck && npm test

# Go
cd go && test -z "$(gofmt -l .)" && go vet ./... && go test ./...

# Angular
cd angular && npm ci && npm run typecheck && npm test && npm run build
```

Each project also has a coverage command (`pytest --cov`, `dotnet test --collect:"XPlat Code Coverage"`,
`npm run coverage` in react-ts and angular, `go test -cover ./...`). CI publishes a coverage summary on every run.

## Adding a new smell

1. Declare it in `tools/catalog_data.py` and run `python3 tools/build_catalog.py`.
2. Write its page at the `doc` path listed in `catalog.json`, following the template in
   [docs/CONVENTIONS.md](docs/CONVENTIONS.md).
3. Implement `smelly` + `refactored` + tests at every `code` path.
4. `python3 tools/check_catalog.py --strict` must report no missing items.

## Commit messages and pull request titles

This repository follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
Releases and `CHANGELOG.md` are generated from them, and CI rejects pull request titles that don't comply.

```text
<type>(<optional scope>): <lowercase description>

feat(go): add an example of the typed nil interface smell
fix(react-ts): clean up the timer in the missing effect cleanup example
docs: clarify the difference between feature envy and inappropriate intimacy
```

| Type | Use it for | Release impact |
| --- | --- | --- |
| `feat` | a new smell, example or section | minor |
| `fix` | a bug in code or an error in the docs | patch |
| `docs` | documentation only | none |
| `test`, `refactor`, `perf`, `style` | code changes without new behaviour | none |
| `build`, `ci`, `chore` | tooling, dependencies, pipelines | none |

Useful scopes: `python`, `csharp`, `react-ts`, `go`, `angular`, `catalog`, `docs`, `ci`.
Add `!` after the type (`feat!:`) for breaking changes.

## Pull request process

Nobody pushes to `main` directly: every change arrives through a pull request.

1. **Fork** the repository and create a branch from `main` (`feat/<topic>`, `fix/<topic>`, `docs/<topic>`).
2. Make your change, with tests, and run the checks above.
3. Open a pull request using the template. Its title must be a Conventional Commit.
4. **Workflow approval.** For security, GitHub Actions do not run on pull requests from outside
   contributors until a maintainer approves them.
5. **Merge requirements** on `main`:
   - CI, CodeQL and the PR title check are green.
   - A code owner has approved the latest changes and every review conversation is resolved.
   - **Commits are signed** ([how to sign commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)).
   - Pull requests are merged with a merge commit or squashed (no rebase merges).

## Repository settings (maintainers)

Settings that cannot live in files (rulesets protecting `main` and release tags, security features,
topics, merge strategy) are applied with a script. It only calls the GitHub API, so it works from any
folder without cloning the repository. It needs the [GitHub CLI](https://cli.github.com) and an admin
account; if `gh` is not logged in, the script runs `gh auth login` first. The repository and the branch
to protect are parameters, and the script asks for them when they are omitted:

```powershell
.\scripts\setup-repo.ps1                                         # asks for repository and branch
.\scripts\setup-repo.ps1 -Repo danielfyo/code-smells -Branch main
```

```bash
bash scripts/setup-repo.sh                                # macOS / Linux: asks for repository and branch
bash scripts/setup-repo.sh danielfyo/code-smells main
```

Both scripts are idempotent: run them again whenever the CI jobs or settings change.

## Code of Conduct

By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
