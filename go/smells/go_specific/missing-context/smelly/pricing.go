// Package smelly ignores context.Context: slow operations can be neither
// cancelled nor bounded by a timeout.
package smelly

import "time"

// PriceService simulates a slow external service.
type PriceService struct {
	Latency time.Duration
}

// FetchPrice SMELL: no ctx. If the HTTP client that originated the request is
// gone, or the server is shutting down, the operation runs to the end
// holding resources.
func (s PriceService) FetchPrice(sku string) int64 {
	time.Sleep(s.Latency)
	return int64(len(sku)) * 100
}
