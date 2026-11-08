package refactored

import "testing"

func TestOutstandingAmount(t *testing.T) {
	orders := []Order{{"o1", 1000, false}, {"o2", 500, true}, {"o3", 250, false}}
	if got := OutstandingAmount(orders); got != 1250 {
		t.Fatalf("OutstandingAmount = %d, want 1250", got)
	}
}
