// Package refactored moves each language into its own file (SQL, HTML
// template; CSS and JS as static assets) and embeds them. Go only orchestrates.
package refactored

import (
	"bytes"
	"embed"
	"html/template"
	"strings"
)

// REFACTOR: each language lives in its own file, with its own highlighting
// and tooling; embed packs them into the binary.
//
//go:embed templates/report.html templates/low_stock.sql
var files embed.FS

var reportTemplate = template.Must(template.ParseFS(files, "templates/report.html"))

// Product is a report row.
type Product struct {
	Name  string
	Stock int
}

// LowStockQuery returns the parameterized query; the threshold is passed to
// the driver as an argument, not concatenated into the SQL.
func LowStockQuery() string {
	q, _ := files.ReadFile("templates/low_stock.sql") // embedded: cannot fail
	return strings.TrimSpace(string(q))
}

// RenderReport renders the HTML with html/template (which also escapes).
func RenderReport(products []Product) (string, error) {
	var buf bytes.Buffer
	if err := reportTemplate.Execute(&buf, products); err != nil {
		return "", err
	}
	return buf.String(), nil
}
