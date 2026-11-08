package smelly

import (
	"testing"
	"time"
)

func TestParseWeekday(t *testing.T) {
	if d, err := ParseWeekday("Monday"); err != nil || d != time.Monday {
		t.Fatalf("got %v, %v", d, err)
	}
	// Missing obvious behavior: we document that it fails.
	for _, in := range []string{"monday", "Mon", "MON"} {
		if _, err := ParseWeekday(in); err == nil {
			t.Fatalf("ParseWeekday(%q) unexpectedly succeeded", in)
		}
	}
}
