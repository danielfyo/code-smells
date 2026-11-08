# Changelog

All notable changes to this project are documented in this file. From now on it is maintained
automatically by [release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), and the project follows
[Semantic Versioning](https://semver.org/).

## [1.1.0](https://github.com/danielfyo/code-smells/compare/v1.0.0...v1.1.0) (2026-11-08)


### Features

* add code smell catalog with examples in python, c#, react-ts and go ([c386290](https://github.com/danielfyo/code-smells/commit/c386290739da0050b62e3ac6213454e75ad56511))
* **angular:** add Angular examples for every smell ([#5](https://github.com/danielfyo/code-smells/issues/5)) ([6b686a0](https://github.com/danielfyo/code-smells/commit/6b686a0dc294caeca166ca66fd73dcf6cebcbeca))
* **catalog:** add catalog of 176 code smells with generator and checker ([d78eee0](https://github.com/danielfyo/code-smells/commit/d78eee0d81fb84fea14e2e1c59e74b5a2223938f))
* **csharp:** add c#/.net-specific smell examples ([98e6451](https://github.com/danielfyo/code-smells/commit/98e6451ce85d091799b2c0b80f51ab24b25f0787))
* **csharp:** add smelly and refactored examples for generic smells ([16d6a9a](https://github.com/danielfyo/code-smells/commit/16d6a9a9168c73a8836d39c9ee039e5d0ab8accf))
* **go:** add go-specific smell examples ([51d27f9](https://github.com/danielfyo/code-smells/commit/51d27f99984f45da5a64e686791ad0432fa72fe7))
* **go:** add smelly and refactored examples for generic smells ([d7e19b7](https://github.com/danielfyo/code-smells/commit/d7e19b7ee817d2c41a588088f6315f98a12fe1d0))
* **python:** add python-specific smell examples ([736bad0](https://github.com/danielfyo/code-smells/commit/736bad079c7bafc060e431aafef338ce99f25ee9))
* **python:** add smelly and refactored examples for generic smells ([7fbc891](https://github.com/danielfyo/code-smells/commit/7fbc891e425bbcb1c30e26c368aaa2bda3edd73e))
* **react-ts:** add react and typescript specific smell examples ([d348166](https://github.com/danielfyo/code-smells/commit/d348166526b5fdfe638aa5ac6594967b7ee30204))
* **react-ts:** add smelly and refactored examples for generic smells ([49d054c](https://github.com/danielfyo/code-smells/commit/49d054c1f3d360a44ccd7041835d7c7fe6ca1200))
* **scripts:** log in to gh and ask for repository and branch when missing ([f6ba6bc](https://github.com/danielfyo/code-smells/commit/f6ba6bcf75f69d788a83c2b03d22a0b252de539a))
* **tools:** add a markdown link checker and run every quality gate from make ([51d9c99](https://github.com/danielfyo/code-smells/commit/51d9c99ce001fe3008862200c11553b6de34b6a8))


### Bug Fixes

* **csharp:** add braces required by IDE0011 on newer .NET SDKs ([dcf2071](https://github.com/danielfyo/code-smells/commit/dcf20711bc97958db3aa086d8fafa3a3d34bae96))
* **csharp:** repair the build on newer .NET SDKs and a flaky test ([667c53f](https://github.com/danielfyo/code-smells/commit/667c53f6b3ee6d08ceb2359967266d63a3d5c4cc))
* **csharp:** satisfy .NET analyzers in refactored code and tests ([15d5237](https://github.com/danielfyo/code-smells/commit/15d52370e475b1bcfd6e9600c01d6fa808c007cb))


### Documentation

* add badges, social preview and quality gates to the readme ([cc073b1](https://github.com/danielfyo/code-smells/commit/cc073b15d1ebc93a730e32e66220efd6cfca8ebf))
* add introduction, conventions and project readmes ([7e5b6b7](https://github.com/danielfyo/code-smells/commit/7e5b6b78d31ed20c15dd60f0af1f2b6c227aa880))
* add issue and pull request templates and code owners ([ab02d26](https://github.com/danielfyo/code-smells/commit/ab02d26a735ae0aff3c9cb1eede45c5b8dd4ce6f))
* add license, code of conduct, contributing guide and security policy ([7d4b70d](https://github.com/danielfyo/code-smells/commit/7d4b70ddc62e7ebd9f8f4a85e2b3f538cf140c29))
* run shell scripts through bash so they work without the executable bit ([11d6216](https://github.com/danielfyo/code-smells/commit/11d621621d347e72304c074deb4aba0873f85ef1))
* **smells:** document Angular-specific smells ([808ef4b](https://github.com/danielfyo/code-smells/commit/808ef4bc8e85ac9e7cf2dd11bd51954ae61e8395))
* **smells:** document generic code smells (categories 01-13) ([f25a2e0](https://github.com/danielfyo/code-smells/commit/f25a2e04af8f8cd753d0b8eb43830073e416b970))
* **smells:** document python, c#, react-ts and go specific smells ([cfe8e79](https://github.com/danielfyo/code-smells/commit/cfe8e79fa73e05c6c3bb68275c1d76dc47191685))


### Tests

* **csharp:** run the smelly sleepy test outside the parallel pool ([4013140](https://github.com/danielfyo/code-smells/commit/4013140caf2cf1fba8d7c07c5dc3f17cd5968fa3))


### Build System

* **angular:** add Angular 22 project and extend the catalog with Angular-specific smells ([fadd0e6](https://github.com/danielfyo/code-smells/commit/fadd0e67c65bf3883d3e8886515b23157ec69395))
* **csharp:** enforce analyzers, code style and NuGet lock files ([9b2a1f3](https://github.com/danielfyo/code-smells/commit/9b2a1f34df3186e7594dff074582ba99dec61f1d))
* **python:** enforce ruff and mypy strict on non-smelly code ([e7dc72e](https://github.com/danielfyo/code-smells/commit/e7dc72ebb729556f4808270ad47d6fc5914f25e8))
* **react-ts:** add coverage reporting and upgrade vitest to v5 ([3d5c378](https://github.com/danielfyo/code-smells/commit/3d5c3782ab312d7ea10d1aff5e9271f18932da7b))
* restructure repository as a multi-language monorepo ([c239444](https://github.com/danielfyo/code-smells/commit/c23944489c7ecea00ce8932849c5cf4d33c1e0b8))
* share formatting and line-ending rules across all languages ([a9a1f70](https://github.com/danielfyo/code-smells/commit/a9a1f7003b37a084e567313205e93bfcd21699bd))


### Continuous Integration

* add Dependabot and release-please configuration ([215bbfc](https://github.com/danielfyo/code-smells/commit/215bbfc1845208210303a0c0c7d9ae034e10fb40))
* add GitHub Actions workflow for catalog and all languages ([d47f931](https://github.com/danielfyo/code-smells/commit/d47f93106ae070c1d005a3d2abcd13b2e334a9de))
* **angular:** build, test and report coverage for the Angular project ([e6edf5b](https://github.com/danielfyo/code-smells/commit/e6edf5be6465bd002d60007acf260dc22fc76576))
* harden workflows and add CodeQL, Scorecard, PR title and release automation ([37982fb](https://github.com/danielfyo/code-smells/commit/37982fba9d847b6c824b74c042d9d2f15fa50d1b))

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
