package refactored

import "testing"

func TestReport(t *testing.T) {
	if got := Report([]Celsius{0, 21.5, -40}); got != "32.0F 70.7F -40.0F" {
		t.Errorf("got %q", got)
	}
	if got := Report(nil); got != "" {
		t.Errorf("empty = %q", got)
	}
}
