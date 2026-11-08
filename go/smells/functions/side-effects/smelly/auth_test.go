package smelly

import "testing"

func TestCheckPassword(t *testing.T) {
	s := NewSessions()
	u := &User{Name: "ana", Password: "s3cret"}
	if s.CheckPassword(u, "nope") || u.FailedAttempts != 1 {
		t.Errorf("bad password: attempts=%d", u.FailedAttempts)
	}
	if !s.CheckPassword(u, "s3cret") || u.FailedAttempts != 0 {
		t.Errorf("good password: attempts=%d", u.FailedAttempts)
	}
	// SMELL documented: "just checking" has opened a session.
	if !s.Active["ana"] {
		t.Error("expected hidden session side effect")
	}
}
