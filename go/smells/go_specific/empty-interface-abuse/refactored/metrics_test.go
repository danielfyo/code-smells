package refactored

import "testing"

func TestSum(t *testing.T) {
	if got := Sum([]float64{1, 2, 3.5}); got != 6.5 {
		t.Fatalf("Sum(float64) = %v", got)
	}
	if got := Sum([]int{1, 2, 3}); got != 6 {
		t.Fatalf("Sum(int) = %v", got)
	}
	// Sum([]string{"a"}) would not compile: the error is caught before running.
}

func TestSettings(t *testing.T) {
	if (Settings{MaxItems: 10}).MaxItems != 10 {
		t.Fatal("max items")
	}
}
