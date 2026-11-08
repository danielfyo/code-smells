// Package refactored fixes Speculative Generality by applying YAGNI: only
// what is used today remains. If a hook or a strategy is needed tomorrow,
// it will be added then, with a real use case that justifies it.
package refactored

import (
	"errors"
	"strings"
)

// SubscriberList stores the subscribed emails.
// REFACTOR: Collapse Hierarchy + Remove Dead Code + Inline Class (the
// generic interface, the hooks and the single strategy are removed).
type SubscriberList struct {
	emails map[string]struct{}
}

// Add adds a normalized subscriber.
func (l *SubscriberList) Add(email string) error {
	email = strings.ToLower(strings.TrimSpace(email))
	if !strings.Contains(email, "@") {
		return errors.New("invalid email")
	}
	if _, ok := l.emails[email]; ok {
		return errors.New("already subscribed")
	}
	if l.emails == nil {
		l.emails = map[string]struct{}{}
	}
	l.emails[email] = struct{}{}
	return nil
}

// Count returns the number of subscribers.
func (l *SubscriberList) Count() int { return len(l.emails) }
