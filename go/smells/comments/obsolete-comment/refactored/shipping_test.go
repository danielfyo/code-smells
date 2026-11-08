package refactored

import "testing"

func TestShippingCost(t *testing.T) {
	cases := []struct {
		order   int64
		express bool
		want    int64
	}{
		{5000, false, 300},
		{6000, false, 0},
		{1000, true, 800},
	}
	for _, c := range cases {
		if got := ShippingCost(c.order, c.express); got != c.want {
			t.Errorf("ShippingCost(%d, %v) = %d, want %d", c.order, c.express, got, c.want)
		}
	}
}
