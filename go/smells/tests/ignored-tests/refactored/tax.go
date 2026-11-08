// Package refactored holds the production code (VAT per product category); the
// smell lives in the test file.
package refactored

// VATPercent returns the VAT that applies to a product category.
func VATPercent(category string) int {
	switch category {
	case "food":
		return 10
	case "books", "medicine":
		return 4
	default:
		return 21
	}
}
