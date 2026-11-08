package smelly

import "testing"

func TestGetSessionHasHiddenSideEffect(t *testing.T) {
	store := NewSessionStore()
	// We only wanted to look... and a session got created.
	if sess := store.GetSession("u1"); sess.Token != "tok-u1" {
		t.Fatalf("token = %q", sess.Token)
	}
	if store.Count() != 1 {
		t.Fatalf("Count = %d, want 1 (hidden side effect of GetSession)", store.Count())
	}
}
