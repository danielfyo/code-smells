package refactored

import "testing"

func TestQueryHasNoSideEffect(t *testing.T) {
	store := NewSessionStore()
	if _, ok := store.Session("u1"); ok || store.Count() != 0 {
		t.Fatal("Session() must not create sessions")
	}
	if sess := store.FindOrCreateSession("u1"); sess.Token != "tok-u1" {
		t.Fatalf("token = %q", sess.Token)
	}
	if store.Count() != 1 {
		t.Fatalf("Count = %d, want 1", store.Count())
	}
}
