package refactored

import (
	"errors"
	"testing"
)

func TestRegister(t *testing.T) {
	var r Registry
	if err := r.Register(" ana@shop.test "); err != nil {
		t.Fatal(err)
	}
	if err := r.Register("nope"); !errors.Is(err, ErrInvalidEmail) {
		t.Fatalf("err = %v", err)
	}
	if len(r.Users) != 1 || r.Users[0].Email != "ana@shop.test" {
		t.Fatalf("users = %+v", r.Users)
	}
}

func TestValidateEmailAlone(t *testing.T) {
	if _, err := ValidateEmail("x@y.test"); err != nil {
		t.Fatal(err)
	}
}
