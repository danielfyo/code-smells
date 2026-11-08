package refactored

import "testing"

func TestShip(t *testing.T) {
	tests := []struct {
		name string
		got  Shipment
		want Shipment
	}{
		{"standard", ShipStandard(Order{2}), Shipment{4.5, 4}},
		{"standard capped", ShipStandard(Order{20}), Shipment{10, 4}},
		{"express", ShipExpress(Order{2}), Shipment{12.9, 1}},
	}
	for _, tt := range tests {
		if tt.got != tt.want {
			t.Errorf("%s = %v", tt.name, tt.got)
		}
	}
}
