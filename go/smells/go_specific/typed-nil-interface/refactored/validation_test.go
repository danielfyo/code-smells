package refactored

import (
	"errors"
	"slices"
	"testing"
)

func TestValidSignupReturnsNil(t *testing.T) {
	if err := Register(Signup{Email: "ana@shop.test", Password: "supersecret"}); err != nil {
		t.Fatalf("err = %#v, want nil", err)
	}
}

func TestInvalidSignup(t *testing.T) {
	err := Register(Signup{Email: "nope", Password: "x"})
	var verr *ValidationError
	if !errors.As(err, &verr) || !slices.Equal(verr.Fields, []string{"email", "password"}) {
		t.Fatalf("err = %v", err)
	}
}
