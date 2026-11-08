package smelly

import (
	"testing"
	"time"
)

func TestBuildStockRequest(t *testing.T) {
	r := BuildStockRequest("tea")
	if r.URL != "https://warehouse.internal.test/api/v2/stock/tea" || r.Timeout != 3*time.Second || r.Retries != 5 {
		t.Fatalf("got %+v", r)
	}
}
