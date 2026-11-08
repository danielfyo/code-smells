// Package smelly uses mutable package variables: any code can change them
// and tests cannot run in parallel.
package smelly

// SMELL: mutable global state. Every use shares this value; a test that
// changes it affects the others, and modifying it from several goroutines is
// a data race.
var vatPercent int64 = 21

// SetVATPercent changes the global VAT.
func SetVATPercent(p int64) { vatPercent = p }

// GrossPrice returns the price with VAT.
func GrossPrice(netCents int64) int64 { return netCents + netCents*vatPercent/100 }
