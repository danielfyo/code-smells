// Package refactored encapsulates state in a value that is created and passed
// explicitly: each caller (and each test) has its own.
package refactored

// DefaultVATPercent is the standard VAT (a constant, not a variable).
const DefaultVATPercent int64 = 21

// TaxCalculator computes prices with a specific VAT.
//
// REFACTOR: Replace Global Variable with Instance Field / dependency
// injection. With no shared state, tests can run in parallel.
type TaxCalculator struct {
	vatPercent int64
}

// NewTaxCalculator creates a calculator with the given VAT.
func NewTaxCalculator(vatPercent int64) TaxCalculator {
	return TaxCalculator{vatPercent: vatPercent}
}

// GrossPrice returns the price with VAT.
func (c TaxCalculator) GrossPrice(netCents int64) int64 {
	return netCents + netCents*c.vatPercent/100
}
