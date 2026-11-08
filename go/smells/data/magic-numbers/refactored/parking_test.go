package refactored

import (
	"testing"
	"time"
)

func TestFee(t *testing.T) {
	tests := []struct {
		minutes int
		plan    Plan
		want    float64
	}{
		{10, PlanVisitor, 0}, {15, PlanVisitor, 0}, {16, PlanVisitor, 2.5}, {120, PlanVisitor, 5},
		{180, PlanVisitor, 7.5}, {300, PlanVisitor, 11}, {24 * 60, PlanVisitor, 20}, {300, PlanResident, 0},
	}
	for _, tt := range tests {
		if got := Fee(time.Duration(tt.minutes)*time.Minute, tt.plan); got != tt.want {
			t.Errorf("Fee(%d,%s) = %v, want %v", tt.minutes, tt.plan, got, tt.want)
		}
	}
}
