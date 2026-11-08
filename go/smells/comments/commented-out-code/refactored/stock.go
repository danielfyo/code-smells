// Package refactored deletes the commented-out code: if it is ever needed
// again, it lives in the version control history.
package refactored

import "strings"

// Product is an inventory item.
type Product struct {
	SKU   string
	Stock int
}

// LowStock returns, normalized to upper case, the SKUs whose stock is below
// the threshold.
//
// REFACTOR: all commented-out code deleted (git remembers it for us); only
// the live logic remains.
func LowStock(products []Product, threshold int) []string {
	var result []string
	for _, p := range products {
		if p.Stock < threshold {
			result = append(result, strings.ToUpper(p.SKU))
		}
	}
	return result
}
