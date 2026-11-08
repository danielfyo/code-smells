# Build Requires More Than One Step (C#)

This is an **environment** smell, not a code smell, so it is illustrated with documentation and scripts
instead of `Smelly.cs` / `Refactored.cs`.

| Version | File | What it shows |
|---|---|---|
| Smelly | [`smelly/BUILD.md`](smelly/BUILD.md) | A 9-step manual recipe with a fragile order and tribal knowledge. |
| Refactored | [`refactored/build.sh`](refactored/build.sh) | A single command that restores, builds and fails fast if anything goes wrong. |

## Why it smells

- **SMELL:** building requires remembering a sequence of commands, files to copy by hand and
  "asking someone". Every developer (and the CI) does it slightly differently.
- **SMELL:** the order of the steps is implicit: building `Web` before `Core` fails.
- **SMELL:** onboarding a new person takes days instead of minutes.

## Refactoring

- **REFACTOR:** `dotnet build` already works out the build order from the project references in the
  solution; there is no need to build projects one by one.
- **REFACTOR:** everything needed to build lives in the repository (`global.json`,
  `Directory.Build.props`, `NuGet.config`), not in somebody's head.
- **REFACTOR:** a single entry point (`build.sh`, `make build` or `dotnet build`) used by people and CI alike.

```bash
bash refactored/build.sh            # Debug
bash refactored/build.sh Release    # Release
```

In this repository the real equivalent is `dotnet build CodeSmells.sln` from the repository root
(or `cd csharp && make build`).
