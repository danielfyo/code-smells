package smelly

import "testing"

func TestVATPercentGeneral(t *testing.T) {
	if VATPercent("electronics") != 21 {
		t.Fatal("general rate should be 21")
	}
}

// SMELL: test skipped with no documented reason, no ticket and no date. It
// has been like this for months; nobody knows whether it still fails or the
// behavior it covers broke. Meanwhile the reduced rates are untested.
func TestVATPercentReduced(t *testing.T) {
	t.Skip("fails sometimes, will look later")
	if VATPercent("food") != 10 || VATPercent("books") != 4 {
		t.Fatal("reduced rates are wrong")
	}
}
