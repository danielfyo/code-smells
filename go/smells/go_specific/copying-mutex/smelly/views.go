// Package smelly illustrates copying a sync.Mutex by using value receivers.
//
// The code with the copied mutex lives in views_smelly_example.go, guarded by
// the smelly_example build tag: `go vet` (the copylocks analyzer) rejects it
// with "passes lock by value", so it is excluded from the normal build and
// the repository passes `go vet ./...`. To see it:
//
//	go vet -tags smelly_example ./smells/go_specific/copying-mutex/smelly/
//
// Here the root cause is shown in a way that compiles cleanly: a value
// receiver works on a COPY of the struct. If the struct contains a mutex,
// each call locks its own copy of the lock (excluding nobody) and updates
// are lost.
package smelly

// PageViews counts visits per page (no mutex, so that vet accepts it).
type PageViews struct {
	counts map[string]int
	total  int
}

// NewPageViews creates the counter.
func NewPageViews() PageViews { return PageViews{counts: map[string]int{}} }

// Hit SMELL: value receiver. total is incremented on the copy and lost; the
// map does "work" only because the copy shares the same underlying map, which
// makes the bug even more puzzling. With a sync.Mutex inside, the lock would
// be copied too and would protect nothing.
func (p PageViews) Hit(page string) {
	p.counts[page]++
	p.total++
}

// Total returns the total number of visits.
func (p PageViews) Total() int { return p.total }

// Count returns the visits of a page.
func (p PageViews) Count(page string) int { return p.counts[page] }
