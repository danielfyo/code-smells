// Package smelly buries configuration data (URL, retries, timeout) deep
// inside the code.
package smelly

import (
	"fmt"
	"time"
)

// Request describes a request ready to be sent.
type Request struct {
	URL     string
	Timeout time.Duration
	Retries int
}

// BuildStockRequest prepares the stock query.
//
// SMELL: production URL, timeout and retries buried here. Testing against
// staging or tuning the timeout means digging in and recompiling.
func BuildStockRequest(sku string) Request {
	return Request{
		URL:     fmt.Sprintf("https://warehouse.internal.test/api/v2/stock/%s", sku),
		Timeout: 3 * time.Second,
		Retries: 5,
	}
}
