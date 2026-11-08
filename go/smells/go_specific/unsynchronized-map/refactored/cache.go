// Package refactored protects the shared map with a sync.RWMutex.
package refactored

import "sync"

// PriceCache caches product prices and is safe for concurrent use.
//
// REFACTOR: an RWMutex guards the map (many concurrent readers, exclusive
// writers). For write-once/read-many keys sync.Map would also fit.
type PriceCache struct {
	mu     sync.RWMutex
	prices map[string]int64
}

// NewPriceCache creates an empty cache.
func NewPriceCache() *PriceCache { return &PriceCache{prices: map[string]int64{}} }

// Get returns the cached price.
func (c *PriceCache) Get(sku string) (int64, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	p, ok := c.prices[sku]
	return p, ok
}

// Set stores a price.
func (c *PriceCache) Set(sku string, cents int64) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.prices[sku] = cents
}
