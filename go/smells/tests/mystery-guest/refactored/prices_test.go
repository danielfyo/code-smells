package refactored

import (
	"strings"
	"testing"
)

// REFACTOR: Inline Resource. The test data is in plain sight, next to the
// assertion that depends on it; no shared external files.
func TestParsePrices(t *testing.T) {
	const csv = "tea,250\ncoffee,375\nmilk,99\n"
	prices, err := ParsePrices(strings.NewReader(csv))
	if err != nil {
		t.Fatal(err)
	}
	if len(prices) != 3 || prices["coffee"] != 375 {
		t.Fatalf("prices = %v", prices)
	}
}

func TestParsePricesRejectsNonNumeric(t *testing.T) {
	if _, err := ParsePrices(strings.NewReader("tea,cheap\n")); err == nil {
		t.Fatal("expected error for non-numeric price")
	}
}
