package smelly

import (
	"errors"
	"testing"
)

type failingWriter struct{}

func (failingWriter) Write([]byte) (int, error) { return 0, errors.New("disk full") }

func TestErrorsAreSilentlyIgnored(t *testing.T) {
	// Documents the bug: an invalid quantity silently becomes 0.
	if got := ParseLine("tea:ten"); got.Qty != 0 || got.SKU != "tea" {
		t.Fatalf("got %+v", got)
	}
	// And a write failure never reaches the caller (Export returns nothing).
	Export(failingWriter{}, []OrderLine{{"tea", 1}})
}
