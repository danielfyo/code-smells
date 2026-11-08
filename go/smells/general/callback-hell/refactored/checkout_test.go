package refactored

import (
	"errors"
	"testing"
)

func TestCheckout(t *testing.T) {
	s := &Services{}
	tracking, err := Checkout(s, "tea", 1000)
	if err != nil || tracking != "TRK-1" || len(s.Log) != 3 {
		t.Fatalf("tracking=%q err=%v log=%v", tracking, err, s.Log)
	}

	s = &Services{OutOfStock: true}
	if _, err := Checkout(s, "tea", 1000); !errors.Is(err, ErrOutOfStock) || len(s.Log) != 0 {
		t.Fatalf("err=%v log=%v", err, s.Log)
	}
}
