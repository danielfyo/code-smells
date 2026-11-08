//go:build smelly_example

package smelly

import "sync"

// SafePageViews SMELL: it has a mutex, but the methods use a value receiver.
// Each call copies the whole struct, mutex included: two goroutines lock two
// different locks and access the map at the same time (data race and a
// possible "fatal error: concurrent map writes"). go vet detects it:
//
//	SafePageViews.Hit passes lock by value: SafePageViews contains sync.Mutex
type SafePageViews struct {
	mu     sync.Mutex
	counts map[string]int
}

func (p SafePageViews) Hit(page string) {
	p.mu.Lock() // locks the COPY of the mutex
	defer p.mu.Unlock()
	p.counts[page]++
}
