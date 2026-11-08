# Build Requires More Than One Step

> **ID:** CS091 · **Category:** Environment · **Sources:** Clean Code E1

*Building the project requires a manual sequence of commands, files and tribal knowledge.*

## Definition

Building the project requires a manual sequence of steps: installing tools by hand, copying configuration
files, running several commands in a specific order, setting environment variables that are only documented
in someone's head. *Clean Code* (E1, *Build Requires More Than One Step*) is clear: building a project should
be a single trivial operation; you should be able to check out the system and issue one simple command to
build it.

## Symptoms

- A README (or a wiki page) with a long list of numbered steps to compile.
- "It works on my machine": new team members take days to get a working build.
- Steps such as "copy `config.example` to `config.local` and edit the paths" or "run the generator first".
- The CI pipeline builds in a way that differs from how developers build locally.
- Required tool versions that are not pinned anywhere.

## Common causes

- The build grew incrementally and nobody automated the new steps.
- Tribal knowledge held by a few veterans.
- Lack of investment in tooling ("it's only five commands").

## Why it is a problem

- **Slow onboarding** and dependence on specific people.
- **Non-reproducible builds**: forgetting a step produces subtly different artifacts.
- **Friction** that discourages building, testing and integrating often.
- Divergence between local environments and CI, a source of "works locally, fails in CI" errors.

## Example (smelly)

```markdown
<!-- BUILD.md (SMELL: manual, order-dependent steps) -->
1. Install Go 1.24 and Node 20 (any recent version should do).
2. Copy `config/settings.example.json` to `config/settings.json`.
3. Run `go generate ./internal/...` BEFORE building.
4. `cd web && npm install && npm run build && cd ..`
5. Copy `web/dist` into `server/static/`.
6. `go build -o bin/shop ./cmd/shop`
7. If it fails, ask whoever set up the project.
```

## Solution (refactored)

```makefile
# Makefile (REFACTOR: one command builds everything, in the right order)
.PHONY: build generate web
build: config/settings.json generate web
	go build -o bin/shop ./cmd/shop

config/settings.json:
	cp config/settings.example.json $@

generate:
	go generate ./internal/...

web:
	npm --prefix web ci && npm --prefix web run build
	rm -rf server/static && cp -r web/dist server/static
```

With this, `make build` (or a `./build.sh`, `npm run build`, `dotnet build` on a solution, `go build ./...`)
is all a newcomer needs. Tool versions are pinned in files (`go.mod`, `.nvmrc`/`engines`, `global.json`,
`.python-version`), and CI runs the same command.

## Recommended refactorings

- **Automate the build** with the ecosystem's standard tool (`make`, `just`, `Taskfile`, npm scripts, `dotnet build` on a `.sln`, `go build ./...`, `pyproject.toml` with a build backend).
- **Pin tool and dependency versions** (`go.mod`, `package-lock.json`, `global.json`, `.python-version`, lock files).
- **Generate configuration from templates** automatically, with sensible defaults for development.
- **Make CI run exactly the same command** as developers.
- Offer a reproducible environment (Dev Containers, Docker, Nix) when system dependencies are complex.

## When it may be acceptable

- A one-time setup step that is explicitly documented and automated (e.g. `make setup` to install tools), as long as the everyday build remains a single command.
- Release processes involving human approvals or signing with protected keys, which are deliberately separate from the development build.

## Related smells

- [Tests Require More Than One Step](multi-step-tests.md): the same problem applied to running tests.
- [Configurable Data at Low Levels](../11-general/configurable-data-at-low-levels.md): configuration that has to be edited by hand to build.
- [Prefer Structure over Convention](../11-general/convention-over-structure.md): relying on people remembering steps instead of enforcing them.
- [Overridden Safeties](../08-error-handling/overridden-safeties.md): manual builds tend to skip checks.

## Automatic detection

- **Onboarding test**: a fresh clone on a clean machine (or a clean CI container) must build with one command; if it does not, the smell is present.
- **CI as a detector**: a pipeline that builds from scratch with the same command developers use catches undocumented steps.
- **Static checks** of the build scripts themselves: `shellcheck` for shell scripts, `actionlint` for GitHub Actions workflows, `hadolint` for Dockerfiles.

No linter of Python, C#, TypeScript or Go code detects this smell: it is a property of the repository and its tooling.

## Implementations

- Python: [`python/code_smells/environment/multi_step_build/`](../../../python/code_smells/environment/multi_step_build/)
- C#: [`csharp/src/CodeSmells/Environment/MultiStepBuild/`](../../../csharp/src/CodeSmells/Environment/MultiStepBuild/)
- React + TS: [`react-ts/src/smells/environment/multi-step-build/`](../../../react-ts/src/smells/environment/multi-step-build/)
- Go: [`go/smells/environment/multi-step-build/`](../../../go/smells/environment/multi-step-build/)

This smell is about the development environment rather than about code, so each folder illustrates it with a
`smelly/` variant (for example a `BUILD.md` with manual, error-prone steps) and a `refactored/` variant (a
`Makefile` or script that does everything with a single command), plus a minimal test where it makes sense.
At repository level, the root `Makefile` and the one-command-per-language table in `docs/CONVENTIONS.md` are
the refactored version applied to this very project.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Hunt, A. and Thomas, D. (2019). *The Pragmatic Programmer* (20th anniversary ed.). Addison-Wesley.
- Humble, J. and Farley, D. (2010). *Continuous Delivery*. Addison-Wesley.
- The Twelve-Factor App, "III. Config": https://12factor.net/config
