package refactored

import "testing"

func TestCalculate(t *testing.T) {
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
		c := PointsCalculator{Tier: tt.tier}
		if got := c.Calculate(tt.in); got != tt.want {
			t.Errorf("%s %v = %d, want %d", tt.tier, tt.in, got, tt.want)
		}
	}
}

func TestCalculateIsIndependent(t *testing.T) {
	c := PointsCalculator{Tier: "standard"}
	c.Calculate([]int{10})
	if got := c.Calculate([]int{10}); got != 10 {
		t.Errorf("second call = %d, want 10", got)
	}
}
