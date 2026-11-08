# C#/.NET-specific Smells

Idiomatic C# and .NET anti-patterns. Many of them come from how the runtime and the language work: the
`async`/`await` state machine and `SynchronizationContext`, deferred execution in LINQ, the `IDisposable` contract,
the `throw` vs `rethrow` IL instructions, nullable reference types being a compile-time-only feature, and the
built-in dependency injection container. Generic smells (Long Method, Feature Envy...) apply to C# too; the ones
listed here are specific to C#/.NET or take a form that only makes sense on this platform.

Each document follows the same structure: definition, symptoms, common causes, why it is a problem, how it works
under the hood, smelly and refactored snippets, recommended refactorings, exceptions, related smells, automatic
detection (.NET/Roslyn analyzers such as CA2000, CA2200, CA1031, CA2227, CA1851, and the VSTHRD rules from
Microsoft.VisualStudio.Threading.Analyzers) and references. The runnable code (`Smelly.cs`, `Refactored.cs` and
tests) lives in [`csharp/src/CodeSmells/CsharpSpecific/`](../../../csharp/src/CodeSmells/CsharpSpecific/).

## Smells in this category

| ID | Smell | Summary |
|---|---|---|
| CS113 | [async void Methods](async-void.md) | Uncatchable exceptions that crash the process and calls that cannot be awaited. |
| CS114 | [Sync over Async (.Result / .Wait())](sync-over-async.md) | Blocking on tasks causes deadlocks and thread-pool starvation. |
| CS115 | [Missing using / IDisposable Leak](missing-dispose.md) | `IDisposable` resources (connections, streams, sockets) that are never released. |
| CS116 | [Rethrowing with `throw ex`](throw-ex.md) | `throw ex;` resets the stack trace and loses where the error happened. |
| CS117 | [Catching General Exception](catch-general-exception.md) | Indiscriminate `catch (Exception)` that hides programming errors. |
| CS118 | [String Concatenation in Loops](string-concat-in-loop.md) | `+=` on strings in loops creates thousands of objects; use `StringBuilder` or `string.Join`. |
| CS119 | [Multiple Enumeration of IEnumerable](multiple-enumeration.md) | Enumerating a deferred `IEnumerable` several times repeats queries or side effects. |
| CS120 | [new HttpClient per Request](httpclient-per-request.md) | Creating and disposing `HttpClient` per call exhausts sockets; use `IHttpClientFactory`. |
| CS121 | [DateTime.Now Hidden Dependency](datetime-now-dependency.md) | Logic tied to the system clock that cannot be tested deterministically. |
| CS122 | [Service Locator Anti-pattern](service-locator.md) | Asking a global container for dependencies hides what a class really needs. |
| CS123 | [Static Mutable State](static-mutable-state.md) | Modifiable `static` fields shared across threads and requests. |
| CS124 | [Anemic Domain Model](anemic-domain-model.md) | Behaviourless entities manipulated by services that hold all the logic. |
| CS125 | [Locking on this / public objects](lock-on-this.md) | Locking on publicly reachable objects lets external code cause deadlocks. |
| CS126 | [Exposing Mutable Collections](exposed-mutable-collections.md) | Public `List<T>` properties with setters that let callers break invariants. |
| CS127 | [Null-Forgiving Operator Abuse](null-forgiving-abuse.md) | Silencing nullability warnings with `!` instead of handling `null`. |
| CS128 | [Side Effects in LINQ](linq-side-effects.md) | Mutating state inside `Select`/`Where`; deferred execution makes it unpredictable. |
| CS129 | [Fake Async (Task.Run wrapping)](fake-async.md) | Wrapping synchronous code in `Task.Run` inside a library to look asynchronous. |
| CS130 | [Control Freak (newing dependencies)](new-in-constructor.md) | Instantiating dependencies inside the class prevents injecting and testing them. |
| CS131 | [#region Abuse](region-abuse.md) | Using `#region` to hide huge classes instead of splitting them. |
| CS132 | [Magic Configuration Strings](magic-config-strings.md) | Reading configuration with scattered string keys instead of typed `IOptions<T>`. |

## Recommended tooling

- **.NET analyzers** (built into the SDK): raise `AnalysisLevel` / `AnalysisMode` and enable rules such as `CA1031`
  and `CA1851`, which are off by default, via `.editorconfig`.
- **Microsoft.VisualStudio.Threading.Analyzers**: `VSTHRD002`, `VSTHRD100`, `VSTHRD103`, `VSTHRD110`... for async
  smells.
- **Nullable reference types** with `<Nullable>enable</Nullable>` and nullable warnings treated as errors.
- **Microsoft.CodeAnalysis.BannedApiAnalyzers** (`RS0030`) to ban APIs such as `DateTime.Now` or `new HttpClient()`
  in specific projects.
- **StyleCop.Analyzers**, **SonarAnalyzer for C#** or **Roslynator** for additional style and quality rules.

## General references

- David Fowler, *AsyncGuidance*:
  https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md
- Microsoft Learn, *Code quality rules*: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/
- Microsoft Learn, *Framework Design Guidelines*: https://learn.microsoft.com/dotnet/standard/design-guidelines/
- vs-threading analyzers: https://github.com/microsoft/vs-threading/blob/main/doc/analyzers/index.md
- Mark Seemann and Steven van Deursen, *Dependency Injection Principles, Practices, and Patterns* (Manning, 2019).
