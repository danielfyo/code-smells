package slug

import "testing"

func TestMake(t *testing.T) {
	if got := Make("  Green  Tea "); got != "green-tea" {
		t.Fatalf("Make = %q", got)
	}
}
