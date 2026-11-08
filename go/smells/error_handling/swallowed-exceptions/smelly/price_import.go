// Package smelly illustrates Swallowed Exceptions / Afraid to Fail adapted
// to Go: parse errors are discarded with _ or "logged" and ignored, leaving
// prices at 0 in the catalog without anyone noticing.
package smelly

import (
	"log"
	"strconv"
	"strings"
)

// ImportPrices loads "sku=price" lines into the catalog.
// SMELL: Swallowed Errors. It never returns an error: the caller thinks all went well.
func ImportPrices(catalog map[string]float64, data string) {
	for _, line := range strings.Split(strings.TrimSpace(data), "\n") {
		sku, raw, ok := strings.Cut(line, "=")
		if !ok {
			log.Printf("skipping %q", line) // SMELL: logging and moving on is not handling
			continue
		}
		price, _ := strconv.ParseFloat(raw, 64) // SMELL: discarded error: price 0
		catalog[sku] = price
	}
}
