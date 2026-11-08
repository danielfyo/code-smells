package refactored

import "testing"

func TestBuildInfoDefault(t *testing.T) {
	if got := BuildInfo(); got != "shop-api dev" {
		t.Fatalf("BuildInfo() = %q", got)
	}
}
