package smelly

import "testing"

func TestVehicles(t *testing.T) {
	tests := []struct {
		v     any
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
		fee, _ := TollFee(tt.v)
		speed, _ := MaxSpeed(tt.v)
		if fee != tt.fee || speed != tt.speed || Describe(tt.v) != tt.desc {
			t.Errorf("%T: got %v %v %q", tt.v, fee, speed, Describe(tt.v))
		}
	}
	// SMELL documented: an unhandled type only fails at runtime.
	if _, err := TollFee("bicycle"); err == nil {
		t.Error("expected runtime error for unknown vehicle")
	}
}
