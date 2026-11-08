package smelly

import (
	"sync"
	"testing"
)

// Deterministically documents the bug: goroutines are held before Add, so
// Wait sees a zero counter and NotifyAll returns without having sent anything.
// They are released afterwards (Add after Wait has returned is legal) and the
// test waits for them so nothing is left running.
func TestNotifyAllReturnsBeforeWorkIsDone(t *testing.T) {
	gate := make(chan struct{})
	var started sync.WaitGroup
	orders := []string{"A1", "A2", "A3"}
	started.Add(len(orders))
	beforeAdd = func() { <-gate }
	t.Cleanup(func() { beforeAdd = func() {} })

	var mu sync.Mutex
	var sentTo []string
	send := func(o string) {
		defer started.Done()
		mu.Lock()
		sentTo = append(sentTo, o)
		mu.Unlock()
	}

	if got := NotifyAll(orders, send); got != 0 {
		t.Fatalf("NotifyAll reported %d sent; expected 0 because Wait returned early", got)
	}
	close(gate)
	started.Wait()
	if len(sentTo) != len(orders) {
		t.Fatalf("sentTo = %v", sentTo)
	}
}
