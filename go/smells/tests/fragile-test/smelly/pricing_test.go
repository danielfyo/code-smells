package smelly

import "testing"

// SMELL: the test inspects internals (the cache map and its size, and calls
// the private helper applyDiscount directly). If tomorrow the cache is
// removed, swapped for sync.Map or the helper renamed, the test breaks even
// though the price is still correct.
func TestPrice(t *testing.T) {
	p := NewPriceList(map[string]int64{"tea": 250})
	if p.Price("tea", 2) != 500 {
		t.Fatal("price")
	}
	if len(p.cache) != 1 || p.cache["tea"] != 250 {
		t.Fatalf("cache = %v", p.cache)
	}
	if applyDiscount(1000) != 900 {
		t.Fatal("applyDiscount")
	}
}
