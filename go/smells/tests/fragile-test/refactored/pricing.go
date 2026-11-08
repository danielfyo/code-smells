// Package refactored holds the production code (price calculation with a cache);
// the smell lives in the test file.
package refactored

// PriceList computes discounted prices and caches the results.
type PriceList struct {
	base  map[string]int64
	cache map[string]int64
}

// NewPriceList creates the list with the base prices.
func NewPriceList(base map[string]int64) *PriceList {
	return &PriceList{base: base, cache: map[string]int64{}}
}

// Price returns the item price with a 10 % quantity discount from 10 units
// upwards.
func (p *PriceList) Price(sku string, qty int) int64 {
	unit, ok := p.cache[sku]
	if !ok {
		unit = p.base[sku]
		p.cache[sku] = unit
	}
	total := unit * int64(qty)
	if qty >= 10 {
		total = applyDiscount(total)
	}
	return total
}

func applyDiscount(total int64) int64 { return total - total/10 }
