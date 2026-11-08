package refactored

import (
	"errors"
	"testing"
)

func TestLogin(t *testing.T) {
	s := NewSessions()
	u := &User{Name: "ana", Password: "s3cret"}
	if !u.PasswordMatches("s3cret") || s.IsActive("ana") || u.FailedAttempts != 0 {
		t.Error("query must not change state")
	}
	if err := s.Login(u, "nope"); !errors.Is(err, ErrBadCredentials) || u.FailedAttempts != 1 {
		t.Errorf("bad password: %v attempts=%d", err, u.FailedAttempts)
	}
	if err := s.Login(u, "s3cret"); err != nil || u.FailedAttempts != 0 || !s.IsActive("ana") {
		t.Errorf("good password: %v attempts=%d", err, u.FailedAttempts)
	}
}
