package smelly

import "testing"

// Sequential use only: the test proves the functional behavior without
// triggering the race (see the package comment).
func TestPriceCacheSequential(t *testing.T) {
	c := NewPriceCache()
	c.Set("tea", 250)
	if p, ok := c.Get("tea"); !ok || p != 250 {
		t.Fatalf("Get = %d, %v", p, ok)
	}
	if _, ok := c.Get("milk"); ok {
		t.Fatal("unexpected hit")
	}
}
