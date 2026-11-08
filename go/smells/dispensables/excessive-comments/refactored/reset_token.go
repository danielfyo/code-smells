// Package refactored removes the deodorant comments by rewriting the code:
// expressive names, named constants and extracted predicates make it
// unnecessary to explain the "what"; at most the "why" remains.
package refactored

import "time"

// TokenLifetime is how long a token lasts (security requirement).
// REFACTOR: Replace Magic Number with Symbolic Constant.
const TokenLifetime = 30 * time.Minute

// ResetToken is a password reset token.
// REFACTOR: Rename Field (names replace the comments).
type ResetToken struct {
	CreatedAt time.Time
	Uses      int
	Revoked   bool
}

// REFACTOR: Extract Function. Each predicate has its own name.
func (t ResetToken) expired(now time.Time) bool { return now.Sub(t.CreatedAt) > TokenLifetime }

func (t ResetToken) used() bool { return t.Uses > 0 }

// IsValid reports whether the token can be redeemed.
func (t ResetToken) IsValid(now time.Time) bool {
	return !t.Revoked && !t.expired(now) && !t.used()
}
