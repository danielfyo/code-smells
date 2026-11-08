package refactored

import (
	"errors"
	"fmt"
	"testing"
)

func TestWrappingIsPreserved(t *testing.T) {
	err := Pay("A1", 20000)
	if err == nil || err.Error() != "pay order A1: card declined" {
		t.Fatalf("err = %v", err)
	}
	if !errors.Is(err, ErrCardDeclined) || !IsDeclined(err) {
		t.Fatal("ErrCardDeclined should be detectable through the wrap")
	}
	// Even with more layers of context.
	if !IsDeclined(fmt.Errorf("checkout: %w", err)) {
		t.Fatal("double wrap not detected")
	}
	if Pay("A2", 100) != nil {
		t.Fatal("small payment should succeed")
	}
}
