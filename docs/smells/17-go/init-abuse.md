# init() Abuse

> **ID:** CS162 · **Category:** Go-specific · **Sources:** 100 Go Mistakes #3

## Definition

Putting side-effecting logic in `init()` functions: opening database connections, reading files or environment
variables, calling network services or registering global state. Since `init` takes no parameters and cannot return
errors, any failure ends in `panic` or `log.Fatal`, and the logic runs merely because the package is imported.

## Symptoms

- `func init() { db, err = sql.Open(...); if err != nil { log.Fatal(err) } }`.
- Tests that fail or slow down because importing a package tries to connect to something.
- Global variables assigned in `init` and used throughout the package.
- Several `init` functions in different files whose order matters.

## Common causes

- Looking for an "automatic" place for configuration.
- Avoiding passing dependencies through constructors.

## Why it is a problem

- **No error handling**: the only way out is aborting the process.
- **Hard to test**: what `init` does cannot be skipped or configured; it runs before `TestMain`.
- **Implicit ordering**: depends on import order and file names.
- **Hidden global state** (see [Mutable Package-level State](./package-level-state.md)).

## How it works under the hood

At startup, Go initialises packages in dependency order: first package-level variables, then each file's `init`
functions, in the order the files are presented to the compiler. All of this happens before `main` and before any
test, simply because the package is imported (even with `import _`). `init` cannot be called or referenced
explicitly, and it has no signature to receive configuration or return an `error`. An explicit constructor
(`NewStore(cfg) (*Store, error)`) moves that logic to a point controlled by the caller.

## Example (smelly)

```go
package inventory

var db *sql.DB

func init() { // SMELL: I/O and hidden errors on import
	dsn := os.Getenv("INVENTORY_DSN")
	var err error
	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("inventory: %v", err) // aborts the process, even in tests
	}
	if err = db.Ping(); err != nil {
		log.Fatalf("inventory: %v", err)
	}
}

func Stock(sku string) (int, error) { /* uses the global db */ return 0, nil }
```

## Solution (refactored)

```go
package inventory

// REFACTOR: explicit constructor with dependencies and an error
type Store struct{ db *sql.DB }

func NewStore(ctx context.Context, dsn string) (*Store, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("open inventory db: %w", err)
	}
	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("ping inventory db: %w", err)
	}
	return &Store{db: db}, nil
}

func (s *Store) Stock(ctx context.Context, sku string) (int, error) { /* … */ return 0, nil }
// main reads configuration and calls NewStore; tests pass a test DSN or a fake.
```

## Recommended refactorings

- **Replace init with Constructor**: `New…` functions that take configuration and return `error`.
- **Dependency injection** from `main`.
- Lazy initialisation with `sync.OnceValue`/`sync.OnceValues` (Go 1.21+) when a singleton is genuinely needed.

## When it may be acceptable

- Pure, error-free initialisation: lookup tables, constant regular expressions (`regexp.MustCompile`).
- Registering drivers or codecs (`database/sql`, `image/png`), an established standard-library pattern.

## Related smells

- [Mutable Package-level State](./package-level-state.md)
- [Global Data](../05-couplers/global-data.md)
- [panic for Control Flow](./panic-for-control-flow.md)
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md)
- [Names Hiding Side Effects](../10-names/names-hiding-side-effects.md)

## Automatic detection

- **golangci-lint**: `gochecknoinits` (forbids `init` functions) and `gochecknoglobals`.
- **revive**: `deep-exit` (calls to `log.Fatal`/`os.Exit` outside `main`; `init` is allowed, but the rule helps elsewhere).

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/init-abuse/`](../../../go/smells/go_specific/init-abuse/)

## References

- Effective Go — *The init function*: https://go.dev/doc/effective_go
- The Go Programming Language Specification — *Package initialization*: https://go.dev/ref/spec
- Teiva Harsanyi — *100 Go Mistakes* (#3 "Misusing init functions"): https://100go.co
