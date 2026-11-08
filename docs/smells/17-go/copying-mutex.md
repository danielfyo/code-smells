# Copying sync.Mutex

> **ID:** CS170 · **Category:** Go-specific · **Sources:** go vet copylocks

## Definition

Copying a value that contains a `sync.Mutex` (or `RWMutex`, `WaitGroup`, `Once`, `Cond`...) after it has been used:
typically by declaring **value receivers** on a struct holding a mutex, passing the struct by value or iterating over
it with `range`. Each copy has its own independent mutex, so mutual exclusion disappears.

## Symptoms

- `func (c Counter) Inc() { c.mu.Lock(); … }` with a value receiver.
- Functions taking `Inventory` instead of `*Inventory` when the struct contains a mutex.
- `go vet` reporting "passes lock by value" or "range var copies lock".
- Counters that do not increment, or data races even though "there is a mutex".

## Common causes

- Mixing value and pointer receivers on the same type.
- Returning or storing structs by value in slices or maps.
- Not knowing that the `sync` documentation forbids copying these types after first use.

## Why it is a problem

- **No real synchronisation**: each goroutine locks its own copy.
- **Lost updates**: a method with a value receiver modifies a copy that is thrown away.
- **Strange deadlocks** when a locked mutex is copied (the copy starts out locked).

## How it works under the hood

In Go, assignment, argument passing and value receivers **copy** the entire struct field by field. `sync.Mutex` is a
struct holding internal state (counters and a semaphore); copying it duplicates that state into a new object with no
connection to the original. That is why the documentation says "A Mutex must not be copied after first use". With a
pointer receiver, every call shares the same mutex. The `sync` types carry `Lock`/`Unlock` methods (or a `noCopy`
marker) that the `copylocks` analyser in `go vet` uses to detect copies.

## Example (smelly)

```go
type StockCounter struct {
	mu    sync.Mutex
	units map[string]int
}

func (s StockCounter) Add(sku string, n int) { // SMELL: value receiver copies the mutex
	s.mu.Lock()
	defer s.mu.Unlock()
	s.units[sku] += n // the map is shared, the mutex is not: data race
}

func Report(s StockCounter) int { // SMELL: copies the struct (and the mutex)
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.units)
}
```

## Solution (refactored)

```go
type StockCounter struct {
	mu    sync.Mutex
	units map[string]int
}

func NewStockCounter() *StockCounter { return &StockCounter{units: map[string]int{}} }

func (s *StockCounter) Add(sku string, n int) { // REFACTOR: pointer receiver
	s.mu.Lock()
	defer s.mu.Unlock()
	s.units[sku] += n
}

func (s *StockCounter) Len() int { // REFACTOR: every method uses a pointer
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.units)
}
```

## Recommended refactorings

- **Pointer receivers** on every method of a type containing a mutex.
- **A constructor returning a pointer** (`New… *T`) and always passing `*T`.
- Store pointers in slices and maps (`[]*StockCounter`) or iterate by index.
- Alternative: hold a `*sync.Mutex` in the struct (less common; pointer receivers are preferable).

## When it may be acceptable

- Copying a struct with a mutex **before first use** (e.g. while building a zero value) is not incorrect, although
  `go vet` may still warn; it is better avoided.

## Related smells

- [Concurrent Map Access without Sync](./unsynchronized-map.md)
- [Mutable Package-level State](./package-level-state.md)
- [Mutable Data](../06-data/mutable-data.md)
- [Pointer to Interface](./pointer-to-interface.md)

## Automatic detection

- **go vet** `copylocks`: flags locks passed or assigned by value, value receivers and copies in `range`.
- **`go test -race`**: detects the resulting races.
- **revive**: `modifies-value-receiver` (modifications to value receivers).

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/copying-mutex/`](../../../go/smells/go_specific/copying-mutex/)

## References

- Package `sync` ("A Mutex must not be copied after first use"): https://pkg.go.dev/sync
- `go vet` (the `copylocks` analyser): https://pkg.go.dev/cmd/vet
- Go Code Review Comments — *Receiver Type*: https://go.dev/wiki/CodeReviewComments
- Teiva Harsanyi — *100 Go Mistakes* (#74 "Copying a sync type"): https://100go.co
