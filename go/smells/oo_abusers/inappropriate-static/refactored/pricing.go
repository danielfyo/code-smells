// Package refactored fixes Inappropriate Static by turning package-level
// functions with hidden dependencies into a service with explicit,
// injectable dependencies (clock and price list).
package refactored

import "time"

// Clock abstracts the clock. REFACTOR: Extract Interface.
type Clock interface{ Now() time.Time }

// SystemClock uses the real time.
type SystemClock struct{}

// Now returns the current time.
func (SystemClock) Now() time.Time { return time.Now() }

// PriceList is an injectable value instead of a global variable.
type PriceList map[string]float64

// Bar computes prices.
// REFACTOR: Replace Static Function with Instance Method + dependency injection.
type Bar struct {
	Clock  Clock
	Prices PriceList
}

func (b Bar) isHappyHour() bool {
	h := b.Clock.Now().Hour()
	return h >= 18 && h < 20
}

// Price computes the price of a drink.
func (b Bar) Price(drink string) (float64, bool) {
	p, ok := b.Prices[drink]
	if !ok {
		return 0, false
	}
	if b.isHappyHour() {
		p *= 0.5
	}
	return p, true
}
