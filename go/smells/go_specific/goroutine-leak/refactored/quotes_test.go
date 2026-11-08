package refactored

import (
	"context"
	"runtime"
	"testing"
	"time"
)

func TestFirstQuoteDoesNotLeak(t *testing.T) {
	fast := func(context.Context) (int64, error) { return 100, nil }
	slow := func(ctx context.Context) (int64, error) {
		select {
		case <-ctx.Done(): // exits as soon as it is cancelled
			return 0, ctx.Err()
		case <-time.After(time.Minute):
			return 999, nil
		}
	}
	before := runtime.NumGoroutine()
	got, err := FirstQuote(context.Background(), []Supplier{fast, slow, slow, slow})
	if err != nil || got != 100 {
		t.Fatalf("got %d, %v", got, err)
	}
	// The slow goroutines end after cancellation: wait for the count to go
	// back to its initial level (with a generous limit).
	deadline := time.Now().Add(2 * time.Second)
	for runtime.NumGoroutine() > before {
		if time.Now().After(deadline) {
			t.Fatalf("goroutines leaked: before=%d now=%d", before, runtime.NumGoroutine())
		}
		time.Sleep(5 * time.Millisecond)
	}
}
