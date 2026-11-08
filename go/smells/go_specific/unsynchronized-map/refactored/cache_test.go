package refactored

import (
	"sync"
	"testing"
)

// Exercises the cache from many goroutines; safe with and without -race.
func TestPriceCacheConcurrent(t *testing.T) {
	c := NewPriceCache()
	var wg sync.WaitGroup
	for i := range 100 {
		wg.Add(2)
		go func() { defer wg.Done(); c.Set("tea", int64(i)) }()
		go func() { defer wg.Done(); c.Get("tea") }()
	}
	wg.Wait()
	c.Set("tea", 250)
	if p, ok := c.Get("tea"); !ok || p != 250 {
		t.Fatalf("Get = %d, %v", p, ok)
	}
}
