package refactored

import "testing"

func TestHonestNames(t *testing.T) {
	c := &Coupon{Code: "SPRING", Percent: 20}
	if !c.IsValid() || !c.IsValid() {
		t.Fatal("IsValid must be side-effect free")
	}
	if !c.Redeem() || c.Redeem() || c.IsValid() {
		t.Fatal("Redeem must work once and invalidate the coupon")
	}
	if c.Discount(1000) != 200 || c.FinalPrice(1000) != 800 {
		t.Fatal("unexpected discount/final price")
	}
}
