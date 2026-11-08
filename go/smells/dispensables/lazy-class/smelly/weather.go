// Package smelly illustrates Lazy Class: types that do almost nothing (a
// stateless converter with a single method and a wrapper around a float)
// add indirection without adding value.
package smelly

import (
	"fmt"
	"strings"
)

// SMELL: Lazy Class. Empty struct with a single trivial method.
type FahrenheitConverter struct{}

// NewFahrenheitConverter is a constructor for something without state.
func NewFahrenheitConverter() *FahrenheitConverter { return &FahrenheitConverter{} }

// Convert turns Celsius into Fahrenheit.
func (FahrenheitConverter) Convert(c float64) float64 { return c*9/5 + 32 }

// SMELL: Lazy Class. A wrapper that only stores and returns a value.
type Reading struct{ value float64 }

// NewReading creates the reading.
func NewReading(v float64) Reading { return Reading{value: v} }

// Value returns the value.
func (r Reading) Value() float64 { return r.value }

// Report formats readings in Fahrenheit.
func Report(celsius []float64) string {
	conv := NewFahrenheitConverter()
	parts := make([]string, 0, len(celsius))
	for _, c := range celsius {
		r := NewReading(c)
		parts = append(parts, fmt.Sprintf("%.1fF", conv.Convert(r.Value())))
	}
	return strings.Join(parts, " ")
}
