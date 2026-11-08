package smelly

import (
	"errors"
	"testing"
)

func TestWrappingIsLost(t *testing.T) {
	err := Pay("A1", 20000)
	if err == nil || err.Error() != "pay order A1: card declined" {
		t.Fatalf("err = %v", err)
	}
	// Documents the bug: the message looks right but the identity is lost.
	if errors.Is(err, ErrCardDeclined) {
		t.Fatal("errors.Is should fail when the error is formatted with the v verb")
	}
	if IsDeclined(err) {
		t.Fatal("== should fail on a wrapped error")
	}
}
