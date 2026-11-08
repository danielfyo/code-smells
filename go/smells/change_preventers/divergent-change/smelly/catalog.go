// Package smelly illustrates Divergent Change: the Catalog struct changes for
// unrelated reasons (input file format, tax rules, export format). Every
// team ends up editing the same type.
package smelly

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

// Catalog mixes parsing, pricing and exporting.
// SMELL: Divergent Change. Three axes of change in a single type.
type Catalog struct {
	prices map[string]float64
}

// LoadCSV loads "sku;price" lines.
// Reason to change #1: the supplier format.
func (c *Catalog) LoadCSV(data string) error {
	c.prices = map[string]float64{}
	for _, line := range strings.Split(strings.TrimSpace(data), "\n") {
		parts := strings.Split(line, ";")
		if len(parts) != 2 {
			return fmt.Errorf("bad line %q", line)
		}
		p, err := strconv.ParseFloat(parts[1], 64)
		if err != nil {
			return fmt.Errorf("bad price in %q: %w", line, err)
		}
		c.prices[parts[0]] = p
	}
	return nil
}

// PriceWithVAT returns the price including VAT.
// Reason to change #2: tax regulations.
func (c *Catalog) PriceWithVAT(sku string) (float64, error) {
	p, ok := c.prices[sku]
	if !ok {
		return 0, fmt.Errorf("unknown sku %q", sku)
	}
	if strings.HasPrefix(sku, "BOOK") {
		return p * 1.04, nil
	}
	return p * 1.21, nil
}

// ExportJSON exports the catalog.
// Reason to change #3: the format the frontend asks for.
func (c *Catalog) ExportJSON() string {
	skus := make([]string, 0, len(c.prices))
	for s := range c.prices {
		skus = append(skus, s)
	}
	sort.Strings(skus)
	items := make([]string, len(skus))
	for i, s := range skus {
		items[i] = fmt.Sprintf(`{"sku":%q,"price":%.2f}`, s, c.prices[s])
	}
	return "[" + strings.Join(items, ",") + "]"
}
