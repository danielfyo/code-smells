# Concurrent Map Access without Sync

> **ID:** CS175 · **Category:** Go-specific · **Sources:** Go FAQ; race detector

## Definition

Reading and writing a `map` from several goroutines without any synchronisation. Go maps are not safe for concurrent
use: simultaneous access with at least one write is a data race that can corrupt the map or abort the program with a
fatal error.

## Symptoms

- `fatal error: concurrent map writes` or `concurrent map read and map write` in production.
- `map[string]T` caches shared by HTTP handlers without a `sync.Mutex`.
- `go test -race` reporting "WARNING: DATA RACE" on map operations.
- Failures that only appear under load.

## Common causes

- Assuming maps are safe, as with concurrent collections in other languages.
- Introducing concurrency (goroutines, HTTP servers) into code that used to be sequential.
- Package variables used as caches (see [Mutable Package-level State](./package-level-state.md)).

## Why it is a problem

- **Process crashes**: the runtime's fatal error cannot be caught with `recover`.
- **Data corruption** and inconsistent reads.
- **Undefined behaviour** under the Go memory model.

## How it works under the hood

A `map` is a hash table whose buckets are reorganised as it grows; a write may move entries while another goroutine is
reading them. For performance, Go chose not to synchronise maps internally (Go FAQ, *Why are map operations not
defined to be atomic?*). The runtime includes a lightweight detector of concurrent writes that aborts the program when
it notices one, but it does not catch every case; the race detector (`-race`) instruments memory accesses and reports
reliably when the race actually happens during execution. The usual protection is a `sync.Mutex`/`RWMutex` next to the
map; `sync.Map` is optimised for specific cases.

## Example (smelly)

```go
type SessionStore struct {
	sessions map[string]Session // SMELL: shared without protection
}

func (s *SessionStore) Save(id string, sess Session) { s.sessions[id] = sess }

func (s *SessionStore) Get(id string) (Session, bool) {
	sess, ok := s.sessions[id]
	return sess, ok
}

// Used from many concurrent HTTP handlers →
// fatal error: concurrent map read and map write
```

## Solution (refactored)

```go
type SessionStore struct {
	mu       sync.RWMutex // REFACTOR: the mutex guards the map below it
	sessions map[string]Session
}

func NewSessionStore() *SessionStore {
	return &SessionStore{sessions: make(map[string]Session)}
}

func (s *SessionStore) Save(id string, sess Session) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.sessions[id] = sess
}

func (s *SessionStore) Get(id string) (Session, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sess, ok := s.sessions[id]
	return sess, ok
}
```

## Recommended refactorings

- **Encapsulate the map in a type** with a `sync.Mutex`/`RWMutex` and methods that guard it.
- **`sync.Map`** for write-once/read-many caches, or keys disjoint per goroutine.
- **Confinement**: a single goroutine owns the map and others send it messages over channels.
- Remember to use pointer receivers so the [mutex is not copied](./copying-mutex.md).

## When it may be acceptable

- Read-only maps initialised before starting the goroutines and never modified afterwards: concurrent reads are safe.
- Maps confined to a single goroutine.

## Related smells

- [Copying sync.Mutex](./copying-mutex.md)
- [Mutable Package-level State](./package-level-state.md)
- [Mutable Data](../06-data/mutable-data.md)
- [WaitGroup.Add inside Goroutine](./waitgroup-add-in-goroutine.md)

## Automatic detection

- **`go test -race`** / `go build -race`: the race detector.
- The runtime itself aborts when it detects concurrent writes (detection is not exhaustive).
- **go vet** `copylocks` for the associated mistake of copying the struct with its mutex.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/unsynchronized-map/`](../../../go/smells/go_specific/unsynchronized-map/)

## References

- Go FAQ — *Why are map operations not defined to be atomic?*: https://go.dev/doc/faq
- Go — *Data Race Detector*: https://go.dev/doc/articles/race_detector
- The Go Memory Model: https://go.dev/ref/mem
- Package `sync` (`Map`, `RWMutex`): https://pkg.go.dev/sync
