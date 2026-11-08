package smelly

import "testing"

func TestTypedNilIsNotNil(t *testing.T) {
	err := Register(Signup{Email: "ana@shop.test", Password: "supersecret"})
	// Documents the bug: the form is valid but err != nil.
	if err == nil {
		t.Fatal("expected the typed-nil gotcha: err should be non-nil")
	}
	if verr, ok := err.(*ValidationError); !ok || verr != nil {
		t.Fatalf("expected a nil *ValidationError inside the interface, got %#v", err)
	}
}

func TestInvalidSignup(t *testing.T) {
	err := Register(Signup{Email: "nope", Password: "x"})
	if err == nil || err.Error() != "invalid fields: email, password" {
		t.Fatalf("err = %v", err)
	}
}
