package smelly

import "testing"

func TestBuildInfoDefault(t *testing.T) {
	if got := BuildInfo(); got != "shop-api dev" {
		t.Fatalf("BuildInfo() = %q", got)
	}
}
