package refactored

import "testing"

func TestVehicles(t *testing.T) {
	tests := []struct {
		v     Vehicle
		fee   float64
		speed int
		desc  string
	}{
		{Car{}, 4, 120, "car"},
		{Car{Electric: true}, 2, 120, "electric car"},
		{Truck{Axles: 3}, 10.5, 90, "truck with 3 axles"},
		{Motorcycle{}, 1.5, 120, "motorcycle"},
	}
	for _, tt := range tests {
		if tt.v.TollFee() != tt.fee || tt.v.MaxSpeed() != tt.speed || tt.v.Describe() != tt.desc {
			t.Errorf("%T: got %v %v %q", tt.v, tt.v.TollFee(), tt.v.MaxSpeed(), tt.v.Describe())
		}
	}
}
