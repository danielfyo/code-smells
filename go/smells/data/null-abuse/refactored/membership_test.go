package refactored

import (
	"errors"
	"testing"
)

func TestPrice(t *testing.T) {
	d := NewDirectory(Customer{ID: "gold", Membership: Membership{DiscountPct: 20}}, Customer{ID: "basic"})
	for id, want := range map[string]float64{"gold": 80, "basic": 100, "ghost": 100} {
		if got := d.Price(id, 100); got != want {
			t.Errorf("%s = %v", id, got)
		}
	}
	tests := []struct {
		id      string
		want    int
		wantErr error
	}{{"gold", 20, nil}, {"basic", 0, nil}, {"ghost", 0, ErrNotFound}}
	for _, tt := range tests {
		got, err := d.MemberDiscount(tt.id)
		if got != tt.want || !errors.Is(err, tt.wantErr) {
			t.Errorf("%s = %d, %v", tt.id, got, err)
		}
	}
}
