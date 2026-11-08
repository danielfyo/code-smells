// Package refactored uses pointer receivers on every type containing a
// sync.Mutex, so all calls share the same lock.
package refactored

import "sync"

// PageViews counts visits per page safely across goroutines.
//
// REFACTOR: pointer receivers and a constructor returning *PageViews; the
// mutex is never copied (go vet copylocks stays clean).
type PageViews struct {
	mu     sync.Mutex
	counts map[string]int
	total  int
}

// NewPageViews creates the counter.
func NewPageViews() *PageViews { return &PageViews{counts: map[string]int{}} }

// Hit records a visit.
func (p *PageViews) Hit(page string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.counts[page]++
	p.total++
}

// Total returns the total number of visits.
func (p *PageViews) Total() int {
	p.mu.Lock()
	defer p.mu.Unlock()
	return p.total
}

// Count returns the visits of a page.
func (p *PageViews) Count(page string) int {
	p.mu.Lock()
	defer p.mu.Unlock()
	return p.counts[page]
}
