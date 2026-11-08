// Package smelly illustrates Combinatorial Explosion: there is one function
// per combination of data source (sales, stock) and format (CSV, Markdown).
// With N sources and M formats you need N×M nearly identical functions.
package smelly

import (
	"fmt"
	"strings"
)

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

// SMELL: Combinatorial Explosion. 2 sources × 2 formats = 4 functions
// repeating the same structure; a third format would add two more.

// ExportSalesCSV exports sales as CSV.
func ExportSalesCSV(sales []Sale) string {
	var b strings.Builder
	b.WriteString("product,units\n")
	for _, s := range sales {
		fmt.Fprintf(&b, "%s,%d\n", s.Product, s.Units)
	}
	return b.String()
}

// ExportSalesMarkdown exports sales as Markdown.
func ExportSalesMarkdown(sales []Sale) string {
	var b strings.Builder
	b.WriteString("| product | units |\n")
	for _, s := range sales {
		fmt.Fprintf(&b, "| %s | %d |\n", s.Product, s.Units)
	}
	return b.String()
}

// ExportStockCSV exports stock as CSV.
func ExportStockCSV(items []StockItem) string {
	var b strings.Builder
	b.WriteString("sku,quantity\n")
	for _, i := range items {
		fmt.Fprintf(&b, "%s,%d\n", i.SKU, i.Quantity)
	}
	return b.String()
}

// ExportStockMarkdown exports stock as Markdown.
func ExportStockMarkdown(items []StockItem) string {
	var b strings.Builder
	b.WriteString("| sku | quantity |\n")
	for _, i := range items {
		fmt.Fprintf(&b, "| %s | %d |\n", i.SKU, i.Quantity)
	}
	return b.String()
}
