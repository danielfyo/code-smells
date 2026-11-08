package smelly

import "testing"

// SMELL: a single test checks adding, counting, totals, removing and the
// error of removing twice. When it fails the name does not say which behavior
// broke, and an early failure hides the state of the rest.
func TestCart(t *testing.T) {
	c := NewCart(map[string]int64{"tea": 250, "milk": 99})
	c.Add("tea", 2)
	c.Add("milk", 1)
	if c.Count() != 3 {
		t.Fatalf("count = %d", c.Count())
	}
	if c.Total() != 599 {
		t.Fatalf("total = %d", c.Total())
	}
	if err := c.Remove("tea"); err != nil {
		t.Fatal(err)
	}
	if c.Count() != 1 || c.Total() != 99 {
		t.Fatalf("after remove: count=%d total=%d", c.Count(), c.Total())
	}
	if err := c.Remove("tea"); err == nil {
		t.Fatal("expected error")
	}
}
