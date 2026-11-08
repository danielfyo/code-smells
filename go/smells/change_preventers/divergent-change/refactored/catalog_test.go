package refactored

import (
	"math"
	"testing"
)

func TestCatalog(t *testing.T) {
	products, err := ParseCSV("MUG;10\nBOOK-1;20\n")
	if err != nil {
		t.Fatal(err)
	}
	vat := VATPolicy{}
	for sku, want := range map[string]float64{"MUG": 12.1, "BOOK-1": 20.8} {
		p, err := Find(products, sku)
		if err != nil || math.Abs(vat.Gross(p)-want) > 1e-9 {
			t.Errorf("%s = %v, %v", sku, vat.Gross(p), err)
		}
	}
	if _, err := Find(products, "X"); err == nil {
		t.Error("expected unknown sku")
	}
	if got := ExportJSON(products); got != `[{"sku":"BOOK-1","price":20.00},{"sku":"MUG","price":10.00}]` {
		t.Errorf("json = %s", got)
	}
	for _, bad := range []string{"MUG", "MUG;abc", "A;1;2"} {
		if _, err := ParseCSV(bad); err == nil {
			t.Errorf("expected error for %q", bad)
		}
	}
}
