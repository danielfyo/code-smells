package smelly

import "testing"

func TestCalculateFirstCall(t *testing.T) {
	tests := []struct {
		tier string
		in   []int
		want int
	}{
		{"standard", []int{10, 20}, 30},
		{"gold", []int{10, 20}, 60},
		{"gold", []int{30, 20}, 150},
	}
	for _, tt := range tests {
		c := &PointsCalculator{Tier: tt.tier}
		if got := c.Calculate(tt.in); got != tt.want {
			t.Errorf("%s %v = %d, want %d", tt.tier, tt.in, got, tt.want)
		}
	}
}

// Documents the bug: temporary fields carry state over.
func TestCalculateLeaksState(t *testing.T) {
	c := &PointsCalculator{Tier: "standard"}
	c.Calculate([]int{10})
	if got := c.Calculate([]int{10}); got != 20 {
		t.Errorf("second call = %d; the smelly version accumulates (20)", got)
	}
}
