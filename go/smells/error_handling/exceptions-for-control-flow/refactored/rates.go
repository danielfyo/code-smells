// Package refactored fixes Exceptions for Control Flow by handling the
// expected case with an explicit condition (the "comma ok" idiom). panic is
// reserved for genuine programming errors.
package refactored

// RateCache stores exchange rates.
type RateCache struct{ rates map[string]float64 }

// NewRateCache creates the cache.
func NewRateCache(r map[string]float64) *RateCache { return &RateCache{rates: r} }

// Rate returns the rate and whether it exists.
// REFACTOR: Replace Exception with Test (comma ok).
func (c *RateCache) Rate(currency string) (float64, bool) {
	r, ok := c.rates[currency]
	return r, ok
}

// Convert converts euros into another currency; uses 1.0 if there is no rate.
func (c *RateCache) Convert(eur float64, currency string) float64 {
	rate, ok := c.Rate(currency)
	if !ok {
		return eur
	}
	return eur * rate
}
