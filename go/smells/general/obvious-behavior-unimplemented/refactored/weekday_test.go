package refactored

import (
	"testing"
	"time"
)

func TestParseWeekday(t *testing.T) {
	for _, in := range []string{"Monday", "monday", "Mon", "MON", " mon "} {
		if d, err := ParseWeekday(in); err != nil || d != time.Monday {
			t.Fatalf("ParseWeekday(%q) = %v, %v", in, d, err)
		}
	}
	if _, err := ParseWeekday("Funday"); err == nil {
		t.Fatal("expected error")
	}
}
