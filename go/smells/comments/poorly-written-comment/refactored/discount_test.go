package refactored

import "testing"

func TestLoyaltyDiscount(t *testing.T) {
	cases := []struct {
		total int64
		years int
		vip   bool
		want  int64
	}{
		{10000, 0, false, 0},
		{10000, 3, false, 1000},
		{10000, 1, true, 1000},
	}
	for _, c := range cases {
		if got := LoyaltyDiscount(c.total, c.years, c.vip); got != c.want {
			t.Errorf("LoyaltyDiscount(%d, %d, %v) = %d, want %d", c.total, c.years, c.vip, got, c.want)
		}
	}
}
