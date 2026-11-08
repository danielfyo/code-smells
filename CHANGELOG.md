# Changelog

All notable changes to this project are documented in this file. From now on it is maintained
automatically by [release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), and the project follows
[Semantic Versioning](https://semver.org/).

## 1.0.0 (2026-11-08)

### Features

* **catalog:** 176 code smells in 17 categories with a single source of truth (`tools/catalog_data.py`),
  a generator for `catalog.json`, `docs/CATALOG.md` and the per-language indexes, and a completeness checker.
* **python:** smelly and refactored examples with tests for the 92 generic smells and 20 Python-specific smells.
* **csharp:** smelly and refactored examples with xUnit tests for the 92 generic smells and 20 C#/.NET-specific smells.
* **react-ts:** smelly and refactored examples with Vitest tests for the 92 generic smells and 22 React/TypeScript-specific smells.
* **go:** smelly and refactored examples with tests for the 92 generic smells and 22 Go-specific smells.

### Documentation

* One explanation page per smell (definition, symptoms, causes, consequences, example, solution,
  refactorings, exceptions, related smells, automatic detection and references), category overviews,
  an introduction to code smells and the repository conventions.

### Build System

* Multi-language monorepo with a .NET solution at the repository root, strict analyzers, Ruff, mypy,
  gofmt/go vet and TypeScript strict mode as quality gates.
