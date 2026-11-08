package refactored

import (
	"bytes"
	"errors"
	"strconv"
	"testing"
)

var errDiskFull = errors.New("disk full")

type failingWriter struct{}

func (failingWriter) Write([]byte) (int, error) { return 0, errDiskFull }

func TestParseLine(t *testing.T) {
	if got, err := ParseLine("tea:3"); err != nil || got != (OrderLine{"tea", 3}) {
		t.Fatalf("got %+v, %v", got, err)
	}
	if _, err := ParseLine("tea:ten"); !errors.Is(err, strconv.ErrSyntax) {
		t.Fatalf("err = %v, want strconv.ErrSyntax", err)
	}
}

func TestExport(t *testing.T) {
	var buf bytes.Buffer
	if err := Export(&buf, []OrderLine{{"tea", 1}}); err != nil || buf.String() != `[{"sku":"tea","qty":1}]` {
		t.Fatalf("buf=%q err=%v", buf.String(), err)
	}
	if err := Export(failingWriter{}, nil); !errors.Is(err, errDiskFull) {
		t.Fatalf("err = %v", err)
	}
}
