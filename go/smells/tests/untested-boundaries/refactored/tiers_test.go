package refactored

import "testing"

// REFACTOR: the limits of every tier are tested (just before, at and just
// after each boundary) together with degenerate inputs (0 and negatives).
func TestDiscountPercentBoundaries(t *testing.T) {
	cases := []struct{ qty, want int }{
		{-1, 0}, {0, 0}, {1, 0},
		{9, 0}, {10, 5}, {11, 5},
		{49, 5}, {50, 10}, {51, 10},
	}
	for _, c := range cases {
		if got := DiscountPercent(c.qty); got != c.want {
			t.Errorf("DiscountPercent(%d) = %d, want %d", c.qty, got, c.want)
		}
	}
}
