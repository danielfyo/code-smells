// Package refactored calls WaitGroup.Add in the launching goroutine, before
// the go statement, so Wait always sees the right counter.
package refactored

import (
	"sync"
	"sync/atomic"
)

// NotifyAll sends a notification per order and returns how many were sent.
//
// REFACTOR: wg.Add(1) moves before "go func()". (With Go 1.25+ wg.Go(f) does
// both things in one call.) Wait now always waits for every goroutine.
func NotifyAll(orders []string, send func(string)) int64 {
	var wg sync.WaitGroup
	var sent atomic.Int64
	for _, o := range orders {
		wg.Add(1)
		go func() {
			defer wg.Done()
			send(o)
			sent.Add(1)
		}()
	}
	wg.Wait()
	return sent.Load()
}
