package smelly

import "testing"

// SMELL: only "comfortable" values from the middle of each tier are tested.
// An off-by-one (qty > 50 instead of qty >= 50) would go unnoticed, as would
// the behavior with 0 or negative quantities.
func TestDiscountPercent(t *testing.T) {
	if DiscountPercent(5) != 0 {
		t.Error("5 units")
	}
	if DiscountPercent(25) != 5 {
		t.Error("25 units")
	}
	if DiscountPercent(100) != 10 {
		t.Error("100 units")
	}
}
