// Package refactored fixes Divergent Change by moving each axis of change
// into its own piece: a parser, a tax policy and an exporter. Each change
// affects a single type/function.
package refactored

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

// Product is the data shared by the pieces.
type Product struct {
	SKU   string
	Price float64
}

// ParseCSV understands the supplier format.
// REFACTOR: Split Phase / Extract Function (axis of change #1).
func ParseCSV(data string) ([]Product, error) {
	var out []Product
	for _, line := range strings.Split(strings.TrimSpace(data), "\n") {
		sku, raw, ok := strings.Cut(line, ";")
		if !ok || strings.Contains(raw, ";") {
			return nil, fmt.Errorf("bad line %q", line)
		}
		p, err := strconv.ParseFloat(raw, 64)
		if err != nil {
			return nil, fmt.Errorf("bad price in %q: %w", line, err)
		}
		out = append(out, Product{sku, p})
	}
	return out, nil
}

// VATPolicy encapsulates the tax regulations.
// REFACTOR: Extract Class (axis of change #2).
type VATPolicy struct{}

// Rate returns the applicable rate.
func (VATPolicy) Rate(sku string) float64 {
	if strings.HasPrefix(sku, "BOOK") {
		return 0.04
	}
	return 0.21
}

// Gross returns the price including VAT.
func (v VATPolicy) Gross(p Product) float64 { return p.Price * (1 + v.Rate(p.SKU)) }

// ExportJSON only knows the output format.
// REFACTOR: Extract Function (axis of change #3).
func ExportJSON(products []Product) string {
	sorted := append([]Product(nil), products...)
	sort.Slice(sorted, func(i, j int) bool { return sorted[i].SKU < sorted[j].SKU })
	items := make([]string, len(sorted))
	for i, p := range sorted {
		items[i] = fmt.Sprintf(`{"sku":%q,"price":%.2f}`, p.SKU, p.Price)
	}
	return "[" + strings.Join(items, ",") + "]"
}

// Find looks up a product by SKU.
func Find(products []Product, sku string) (Product, error) {
	for _, p := range products {
		if p.SKU == sku {
			return p, nil
		}
	}
	return Product{}, fmt.Errorf("unknown sku %q", sku)
}
