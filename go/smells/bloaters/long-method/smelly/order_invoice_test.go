package smelly

import (
	"strings"
	"testing"
)

func TestBuildInvoice(t *testing.T) {
	lines := []Line{{SKU: "BOOK", Quantity: 2, Price: 100}, {SKU: "PEN", Quantity: 4, Price: 100}}
	tests := []struct {
		name      string
		customer  string
		lines     []Line
		vip       bool
		wantTotal string
		wantErr   bool
	}{
		{"bulk discount", "Ana", lines, false, "Total: 689.70", false},
		{"vip discount", "Ana", lines, true, "Total: 653.40", false},
		{"no discount", "Ana", lines[:1], false, "Total: 242.00", false},
		{"missing customer", " ", lines, false, "", true},
		{"no lines", "Ana", nil, false, "", true},
		{"bad quantity", "Ana", []Line{{SKU: "X", Quantity: 0, Price: 1}}, false, "", true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := BuildInvoice(tt.customer, tt.lines, tt.vip)
			if (err != nil) != tt.wantErr {
				t.Fatalf("err = %v, wantErr %v", err, tt.wantErr)
			}
			if !strings.Contains(got, tt.wantTotal) {
				t.Errorf("invoice %q does not contain %q", got, tt.wantTotal)
			}
		})
	}
}
