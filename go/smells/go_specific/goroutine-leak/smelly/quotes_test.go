package smelly

import (
	"runtime"
	"testing"
	"time"
)

// Documents the bug: after the call some goroutines are still alive (blocked
// on the send). They will stay like that until the test process ends.
func TestFirstQuoteLeaksGoroutines(t *testing.T) {
	const n = 5
	suppliers := make([]Supplier, n)
	for i := range suppliers {
		suppliers[i] = func() int64 { return 100 }
	}
	before := runtime.NumGoroutine()
	if got := FirstQuote(suppliers); got != 100 {
		t.Fatalf("quote = %d", got)
	}
	time.Sleep(20 * time.Millisecond) // give all of them time to reach the send
	leaked := runtime.NumGoroutine() - before
	if leaked < n-2 { // margin for runtime goroutines that may finish
		t.Fatalf("expected about %d leaked goroutines, got %d", n-1, leaked)
	}
	t.Logf("goroutines filtradas: %d", leaked)
}
