// Package refactored lifts configuration to the top level: a Config with
// defaults that application startup can override.
package refactored

import (
	"fmt"
	"time"
)

// Config groups the configurable parameters of the warehouse client.
//
// REFACTOR: Introduce Parameter Object; configuration is injected from above
// (main, flags, environment) instead of living in low-level code.
type Config struct {
	BaseURL string
	Timeout time.Duration
	Retries int
}

// DefaultConfig returns the default configuration.
func DefaultConfig() Config {
	return Config{BaseURL: "https://warehouse.internal.test/api/v2", Timeout: 3 * time.Second, Retries: 5}
}

// Request describes a request ready to be sent.
type Request struct {
	URL     string
	Timeout time.Duration
	Retries int
}

// StockClient builds requests from its configuration.
type StockClient struct{ cfg Config }

// NewStockClient creates a client with the given configuration.
func NewStockClient(cfg Config) StockClient { return StockClient{cfg: cfg} }

// BuildStockRequest prepares the stock query.
func (c StockClient) BuildStockRequest(sku string) Request {
	return Request{
		URL:     fmt.Sprintf("%s/stock/%s", c.cfg.BaseURL, sku),
		Timeout: c.cfg.Timeout,
		Retries: c.cfg.Retries,
	}
}
