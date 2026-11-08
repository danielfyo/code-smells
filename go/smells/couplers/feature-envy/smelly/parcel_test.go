package smelly

import "testing"

func TestCost(t *testing.T) {
	calc := ShippingCalculator{RatePerKg: 2}
	tests := []struct {
		name string
		p    Parcel
		want float64
	}{
		{"heavy", Parcel{10, 10, 10, 5, false}, 10},
		{"bulky", Parcel{50, 40, 30, 2, false}, 24},
		{"fragile", Parcel{10, 10, 10, 1, true}, 5},
	}
	for _, tt := range tests {
		if got := calc.Cost(tt.p); got != tt.want {
			t.Errorf("%s = %v, want %v", tt.name, got, tt.want)
		}
	}
}
