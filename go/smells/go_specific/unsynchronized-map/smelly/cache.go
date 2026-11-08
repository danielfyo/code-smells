// Package smelly reads and writes a map from several goroutines without any
// synchronization.
//
// The tests only use the cache from a single goroutine: running it
// concurrently is a data race that `go test -race` reports and that, even
// without -race, the runtime can abort with "fatal error: concurrent map
// writes" (it cannot be recovered). The racy code that demonstrates it lives
// in cache_race_example.go, behind the smelly_example build tag, so that it
// is never compiled into the normal suite.
package smelly

// PriceCache caches product prices.
//
// SMELL: a plain map shared by every HTTP handler (one goroutine per
// request) with no mutex. It works in single-threaded tests and breaks in
// production under load.
type PriceCache struct {
	prices map[string]int64
}

// NewPriceCache creates an empty cache.
func NewPriceCache() *PriceCache { return &PriceCache{prices: map[string]int64{}} }

// Get returns the cached price.
func (c *PriceCache) Get(sku string) (int64, bool) {
	p, ok := c.prices[sku] // SMELL: unsynchronized read
	return p, ok
}

// Set stores a price.
func (c *PriceCache) Set(sku string, cents int64) {
	c.prices[sku] = cents // SMELL: unsynchronized write
}
