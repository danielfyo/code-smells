//go:build smelly_example

package smelly

import "sync"

// Hammer writes and reads the cache from many goroutines at once. DO NOT
// RUN IT in the normal suite: it is a data race and can kill the process with
// "fatal error: concurrent map writes". It is only compiled with
// -tags smelly_example, e.g. to see the race detector report it.
func Hammer(c *PriceCache) {
	var wg sync.WaitGroup
	for i := range 100 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Set("tea", int64(i))
			c.Get("tea")
		}()
	}
	wg.Wait()
}
