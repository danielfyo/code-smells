// Package smelly shows one-letter names in wide scopes: package variables
// and long-function variables whose meaning gets lost.
package smelly

import (
	"fmt"
	"strings"
)

// SMELL: one-letter package variable; visible across the whole package with
// no hint of what it represents (it is the VAT percentage).
var V int64 = 21

// Sale is a sale.
type Sale struct {
	Region string
	Cents  int64
}

// Summary groups sales by region and formats a report.
func Summary(s []Sale) string {
	// SMELL: m, t, r, b live for the whole function; by the end nobody
	// remembers what each one was.
	m := map[string]int64{}
	var r []string
	for _, x := range s {
		if _, ok := m[x.Region]; !ok {
			r = append(r, x.Region)
		}
		m[x.Region] += x.Cents
	}
	var b strings.Builder
	var t int64
	for _, k := range r {
		g := m[k] + m[k]*V/100
		t += g
		fmt.Fprintf(&b, "%s=%d;", k, g)
	}
	fmt.Fprintf(&b, "total=%d", t)
	return b.String()
}
