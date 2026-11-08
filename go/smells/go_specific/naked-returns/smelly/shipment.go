// Package smelly uses naked returns in a long function with named results:
// at each return you cannot tell what is being returned.
package smelly

import (
	"errors"
	"strings"
)

// Quote computes the cost and delivery time of a shipment.
//
// SMELL: named results + bare "return" in a function with many branches. To
// know what each return yields you must trace which variables were touched
// before, and it is easy to return a half-computed value.
func Quote(country string, weightKg int, express bool) (cost int64, days int, err error) {
	country = strings.ToUpper(strings.TrimSpace(country))
	if weightKg <= 0 {
		err = errors.New("weight must be positive")
		return
	}
	switch country {
	case "ES":
		cost = 400
		days = 2
	case "FR", "PT", "DE":
		cost = 900
		days = 4
	default:
		err = errors.New("unsupported country " + country)
		return
	}
	if weightKg > 5 {
		cost += int64(weightKg-5) * 100
	}
	if express {
		cost *= 2
		days = (days + 1) / 2
		if days < 1 {
			days = 1
		}
		return
	}
	if weightKg > 20 {
		days++
	}
	return
}
