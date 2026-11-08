// Package smelly illustrates Side Effects: CheckPassword promises only to
// check the password, but it also opens a session and resets the failed
// attempts counter. Calling it "just to check" has hidden consequences.
package smelly

// User is a user.
type User struct {
	Name           string
	Password       string
	FailedAttempts int
}

// Sessions stores the open sessions.
type Sessions struct{ Active map[string]bool }

// NewSessions creates the session registry.
func NewSessions() *Sessions { return &Sessions{Active: map[string]bool{}} }

// CheckPassword checks the password.
// SMELL: Side Effects. It modifies the user and opens a session without
// the name saying so.
func (s *Sessions) CheckPassword(u *User, password string) bool {
	if u.Password != password {
		u.FailedAttempts++
		return false
	}
	u.FailedAttempts = 0
	s.Active[u.Name] = true
	return true
}
