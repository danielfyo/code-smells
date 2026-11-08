package refactored

import "testing"

func TestSignup(t *testing.T) {
	s := Store{}
	msg, err := Signup(s, "  Marta@Mail.com ", "longpassword")
	if err != nil || msg != "Welcome, Marta!" {
		t.Fatalf("got %q, %v", msg, err)
	}
	if h := s["marta@mail.com"]; len(h) != 64 {
		t.Errorf("hash = %q", h)
	}
	for _, c := range [][2]string{{"marta@mail.com", "longpassword"}, {"nobody", "longpassword"}, {"a@b.c", "short"}} {
		if _, err := Signup(s, c[0], c[1]); err == nil {
			t.Errorf("expected error for %v", c)
		}
	}
}
