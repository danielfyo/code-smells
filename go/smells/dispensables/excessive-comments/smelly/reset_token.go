// Package smelly illustrates Comments (as deodorant): comments try to cover
// up cryptic code (one-letter names, magic numbers, convoluted conditions)
// instead of rewriting it so it explains itself.
package smelly

import "time"

// T is a password reset token.
type T struct {
	C time.Time // creation date
	U int       // number of uses
	R bool      // revoked
}

// Ok checks whether the token is usable.
func Ok(t T, n time.Time) bool {
	// SMELL: a comment explaining a magic number.
	// 1800 seconds are 30 minutes, which is how long a token lasts
	d := n.Sub(t.C).Seconds()
	// SMELL: a comment translating an unreadable condition.
	// if it is not revoked and has not expired and has been used less than once
	// (that is, it has not been used), then it is valid
	if !t.R && !(d > 1800) && !(t.U >= 1) {
		return true // it is valid
	}
	// if we get here it is not valid
	return false
}
