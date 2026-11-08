package refactored

import (
	"testing"
	"time"
)

func TestBuildStockRequest(t *testing.T) {
	r := NewStockClient(DefaultConfig()).BuildStockRequest("tea")
	if r.URL != "https://warehouse.internal.test/api/v2/stock/tea" || r.Timeout != 3*time.Second || r.Retries != 5 {
		t.Fatalf("got %+v", r)
	}
	staging := Config{BaseURL: "https://staging.test/api", Timeout: time.Second, Retries: 1}
	if got := NewStockClient(staging).BuildStockRequest("tea").URL; got != "https://staging.test/api/stock/tea" {
		t.Fatalf("url = %q", got)
	}
}
