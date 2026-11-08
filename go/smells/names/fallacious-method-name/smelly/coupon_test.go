package smelly

import "testing"

func TestFallaciousNames(t *testing.T) {
	c := &Coupon{Code: "SPRING", Percent: 20}
	// The "predicate" changes its answer between calls: documents the bug.
	if !c.IsValid() || c.IsValid() {
		t.Fatal("expected IsValid to flip after the first call")
	}
	if got := c.GetDiscount(1000); got != 800 {
		t.Fatalf("GetDiscount = %d (returns the final price, not the discount)", got)
	}
}
