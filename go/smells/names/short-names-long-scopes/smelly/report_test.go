package smelly

import "testing"

func TestSummary(t *testing.T) {
	sales := []Sale{{"north", 1000}, {"south", 200}, {"north", 1000}}
	if got := Summary(sales); got != "north=2420;south=242;total=2662" {
		t.Fatalf("Summary = %q", got)
	}
}
