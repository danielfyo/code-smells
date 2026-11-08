package smelly

import "testing"

func TestProc(t *testing.T) {
	data := []D{{"o1", 1000, false}, {"o2", 500, true}, {"o3", 250, false}}
	if got := Proc(data); got != 1250 {
		t.Fatalf("Proc = %d, want 1250", got)
	}
}
