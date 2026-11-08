// Package refactored scales name length with scope: descriptive names for
// long-lived things, single letters only in two-line loops.
package refactored

import (
	"fmt"
	"strings"
)

// VATPercent is the VAT applied to sales.
//
// REFACTOR: Rename Variable; anything visible package-wide gets a full name.
const VATPercent int64 = 21

// Sale is a sale.
type Sale struct {
	Region string
	Cents  int64
}

// Summary groups sales by region (in order of appearance), applies VAT and
// formats the report.
func Summary(sales []Sale) string {
	netByRegion := map[string]int64{}
	var regions []string
	for _, s := range sales {
		if _, seen := netByRegion[s.Region]; !seen {
			regions = append(regions, s.Region)
		}
		netByRegion[s.Region] += s.Cents
	}

	var report strings.Builder
	var grandTotal int64
	for _, region := range regions {
		gross := withVAT(netByRegion[region])
		grandTotal += gross
		fmt.Fprintf(&report, "%s=%d;", region, gross)
	}
	fmt.Fprintf(&report, "total=%d", grandTotal)
	return report.String()
}

func withVAT(net int64) int64 { return net + net*VATPercent/100 }
