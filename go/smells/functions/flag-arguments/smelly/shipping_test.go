package smelly

import "testing"

func TestShipOrder(t *testing.T) {
	tests := []struct {
		kg      float64
		express bool
		want    Shipment
	}{
		{2, false, Shipment{4.5, 4}},
		{20, false, Shipment{10, 4}},
		{2, true, Shipment{12.9, 1}},
	}
	for _, tt := range tests {
		if got := ShipOrder(Order{tt.kg}, tt.express); got != tt.want {
			t.Errorf("%v %v = %v", tt.kg, tt.express, got)
		}
	}
}
