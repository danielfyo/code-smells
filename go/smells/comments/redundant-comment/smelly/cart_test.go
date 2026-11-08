package smelly

import "testing"

func TestCartTotal(t *testing.T) {
	var c Cart
	c.Add(Item{Price: 250, Quantity: 2})
	c.Add(Item{Price: 1000, Quantity: 1})
	if got := c.Total(); got != 1500 {
		t.Fatalf("Total() = %d, want 1500", got)
	}
}
