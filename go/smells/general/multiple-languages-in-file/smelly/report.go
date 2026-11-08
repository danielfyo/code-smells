// Package smelly mixes Go, SQL and HTML (with inline CSS and JS) in the same
// source file.
package smelly

import (
	"fmt"
	"html"
	"strings"
)

// Product is a report row.
type Product struct {
	Name  string
	Stock int
}

// LowStockQuery SMELL: SQL embedded as a string in a Go file: no highlighting,
// no validation and hard to review for database people.
func LowStockQuery(threshold int) string {
	return "SELECT name, stock FROM products WHERE stock < " + fmt.Sprint(threshold) + " ORDER BY name"
}

// RenderReport SMELL: HTML, CSS and JavaScript built by hand inside Go code.
// Four languages in one file; no designer will ever touch it.
func RenderReport(products []Product) string {
	var b strings.Builder
	b.WriteString(`<html><head><style>td.low{color:red}</style>`)
	b.WriteString(`<script>function hi(){alert("low stock")}</script></head><body><table>`)
	for _, p := range products {
		b.WriteString(`<tr><td class="low" onclick="hi()">` + html.EscapeString(p.Name) + `</td><td>` + fmt.Sprint(p.Stock) + `</td></tr>`)
	}
	b.WriteString(`</table></body></html>`)
	return b.String()
}
