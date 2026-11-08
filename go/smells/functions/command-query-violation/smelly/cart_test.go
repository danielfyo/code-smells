package smelly

import "testing"

func TestApplyCoupon(t *testing.T) {
	c := NewCart(100)
	if got := c.ApplyCoupon("SAVE10"); got != 90 {
		t.Errorf("total = %v", got)
	}
	if got := NewCart(100).ApplyCoupon("BOGUS"); got != 100 {
		t.Errorf("bogus = %v", got)
	}
}

// Documents the bug: querying the total through the command applies it again.
func TestQueryingAppliesAgain(t *testing.T) {
	c := NewCart(100)
	c.ApplyCoupon("SAVE10")
	if got := c.ApplyCoupon("SAVE10"); got != 80 {
		t.Errorf("total = %v; smelly version double-applies (80)", got)
	}
}
