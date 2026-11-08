// Package smelly shows commented-out code that nobody dares to delete.
package smelly

import "strings"

// Product is an inventory item.
type Product struct {
	SKU   string
	Stock int
}

// LowStock returns the SKUs whose stock is below the threshold.
func LowStock(products []Product, threshold int) []string {
	var result []string
	for _, p := range products {
		// SMELL: commented-out code. Is it an old version? A half-baked idea?
		// Should it be re-enabled? Nobody knows, and everybody drags it along.
		// if p.Stock == 0 {
		//     notifyPurchasing(p.SKU)
		//     continue
		// }
		if p.Stock < threshold {
			result = append(result, strings.ToUpper(p.SKU))
		}
		// result = append(result, p.SKU) // old version
	}
	// sort.Strings(result)
	// log.Printf("low stock: %v", result)
	return result
}
