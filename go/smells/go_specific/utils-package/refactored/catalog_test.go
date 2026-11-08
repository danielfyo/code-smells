package refactored

import "testing"

func TestProductCard(t *testing.T) {
	if got := ProductCard("Green  Tea Deluxe", 1250); got != "/p/green-tea-deluxe | 12.50 EUR" {
		t.Fatalf("got %q", got)
	}
}
