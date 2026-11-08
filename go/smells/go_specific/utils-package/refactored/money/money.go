// Package money formats and operates on monetary amounts.
//
// REFACTOR: Move Function into a cohesive package with a domain name; the
// caller reads money.Format, which explains itself.
package money

import "fmt"

// Format formats cents as euros ("12.50 EUR").
func Format(cents int64) string { return fmt.Sprintf("%d.%02d EUR", cents/100, cents%100) }
