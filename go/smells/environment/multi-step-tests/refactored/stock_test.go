package refactored

import "testing"

func TestReserve(t *testing.T) {
	if left, ok := Reserve(5, 2); !ok || left != 3 {
		t.Fatalf("Reserve(5, 2) = %d, %v", left, ok)
	}
	if _, ok := Reserve(1, 2); ok {
		t.Fatal("Reserve(1, 2) should fail")
	}
}
