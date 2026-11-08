package refactored

import (
	"sync"
	"testing"
)

func TestHitIsSafeAndKeepsUpdates(t *testing.T) {
	pv := NewPageViews()
	var wg sync.WaitGroup
	for range 50 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			pv.Hit("/home")
		}()
	}
	wg.Wait()
	if pv.Count("/home") != 50 || pv.Total() != 50 {
		t.Fatalf("count=%d total=%d, want 50", pv.Count("/home"), pv.Total())
	}
}
