// Package smelly illustrates Exceptions for Control Flow adapted to Go: using
// panic/recover for an expected case (a currency missing from the cache).
// The normal flow is hidden in a defer and any other real panic is
// swallowed too.
package smelly

import "fmt"

// RateCache stores exchange rates.
type RateCache struct{ rates map[string]float64 }

// NewRateCache creates the cache.
func NewRateCache(r map[string]float64) *RateCache { return &RateCache{rates: r} }

// mustRate panics if the currency is not found.
// SMELL: "not found" is a normal case, not an exceptional one.
func (c *RateCache) mustRate(currency string) float64 {
	r, ok := c.rates[currency]
	if !ok {
		panic(fmt.Sprintf("rate %s missing", currency))
	}
	return r
}

// Convert converts euros into another currency; uses 1.0 if there is no rate.
// SMELL: Exceptions for Control Flow. The alternative path lives in recover.
func (c *RateCache) Convert(eur float64, currency string) (result float64) {
	defer func() {
		if recover() != nil {
			result = eur
		}
	}()
	return eur * c.mustRate(currency)
}
