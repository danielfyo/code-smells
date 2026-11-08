package smelly

import "testing"

func TestConvert(t *testing.T) {
	c := NewRateCache(map[string]float64{"USD": 1.5, "GBP": 0.75})
	tests := []struct {
		currency string
		want     float64
	}{{"USD", 15}, {"GBP", 7.5}, {"JPY", 10}}
	for _, tt := range tests {
		if got := c.Convert(10, tt.currency); got != tt.want {
			t.Errorf("%s = %v, want %v", tt.currency, got, tt.want)
		}
	}
}
