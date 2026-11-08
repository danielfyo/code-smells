// Package refactored fixes Lazy Class by removing the types that added
// nothing: the conversion is a method of a type with real meaning, and the
// reading is simply a value.
package refactored

import (
	"fmt"
	"strings"
)

// Celsius gives meaning to the number.
// REFACTOR: Inline Class. What adds value is kept as a named type; the
// Reading wrapper and the stateless converter disappear.
type Celsius float64

// Fahrenheit converts the temperature.
func (c Celsius) Fahrenheit() float64 { return float64(c)*9/5 + 32 }

// Report formats readings in Fahrenheit.
func Report(readings []Celsius) string {
	parts := make([]string, 0, len(readings))
	for _, c := range readings {
		parts = append(parts, fmt.Sprintf("%.1fF", c.Fahrenheit()))
	}
	return strings.Join(parts, " ")
}
