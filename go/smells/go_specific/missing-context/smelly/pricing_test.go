package smelly

import (
	"testing"
	"time"
)

func TestFetchPriceCannotBeCancelled(t *testing.T) {
	s := PriceService{Latency: 50 * time.Millisecond}
	start := time.Now()
	if got := s.FetchPrice("tea"); got != 300 {
		t.Fatalf("price = %d", got)
	}
	// Documents the problem: there is no way to abort early; it always waits.
	if time.Since(start) < 50*time.Millisecond {
		t.Fatal("expected the full latency")
	}
}
