package refactored

import (
	"strings"
	"testing"
)

func TestReport(t *testing.T) {
	if q := LowStockQuery(); !strings.Contains(q, "stock < ?") {
		t.Fatalf("query = %q", q)
	}
	out, err := RenderReport([]Product{{"Tea <green>", 2}})
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(out, "<td class=\"low\">Tea &lt;green&gt;</td><td>2</td>") {
		t.Fatalf("html = %s", out)
	}
}
