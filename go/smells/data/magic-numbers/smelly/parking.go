// Package smelly illustrates Magic Numbers / Magic Strings: a car park fee is
// full of unnamed literals (3, 2.5, 1.75, 20, "R") whose meaning you have
// to guess.
package smelly

import "math"

// Fee computes the price of a stay.
// SMELL: Magic Numbers. What is 3? And 20? What does "R" mean?
func Fee(minutes int, plan string) float64 {
	if plan == "R" {
		return 0
	}
	if minutes <= 15 {
		return 0
	}
	hours := math.Ceil(float64(minutes) / 60)
	fee := 0.0
	if hours <= 3 {
		fee = hours * 2.5
	} else {
		fee = 3*2.5 + (hours-3)*1.75
	}
	if fee > 20 {
		fee = 20
	}
	return fee
}
