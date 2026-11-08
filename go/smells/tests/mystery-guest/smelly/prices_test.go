package smelly

import (
	"os"
	"testing"
)

// SMELL: the test depends on testdata/prices.csv, a "mystery guest". Reading
// the test you cannot tell what the file holds or why the expected result is
// 375; if someone edits the CSV for another test, this one breaks.
func TestParsePrices(t *testing.T) {
	f, err := os.Open("testdata/prices.csv")
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	prices, err := ParsePrices(f)
	if err != nil {
		t.Fatal(err)
	}
	if len(prices) != 3 || prices["coffee"] != 375 {
		t.Fatalf("prices = %v", prices)
	}
}
