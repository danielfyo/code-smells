package refactored

import "testing"

func TestExports(t *testing.T) {
	sales := SalesTable([]Sale{{"tea", 3}, {"coffee", 5}})
	stock := StockTable([]StockItem{{"T-1", 40}})
	tests := []struct {
		name  string
		table Table
		f     Formatter
		want  string
	}{
		{"sales csv", sales, CSV{}, "product,units\ntea,3\ncoffee,5\n"},
		{"sales md", sales, Markdown{}, "| product | units |\n| tea | 3 |\n| coffee | 5 |\n"},
		{"stock csv", stock, CSV{}, "sku,quantity\nT-1,40\n"},
		{"stock md", stock, Markdown{}, "| sku | quantity |\n| T-1 | 40 |\n"},
	}
	for _, tt := range tests {
		if got := tt.f.Format(tt.table); got != tt.want {
			t.Errorf("%s = %q", tt.name, got)
		}
	}
}
