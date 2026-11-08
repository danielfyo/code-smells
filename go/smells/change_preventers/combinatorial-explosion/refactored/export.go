// Package refactored fixes Combinatorial Explosion by separating the two
// dimensions that varied together: data is converted into a generic table
// and each format knows how to render any table. N sources + M formats =
// N+M pieces instead of N×M.
package refactored

import (
	"strconv"
	"strings"
)

// Table is the shared intermediate representation.
type Table struct {
	Header []string
	Rows   [][]string
}

// Formatter renders a table. REFACTOR: Extract Interface (format dimension).
type Formatter interface{ Format(t Table) string }

// CSV is a format.
type CSV struct{}

// Format as CSV.
func (CSV) Format(t Table) string {
	var b strings.Builder
	for _, r := range append([][]string{t.Header}, t.Rows...) {
		b.WriteString(strings.Join(r, ",") + "\n")
	}
	return b.String()
}

// Markdown is another format.
type Markdown struct{}

// Format as Markdown.
func (Markdown) Format(t Table) string {
	var b strings.Builder
	for _, r := range append([][]string{t.Header}, t.Rows...) {
		b.WriteString("| " + strings.Join(r, " | ") + " |\n")
	}
	return b.String()
}

// Sale is a sale.
type Sale struct {
	Product string
	Units   int
}

// StockItem is an item in stock.
type StockItem struct {
	SKU      string
	Quantity int
}

// SalesTable turns sales into a table. REFACTOR: Split Phase (data dimension).
func SalesTable(sales []Sale) Table {
	t := Table{Header: []string{"product", "units"}}
	for _, s := range sales {
		t.Rows = append(t.Rows, []string{s.Product, strconv.Itoa(s.Units)})
	}
	return t
}

// StockTable turns stock into a table.
func StockTable(items []StockItem) Table {
	t := Table{Header: []string{"sku", "quantity"}}
	for _, i := range items {
		t.Rows = append(t.Rows, []string{i.SKU, strconv.Itoa(i.Quantity)})
	}
	return t
}
