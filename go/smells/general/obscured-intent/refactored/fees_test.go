package refactored

import "testing"

func TestFee(t *testing.T) {
	if Fee(10000, false) != 200 || Fee(10000, true) != 400 || Fee(500, false) != 30 || Fee(500, true) != 60 {
		t.Fatal("unexpected fee")
	}
	if !IsWeekend(0) || !IsWeekend(6) || IsWeekend(3) {
		t.Fatal("unexpected weekend")
	}
}
