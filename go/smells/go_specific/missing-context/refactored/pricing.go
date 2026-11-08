// Package refactored propagates context.Context as the first parameter and
// honors its cancellation and deadline.
package refactored

import (
	"context"
	"time"
)

// PriceService simulates a slow external service.
type PriceService struct {
	Latency time.Duration
}

// FetchPrice returns the price, or the context error if cancelled earlier.
//
// REFACTOR: Add Parameter (ctx context.Context) as the first argument, by
// convention; the wait is a select on ctx.Done().
func (s PriceService) FetchPrice(ctx context.Context, sku string) (int64, error) {
	timer := time.NewTimer(s.Latency)
	defer timer.Stop()
	select {
	case <-timer.C:
		return int64(len(sku)) * 100, nil
	case <-ctx.Done():
		return 0, ctx.Err()
	}
}
