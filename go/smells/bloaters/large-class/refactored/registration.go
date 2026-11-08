// Package refactored fixes Large Class by extracting each responsibility into
// its own small type (store, password policy, notifier and report) and
// composing them into a registration service.
package refactored

import (
	"errors"
	"fmt"
	"sort"
	"strings"
	"unicode"
)

// REFACTOR: Extract Class. User persistence.
type UserStore struct{ users map[string]string }

// NewUserStore creates an empty in-memory store.
func NewUserStore() *UserStore { return &UserStore{users: map[string]string{}} }

// Exists reports whether the email is already registered.
func (s *UserStore) Exists(email string) bool { _, ok := s.users[email]; return ok }

// Save stores the user.
func (s *UserStore) Save(email, password string) { s.users[email] = password }

// Emails returns the sorted emails.
func (s *UserStore) Emails() []string {
	out := make([]string, 0, len(s.users))
	for e := range s.users {
		out = append(out, e)
	}
	sort.Strings(out)
	return out
}

// REFACTOR: Extract Class. Password policy as a value.
type PasswordPolicy struct{ MinLength int }

// IsStrong checks the minimum length and at least one digit.
func (p PasswordPolicy) IsStrong(pw string) bool {
	return len(pw) >= p.MinLength && strings.IndexFunc(pw, unicode.IsDigit) >= 0
}

// Notifier is a small interface for sending messages.
// REFACTOR: Extract Interface. The service knows nothing about SMTP.
type Notifier interface{ Notify(to, body string) }

// SMTPNotifier records the sent emails (simulated).
type SMTPNotifier struct {
	Host string
	Sent []string
}

// Notify simulates sending.
func (n *SMTPNotifier) Notify(to, body string) {
	n.Sent = append(n.Sent, fmt.Sprintf("[%s] %s: %s", n.Host, to, body))
}

// RegistrationService composes the pieces.
// REFACTOR: composition instead of a struct that does everything.
type RegistrationService struct {
	Store    *UserStore
	Policy   PasswordPolicy
	Notifier Notifier
}

// Register signs up a user.
func (s RegistrationService) Register(email, password string) error {
	if !strings.Contains(email, "@") {
		return errors.New("invalid email")
	}
	if s.Store.Exists(email) {
		return errors.New("email already registered")
	}
	if !s.Policy.IsStrong(password) {
		return errors.New("weak password")
	}
	s.Store.Save(email, password)
	s.Notifier.Notify(email, "Welcome!")
	return nil
}

// UserReport builds the listing. REFACTOR: Extract Function for reporting.
func UserReport(title string, store *UserStore) string {
	return title + ": " + strings.Join(store.Emails(), ", ")
}
