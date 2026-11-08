package smelly

import "testing"

func TestFee(t *testing.T) {
	tests := []struct {
		minutes int
		plan    string
		want    float64
	}{
		{10, "V", 0}, {15, "V", 0}, {16, "V", 2.5}, {120, "V", 5},
		{180, "V", 7.5}, {300, "V", 11}, {24 * 60, "V", 20}, {300, "R", 0},
	}
	for _, tt := range tests {
		if got := Fee(tt.minutes, tt.plan); got != tt.want {
			t.Errorf("Fee(%d,%s) = %v, want %v", tt.minutes, tt.plan, got, tt.want)
		}
	}
}
