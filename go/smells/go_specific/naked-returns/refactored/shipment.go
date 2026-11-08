// Package refactored returns explicit values on every return and extracts
// parts of the calculation into small functions.
package refactored

import (
	"fmt"
	"strings"
)

type zone struct {
	baseCents int64
	days      int
}

var zones = map[string]zone{
	"ES": {400, 2},
	"FR": {900, 4}, "PT": {900, 4}, "DE": {900, 4},
}

// Quote computes the cost and delivery time of a shipment.
//
// REFACTOR: explicit returns (each exit states what it returns) and Extract
// Function for the weight surcharge and the express variant. Named results
// are only justified in short functions or as documentation.
func Quote(country string, weightKg int, express bool) (int64, int, error) {
	country = strings.ToUpper(strings.TrimSpace(country))
	if weightKg <= 0 {
		return 0, 0, fmt.Errorf("quote: weight must be positive, got %d", weightKg)
	}
	z, ok := zones[country]
	if !ok {
		return 0, 0, fmt.Errorf("quote: unsupported country %s", country)
	}
	cost := z.baseCents + overweightSurcharge(weightKg)
	if express {
		return cost * 2, max((z.days+1)/2, 1), nil
	}
	days := z.days
	if weightKg > 20 {
		days++
	}
	return cost, days, nil
}

func overweightSurcharge(weightKg int) int64 {
	if weightKg <= 5 {
		return 0
	}
	return int64(weightKg-5) * 100
}
