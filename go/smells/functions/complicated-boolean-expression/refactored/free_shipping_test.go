package refactored

import "testing"

func TestFreeShipping(t *testing.T) {
	tests := []struct {
		name string
		c    Cart
		want bool
	}{
		{"premium domestic", Cart{Country: "ES", Premium: true}, true},
		{"premium oversize", Cart{Country: "ES", Premium: true, HasOversize: true}, false},
		{"premium abroad", Cart{Country: "FR", Premium: true}, false},
		{"big order", Cart{Country: "PT", Total: 60, Items: 2}, true},
		{"small order", Cart{Country: "PT", Total: 30, Items: 2}, false},
		{"big oversize", Cart{Country: "ES", Total: 60, Items: 1, HasOversize: true}, false},
		{"coupon", Cart{Country: "ES", CouponFreeSh: true, Items: 1, HasOversize: true}, true},
		{"coupon empty", Cart{Country: "ES", CouponFreeSh: true}, false},
		{"coupon abroad", Cart{Country: "IT", CouponFreeSh: true, Items: 1}, false},
	}
	for _, tt := range tests {
		if got := FreeShipping(tt.c); got != tt.want {
			t.Errorf("%s = %v", tt.name, got)
		}
	}
}
