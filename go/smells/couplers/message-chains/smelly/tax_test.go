package smelly

import (
	"math"
	"testing"
)

func TestVATFor(t *testing.T) {
	tests := []struct {
		country, zone string
		want          float64
	}{
		{"ES", "EU", 21},
		{"ES-CN", "CANARY", 7},
		{"US", "NONE", 0},
	}
	for _, tt := range tests {
		if got := VATFor(NewOrder(100, tt.country, tt.zone)); math.Abs(got-tt.want) > 1e-9 {
			t.Errorf("%s = %v, want %v", tt.country, got, tt.want)
		}
	}
}
