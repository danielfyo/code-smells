// Package smelly illustrates Inappropriate Static adapted to Go: package
// functions that hide dependencies (the system clock and a global price
// table). They cannot be substituted, so the result depends on the real
// time and tests cannot pin it down.
package smelly

import "time"

// SMELL: global table readable and writable from anywhere.
var drinkPrices = map[string]float64{"beer": 3.0, "soda": 2.0}

// isHappyHour reads the system clock directly.
// SMELL: hidden dependency in a "static" function.
func isHappyHour() bool {
	h := time.Now().Hour()
	return h >= 18 && h < 20
}

// Price computes the price of a drink.
// SMELL: impossible to test the "happy hour" case deterministically.
func Price(drink string) (float64, bool) {
	p, ok := drinkPrices[drink]
	if !ok {
		return 0, false
	}
	if isHappyHour() {
		p *= 0.5
	}
	return p, true
}
