package smelly

import (
	"strings"
	"testing"
)

func TestReport(t *testing.T) {
	if q := LowStockQuery(5); !strings.Contains(q, "stock < 5") {
		t.Fatalf("query = %q", q)
	}
	out := RenderReport([]Product{{"Tea <green>", 2}})
	if !strings.Contains(out, "<td class=\"low\" onclick=\"hi()\">Tea &lt;green&gt;</td><td>2</td>") {
		t.Fatalf("html = %s", out)
	}
}
