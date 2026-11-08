package refactored

import (
	"errors"
	"testing"
)

func TestParseAge(t *testing.T) {
	if age, err := ParseAge("42"); err != nil || age != 42 {
		t.Fatalf("got %d, %v", age, err)
	}
	if _, err := ParseAge("abc"); err == nil {
		t.Fatal("expected syntax error")
	}
	for _, in := range []string{"-1", "200"} {
		if _, err := ParseAge(in); !errors.Is(err, ErrAgeOutOfRange) {
			t.Fatalf("ParseAge(%q) err = %v", in, err)
		}
	}
}
