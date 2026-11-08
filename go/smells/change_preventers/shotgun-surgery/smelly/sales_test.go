package smelly

import "testing"

func TestTotals(t *testing.T) {
	tests := []struct {
		name string
		got  float64
		want float64
	}{
		{"cart", Cart{Items: []float64{10, 5.5}}.Total(), 18.76},
		{"empty cart", Cart{}.Total(), 0},
		{"invoice", Invoice{Net: 100, Shipping: 4.99}.Total(), 127.04},
		{"quote", Quote{Hours: 3, Rate: 45}.Total(), 163.35},
	}
	for _, tt := range tests {
		if tt.got != tt.want {
			t.Errorf("%s = %v, want %v", tt.name, tt.got, tt.want)
		}
	}
}
