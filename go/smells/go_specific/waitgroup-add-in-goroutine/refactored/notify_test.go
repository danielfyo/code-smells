package refactored

import "testing"

func TestNotifyAllWaitsForEveryGoroutine(t *testing.T) {
	orders := make([]string, 100)
	for i := range orders {
		orders[i] = "order"
	}
	if got := NotifyAll(orders, func(string) {}); got != 100 {
		t.Fatalf("NotifyAll = %d, want 100", got)
	}
}
