// Package refactored fixes Boolean Blindness with named types: the role and
// the verification state are their own enumerations and authorization
// returns an error that explains the reason.
package refactored

import (
	"errors"
	"fmt"
)

// Role replaces "admin bool". REFACTOR: Replace Boolean with Enum.
type Role int

// Available roles.
const (
	RoleMember Role = iota
	RoleAdmin
)

// Verification replaces "verified bool".
type Verification int

// Verification states.
const (
	Unverified Verification = iota
	Verified
)

// Account is a user account.
type Account struct {
	Username     string
	Role         Role
	Verification Verification
}

// CreateAccount creates an account; swapping arguments does not compile.
func CreateAccount(username string, role Role, v Verification) Account {
	return Account{Username: username, Role: role, Verification: v}
}

// Errors that explain why. REFACTOR: Replace Boolean Result with Error.
var (
	ErrNotAdmin   = errors.New("only admins can delete")
	ErrUnverified = errors.New("account must be verified")
)

// AuthorizeDelete returns nil if allowed, or the reason for rejection.
func AuthorizeDelete(a Account) error {
	if a.Role != RoleAdmin {
		return ErrNotAdmin
	}
	if a.Verification != Verified {
		return ErrUnverified
	}
	return nil
}

// Describe shows the state (same format as before).
func Describe(a Account) string {
	return fmt.Sprintf("%s admin=%t verified=%t", a.Username, a.Role == RoleAdmin, a.Verification == Verified)
}
