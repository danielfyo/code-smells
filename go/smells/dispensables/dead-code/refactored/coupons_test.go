package refactored

import (
	"testing"
	"time"
)

func TestDiscount(t *testing.T) {
	now := time.Date(2026, 6, 1, 0, 0, 0, 0, time.UTC)
	tests := []struct {
		name string
		c    Coupon
		want float64
	}{
		{"valid", Coupon{"SUMMER", 15, now.AddDate(0, 1, 0)}, 30},
		{"expired", Coupon{"OLD1", 50, now.AddDate(0, -1, 0)}, 0},
	}
	for _, tt := range tests {
		if got := Discount(tt.c, now, 200); got != tt.want {
			t.Errorf("%s = %v", tt.name, got)
		}
	}
}
