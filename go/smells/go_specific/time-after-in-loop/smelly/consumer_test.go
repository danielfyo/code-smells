package smelly

import (
	"slices"
	"testing"
	"time"
)

func TestDrainStopsWhenIdle(t *testing.T) {
	orders := make(chan string, 3)
	orders <- "A1"
	orders <- "A2"
	orders <- "A3"
	got := Drain(orders, 20*time.Millisecond) // channel left open: ends by inactivity
	if !slices.Equal(got, []string{"A1", "A2", "A3"}) {
		t.Fatalf("got %v", got)
	}
}

func TestDrainStopsWhenClosed(t *testing.T) {
	orders := make(chan string, 1)
	orders <- "A1"
	close(orders)
	if got := Drain(orders, time.Hour); !slices.Equal(got, []string{"A1"}) {
		t.Fatalf("got %v", got)
	}
}
