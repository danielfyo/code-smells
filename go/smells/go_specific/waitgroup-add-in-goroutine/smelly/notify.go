// Package smelly calls WaitGroup.Add inside the goroutine it is meant to
// track, so Add races with Wait.
package smelly

import (
	"sync"
	"sync/atomic"
)

// beforeAdd is a test hook that runs at the start of each goroutine, before
// Add. In production it does nothing; the test uses it to force the
// scheduling that, in real life, happens only sometimes.
var beforeAdd = func() {}

// NotifyAll sends a notification per order and returns how many were sent
// by the time it returns.
//
// SMELL: wg.Add(1) runs inside the goroutine. If wg.Wait() runs before any
// goroutine has reached Add, the counter is 0 and Wait returns immediately:
// NotifyAll reports work as finished while it is still pending. In the worst
// case the runtime panics with "WaitGroup misuse".
func NotifyAll(orders []string, send func(string)) int64 {
	var wg sync.WaitGroup
	var sent atomic.Int64
	for _, o := range orders {
		go func() {
			beforeAdd()
			wg.Add(1)
			defer wg.Done()
			send(o)
			sent.Add(1)
		}()
	}
	wg.Wait()
	return sent.Load()
}
