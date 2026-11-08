package refactored

import (
	"context"
	"errors"
	"testing"
	"time"
)

func TestFetchPrice(t *testing.T) {
	s := PriceService{Latency: 10 * time.Millisecond}
	if got, err := s.FetchPrice(context.Background(), "tea"); err != nil || got != 300 {
		t.Fatalf("got %d, %v", got, err)
	}
}

func TestFetchPriceHonoursTimeout(t *testing.T) {
	s := PriceService{Latency: time.Minute}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
	defer cancel()
	start := time.Now()
	if _, err := s.FetchPrice(ctx, "tea"); !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("err = %v", err)
	}
	if time.Since(start) > time.Second {
		t.Fatal("timeout was not honoured")
	}
}
