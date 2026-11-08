// Package refactored fixes Side Effects by separating the pure query
// (PasswordMatches) from the command that changes state (Login), whose name
// announces what it does.
package refactored

import "errors"

// ErrBadCredentials reports a wrong password.
var ErrBadCredentials = errors.New("bad credentials")

// User is a user.
type User struct {
	Name           string
	Password       string
	FailedAttempts int
}

// PasswordMatches only queries: it changes nothing.
// REFACTOR: Separate Query from Modifier.
func (u User) PasswordMatches(password string) bool { return u.Password == password }

// Sessions stores the open sessions.
type Sessions struct{ active map[string]bool }

// NewSessions creates the session registry.
func NewSessions() *Sessions { return &Sessions{active: map[string]bool{}} }

// IsActive reports whether the user has a session.
func (s *Sessions) IsActive(name string) bool { return s.active[name] }

// Login is the explicit command: it updates attempts and opens a session.
// REFACTOR: Rename Function so the name declares the effect.
func (s *Sessions) Login(u *User, password string) error {
	if !u.PasswordMatches(password) {
		u.FailedAttempts++
		return ErrBadCredentials
	}
	u.FailedAttempts = 0
	s.active[u.Name] = true
	return nil
}
