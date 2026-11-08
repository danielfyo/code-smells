//go:build integration

package refactored

import "testing"

// Integration test: only compiled with -tags integration.
func TestReserveIntegration(t *testing.T) {
	stock := 10
	for i := 0; i < 10; i++ {
		var ok bool
		if stock, ok = Reserve(stock, 1); !ok {
			t.Fatalf("reservation %d failed", i)
		}
	}
	if stock != 0 {
		t.Fatalf("stock = %d", stock)
	}
}
