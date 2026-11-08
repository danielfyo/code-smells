package refactored

import (
	"testing"
	"time"
)

type fixedClock time.Time

func (f fixedClock) Now() time.Time { return time.Time(f) }

func at(hour int) Clock { return fixedClock(time.Date(2026, 1, 1, hour, 0, 0, 0, time.UTC)) }

func TestPrice(t *testing.T) {
	prices := PriceList{"beer": 3.0, "soda": 2.0}
	tests := []struct {
		hour  int
		drink string
		want  float64
		found bool
	}{
		{12, "beer", 3.0, true},
		{18, "beer", 1.5, true},
		{19, "soda", 1.0, true},
		{20, "soda", 2.0, true},
		{19, "wine", 0, false},
	}
	for _, tt := range tests {
		got, ok := Bar{Clock: at(tt.hour), Prices: prices}.Price(tt.drink)
		if got != tt.want || ok != tt.found {
			t.Errorf("%dh %s = %v,%v", tt.hour, tt.drink, got, ok)
		}
	}
	if _, ok := (Bar{Clock: SystemClock{}, Prices: prices}).Price("beer"); !ok {
		t.Error("system clock bar should price beer")
	}
}
