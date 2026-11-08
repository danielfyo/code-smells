package smelly

import "testing"

func TestExports(t *testing.T) {
	sales := []Sale{{"tea", 3}, {"coffee", 5}}
	stock := []StockItem{{"T-1", 40}}
	tests := []struct{ name, got, want string }{
		{"sales csv", ExportSalesCSV(sales), "product,units\ntea,3\ncoffee,5\n"},
		{"sales md", ExportSalesMarkdown(sales), "| product | units |\n| tea | 3 |\n| coffee | 5 |\n"},
		{"stock csv", ExportStockCSV(stock), "sku,quantity\nT-1,40\n"},
		{"stock md", ExportStockMarkdown(stock), "| sku | quantity |\n| T-1 | 40 |\n"},
	}
	for _, tt := range tests {
		if tt.got != tt.want {
			t.Errorf("%s = %q", tt.name, tt.got)
		}
	}
}
