package refactored

import "testing"

func TestGrossPriceDefault(t *testing.T) {
	t.Parallel()
	if NewTaxCalculator(DefaultVATPercent).GrossPrice(1000) != 1210 {
		t.Fatal("default VAT")
	}
}

func TestGrossPriceReduced(t *testing.T) {
	t.Parallel()
	if NewTaxCalculator(10).GrossPrice(1000) != 1100 {
		t.Fatal("reduced VAT")
	}
}
