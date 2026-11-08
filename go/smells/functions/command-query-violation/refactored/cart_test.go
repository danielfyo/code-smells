package refactored

import (
	"errors"
	"testing"
)

func TestApplyCoupon(t *testing.T) {
	c := NewCart(100)
	if err := c.ApplyCoupon("SAVE10"); err != nil {
		t.Fatal(err)
	}
	if c.Total() != 90 || c.Total() != 90 {
		t.Errorf("total = %v", c.Total())
	}
	if err := c.ApplyCoupon("SAVE10"); !errors.Is(err, ErrAlreadyApplied) || c.Total() != 90 {
		t.Errorf("reapply: %v total=%v", err, c.Total())
	}
	other := NewCart(100)
	if err := other.ApplyCoupon("BOGUS"); !errors.Is(err, ErrUnknownCoupon) || other.Total() != 100 {
		t.Errorf("bogus: %v total=%v", err, other.Total())
	}
}
