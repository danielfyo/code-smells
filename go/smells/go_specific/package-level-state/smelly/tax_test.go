package smelly

import "testing"

// SMELL demonstrated: the test must save and restore the global and cannot
// use t.Parallel(), because other tests read the same value.
func TestGrossPrice(t *testing.T) {
	if GrossPrice(1000) != 1210 {
		t.Fatal("default VAT")
	}
	old := vatPercent
	t.Cleanup(func() { SetVATPercent(old) })
	SetVATPercent(10)
	if GrossPrice(1000) != 1100 {
		t.Fatal("reduced VAT")
	}
}
