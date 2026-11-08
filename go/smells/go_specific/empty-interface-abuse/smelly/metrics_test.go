package smelly

import "testing"

func TestSum(t *testing.T) {
	if got, err := Sum([]any{1, int64(2), 3.5}); err != nil || got != 6.5 {
		t.Fatalf("got %v, %v", got, err)
	}
	// Documents the problem: the compiler does not prevent this; it fails at run time.
	if _, err := Sum([]any{1, "two"}); err == nil {
		t.Fatal("expected runtime type error")
	}
}

func TestSettings(t *testing.T) {
	if (Settings{"max_items": 10}).MaxItems() != 10 {
		t.Fatal("max items")
	}
	// A wrong type silently becomes 0.
	if (Settings{"max_items": "10"}).MaxItems() != 0 {
		t.Fatal("expected silent zero")
	}
}
