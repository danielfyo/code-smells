// Package refactored guarantees that every goroutine ends: they are cancelled
// through context and the channel is buffered so stragglers never block.
package refactored

import "context"

// Supplier returns a price from a supplier; it must honor ctx.
type Supplier func(ctx context.Context) (int64, error)

// FirstQuote returns the first price received and cancels the rest.
//
// REFACTOR: (1) context.WithCancel to notify slow suppliers; (2) a channel
// buffered to len(suppliers): no send can block even if nobody reads it.
// Every goroutine has a guaranteed exit path.
func FirstQuote(ctx context.Context, suppliers []Supplier) (int64, error) {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	type result struct {
		cents int64
		err   error
	}
	results := make(chan result, len(suppliers))
	for _, s := range suppliers {
		go func() {
			c, err := s(ctx)
			results <- result{c, err}
		}()
	}
	select {
	case r := <-results:
		return r.cents, r.err
	case <-ctx.Done():
		return 0, ctx.Err()
	}
}
