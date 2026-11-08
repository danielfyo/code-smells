package smelly

import (
	"math"
	"testing"
)

func TestCatalog(t *testing.T) {
	var c Catalog
	if err := c.LoadCSV("MUG;10\nBOOK-1;20\n"); err != nil {
		t.Fatal(err)
	}
	for sku, want := range map[string]float64{"MUG": 12.1, "BOOK-1": 20.8} {
		got, err := c.PriceWithVAT(sku)
		if err != nil || math.Abs(got-want) > 1e-9 {
			t.Errorf("%s = %v, %v", sku, got, err)
		}
	}
	if _, err := c.PriceWithVAT("X"); err == nil {
		t.Error("expected unknown sku")
	}
	if got := c.ExportJSON(); got != `[{"sku":"BOOK-1","price":20.00},{"sku":"MUG","price":10.00}]` {
		t.Errorf("json = %s", got)
	}
	if err := c.LoadCSV("MUG"); err == nil {
		t.Error("expected parse error")
	}
	if err := c.LoadCSV("MUG;abc"); err == nil {
		t.Error("expected price error")
	}
}
