# Tests Require More Than One Step

> **ID:** CS092 · **Category:** Environment · **Sources:** Clean Code E2

*Running all the tests cannot be done with a single command.*

## Definition

Running the whole test suite requires several commands, manual preparation or knowledge of which subsets to
run and how: starting a database by hand, running each module separately, exporting variables, running
unit, integration and front-end tests with different tools. *Clean Code* (E2, *Tests Require More Than One
Step*) states that you should be able to run all the unit tests with just one command, ideally with a single
click in the IDE.

## Symptoms

- Instructions such as "start Docker, run the migrations, then run `pytest` in each folder".
- Different commands per package or project, with no aggregating command.
- Tests that only run in CI because locally "it's too much hassle".
- Parts of the suite nobody runs because they need special preparation.

## Common causes

- Multi-project or multi-language repositories without a top-level orchestrator.
- Integration tests that depend on manually provisioned infrastructure.
- Test configuration scattered across tools without a single entry point.

## Why it is a problem

- **Tests run less often**, so feedback arrives late.
- **Partial runs** that let regressions through in the parts nobody ran.
- Onboarding friction and dependence on undocumented knowledge.

## Example (smelly)

```markdown
<!-- TESTING.md (SMELL: several manual steps to run the tests) -->
1. Start the database: `docker run -d -p 5432:5432 postgres:16`
2. Export `DATABASE_URL=postgres://localhost:5432/test`
3. `cd python && python3 -m pytest tests/unit`
4. `cd python && python3 -m pytest tests/integration` (only if the DB is up)
5. `cd ../react-ts && npm test -- --run`
6. `cd ../go && go test ./...`
```

## Solution (refactored)

```makefile
# Makefile (REFACTOR: `make test` runs the entire suite)
.PHONY: test test-python test-react test-go

test: test-python test-react test-go

test-python:
	cd python && python3 -m pytest

test-react:
	cd react-ts && npm run check

test-go:
	cd go && go vet ./... && go test ./...
```

Infrastructure that tests need is started by the tests themselves (Testcontainers, in-memory databases,
fakes) or by the same command (`docker compose up -d` as a prerequisite of the target), not by a person.

## Recommended refactorings

- **A single aggregating command** (`make test`, `npm test` in the workspace root, `dotnet test` on the solution, `go test ./...`, `pytest` with test discovery configured in `pyproject.toml`).
- **Self-provisioning tests**: Testcontainers (available for Python, .NET, Node and Go), in-memory databases or fakes instead of manually started infrastructure.
- **Configuration in versioned files** (`pyproject.toml`, `vitest.config.ts`, `.runsettings`) instead of manually exported variables.
- Separate fast and slow suites with markers or tags, but keep one command that runs everything.

## When it may be acceptable

- Long end-to-end or load test suites that run in a separate pipeline, provided they also have their own single command.
- Tests that require real external credentials (e.g. a payment provider's sandbox), clearly separated and skipped with an explicit reason when the credentials are absent.

## Related smells

- [Build Requires More Than One Step](multi-step-build.md): the same problem applied to building.
- [Slow Tests](../12-tests/slow-tests.md): if running tests is complicated and slow, nobody runs them.
- [Mystery Guest](../12-tests/mystery-guest.md): tests that depend on resources prepared by hand.
- [Ignored Tests](../12-tests/ignored-tests.md): parts of the suite that require special preparation end up being skipped.

## Automatic detection

- **CI as a detector**: if the pipeline needs many steps to run the tests, local developers face the same problem; the pipeline should call the same single command.
- **Coverage reports by suite** (coverage.py, coverlet, Vitest/Jest coverage, `go test -cover`) reveal modules whose tests never run in the default command.
- **Static checks** of scripts and workflows: `shellcheck`, `actionlint`.

As with the build, this is a property of the repository and its tooling, not of the code; it is detected by trying to run all the tests from a fresh clone.

## Implementations

- Python: [`python/code_smells/environment/multi_step_tests/`](../../../python/code_smells/environment/multi_step_tests/)
- C#: [`csharp/src/CodeSmells/Environment/MultiStepTests/`](../../../csharp/src/CodeSmells/Environment/MultiStepTests/)
- React + TS: [`react-ts/src/smells/environment/multi-step-tests/`](../../../react-ts/src/smells/environment/multi-step-tests/)
- Go: [`go/smells/environment/multi-step-tests/`](../../../go/smells/environment/multi-step-tests/)

This smell is about the development environment rather than about code, so each folder illustrates it with a
`smelly/` variant (for example a `BUILD.md` with manual, error-prone steps) and a `refactored/` variant (a
`Makefile` or script that does everything with a single command), plus a minimal test where it makes sense.
At repository level, the root `Makefile` and the one-command-per-language table in `docs/CONVENTIONS.md` are
the refactored version applied to this very project.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 9 "Unit Tests". Prentice Hall.
- Humble, J. and Farley, D. (2010). *Continuous Delivery*. Addison-Wesley.
- Hunt, A. and Thomas, D. (2019). *The Pragmatic Programmer* (20th anniversary ed.). Addison-Wesley.
