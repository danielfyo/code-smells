# Go-specific smells

> **Category:** Go-specific · **Smells:** 22 · **Code folder:** `go/smells/go_specific/`

This category collects anti-patterns that are idiomatic to **Go**. Several are latent bugs rather than readability
issues, and understanding the underlying mechanics is key:

- **Errors are values**: they are returned, wrapped with `%w` and inspected with `errors.Is/As`; ignoring them, panicking
  or wrapping with `%v` breaks that model.
- **Interface values are (type, value) pairs**: a nil pointer stored in an `error` is not a nil interface; interfaces
  are satisfied implicitly and belong on the consumer side.
- **Goroutines are cheap but not free**: a blocked goroutine is never collected; every goroutine needs an owner and a way
  to stop (`context.Context`, buffered channels, `errgroup`).
- **`defer` runs at function exit**, in LIFO order, with arguments evaluated at the `defer` statement.
- **Copy semantics**: value receivers and assignments copy structs, including any `sync.Mutex` inside them.
- **Go 1.22 per-iteration loop variables** removed the classic closure-capture bug, but only for modules that declare
  `go 1.22` or later.

Detection relies on `go vet` (`copylocks`, `loopclosure`, `lostcancel`, `printf`), `errcheck`, `staticcheck`, `revive`,
the linters bundled in `golangci-lint`, the race detector (`go test -race`) and Uber's `goleak`.

Each smell has its own document (definition, symptoms, causes, consequences, how it works under the hood, smelly and refactored snippets, refactorings, exceptions, related smells, automatic detection and references) and a code folder with a `smelly` and a `refactored` version plus tests. Since these smells are language-specific, they are implemented only in this language.

Run the examples with `cd go && go vet ./... && go test ./...`.

## Smells in this category

| ID | Smell | Summary | Code |
|---|---|---|---|
| CS155 | [Ignored Errors](./ignored-errors.md) | Discarding errors with `_` or not checking them. | [`ignored-errors/`](../../../go/smells/go_specific/ignored-errors/) |
| CS156 | [panic for Control Flow](./panic-for-control-flow.md) | Using panic/recover for expected errors instead of returning error. | [`panic-for-control-flow/`](../../../go/smells/go_specific/panic-for-control-flow/) |
| CS157 | [Interface Pollution](./interface-pollution.md) | Producer-side interfaces created "just in case" with a single implementation. | [`interface-pollution/`](../../../go/smells/go_specific/interface-pollution/) |
| CS158 | [Empty Interface Abuse](./empty-interface-abuse.md) | Using any where a concrete or generic type would give type safety. | [`empty-interface-abuse/`](../../../go/smells/go_specific/empty-interface-abuse/) |
| CS159 | [Goroutine Leak](./goroutine-leak.md) | Goroutines blocked forever with no way to finish. | [`goroutine-leak/`](../../../go/smells/go_specific/goroutine-leak/) |
| CS160 | [Missing Context Propagation](./missing-context.md) | Ignoring context.Context: no cancellation and no timeouts. | [`missing-context/`](../../../go/smells/go_specific/missing-context/) |
| CS161 | [Naked Returns in Long Functions](./naked-returns.md) | Bare return in long functions with named results. | [`naked-returns/`](../../../go/smells/go_specific/naked-returns/) |
| CS162 | [init() Abuse](./init-abuse.md) | Side effects, I/O or hidden errors in init functions. | [`init-abuse/`](../../../go/smells/go_specific/init-abuse/) |
| CS163 | [Mutable Package-level State](./package-level-state.md) | Mutable package-level variables that prevent parallel tests. | [`package-level-state/`](../../../go/smells/go_specific/package-level-state/) |
| CS164 | [Stuttering Names](./stuttering-names.md) | user.UserService, http.HTTPServer: repeating the package name. | [`stuttering-names/`](../../../go/smells/go_specific/stuttering-names/) |
| CS165 | [Getters with Get Prefix](./get-prefix-getters.md) | In Go the getter for owner is Owner(), not GetOwner(). | [`get-prefix-getters/`](../../../go/smells/go_specific/get-prefix-getters/) |
| CS166 | [Error Strings Style](./error-string-style.md) | Error messages capitalised, with trailing punctuation or without context. | [`error-string-style/`](../../../go/smells/go_specific/error-string-style/) |
| CS167 | [Lost Error Wrapping (%v vs %w)](./lost-error-wrapping.md) | Formatting with %v or comparing with == prevents errors.Is/As. | [`lost-error-wrapping/`](../../../go/smells/go_specific/lost-error-wrapping/) |
| CS168 | [defer in Loop](./defer-in-loop.md) | defer runs at function exit, not at iteration end: resources pile up. | [`defer-in-loop/`](../../../go/smells/go_specific/defer-in-loop/) |
| CS169 | [Loop Variable Capture](./loop-variable-capture.md) | Before Go 1.22 every goroutine/closure shared the loop variable. | [`loop-variable-capture/`](../../../go/smells/go_specific/loop-variable-capture/) |
| CS170 | [Copying sync.Mutex](./copying-mutex.md) | Value receivers copy the mutex and synchronisation disappears. | [`copying-mutex/`](../../../go/smells/go_specific/copying-mutex/) |
| CS171 | [Typed nil in Interface](./typed-nil-interface.md) | Returning a nil pointer as an error yields a non-nil interface. | [`typed-nil-interface/`](../../../go/smells/go_specific/typed-nil-interface/) |
| CS172 | [utils / common Packages](./utils-package.md) | Catch-all packages with no cohesion and no meaningful name. | [`utils-package/`](../../../go/smells/go_specific/utils-package/) |
| CS173 | [time.After in Loops](./time-after-in-loop.md) | Each iteration creates a new timer; use time.NewTimer or a context. | [`time-after-in-loop/`](../../../go/smells/go_specific/time-after-in-loop/) |
| CS174 | [WaitGroup.Add inside Goroutine](./waitgroup-add-in-goroutine.md) | Calling Add inside the goroutine races with Wait. | [`waitgroup-add-in-goroutine/`](../../../go/smells/go_specific/waitgroup-add-in-goroutine/) |
| CS175 | [Concurrent Map Access without Sync](./unsynchronized-map.md) | Reading and writing a map from several goroutines without protection. | [`unsynchronized-map/`](../../../go/smells/go_specific/unsynchronized-map/) |
| CS176 | [Pointer to Interface](./pointer-to-interface.md) | *MyInterface is almost never needed and signals confusion. | [`pointer-to-interface/`](../../../go/smells/go_specific/pointer-to-interface/) |

## References

- Effective Go: https://go.dev/doc/effective_go
- Go Code Review Comments: https://go.dev/wiki/CodeReviewComments
- Go FAQ: https://go.dev/doc/faq
- Go Blog — *Fixing For Loops in Go 1.22*: https://go.dev/blog/loopvar-preview
- Go Blog — *Working with Errors in Go 1.13*: https://go.dev/blog/go1.13-errors
- Teiva Harsanyi — *100 Go Mistakes and How to Avoid Them*: https://100go.co
