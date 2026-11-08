package smelly

import "testing"

func TestRegisterAge(t *testing.T) {
	if age, ok := RegisterAge("42"); !ok || age != 42 {
		t.Fatalf("got %d, %v", age, ok)
	}
	for _, in := range []string{"abc", "-1", "200"} {
		if _, ok := RegisterAge(in); ok {
			t.Fatalf("RegisterAge(%q) should fail", in)
		}
	}
}
