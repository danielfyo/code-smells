// Package refactored is precise: money in integer cents and lookups that
// distinguish "not found" from "ambiguous".
package refactored

import (
	"errors"
	"fmt"
)

// Wallet is a wallet with a balance in cents.
//
// REFACTOR: Replace Primitive (float) with an integer of minimal units.
type Wallet struct {
	BalanceCents int64
}

// Deposit adds balance.
func (w *Wallet) Deposit(cents int64) { w.BalanceCents += cents }

// User is a user.
type User struct {
	Email string
	Name  string
}

// Lookup errors.
var (
	ErrNotFound  = errors.New("user not found")
	ErrAmbiguous = errors.New("more than one user matches")
)

// FindByEmail returns the only user with that email or an explicit error.
//
// REFACTOR: the contract is precise; the 0 and >1 cases are visible errors.
func FindByEmail(users []User, email string) (User, error) {
	var found []User
	for _, u := range users {
		if u.Email == email {
			found = append(found, u)
		}
	}
	switch len(found) {
	case 0:
		return User{}, fmt.Errorf("find %q: %w", email, ErrNotFound)
	case 1:
		return found[0], nil
	default:
		return User{}, fmt.Errorf("find %q: %w", email, ErrAmbiguous)
	}
}
