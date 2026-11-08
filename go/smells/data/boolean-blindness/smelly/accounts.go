// Package smelly illustrates Boolean Blindness: CreateAccount takes two bools
// and returns another. In the call CreateAccount("ana", true, false) it is
// impossible to know what each value means without opening the definition.
package smelly

import "fmt"

// Account is a user account.
type Account struct {
	Username string
	Admin    bool
	Verified bool
}

// CreateAccount creates an account.
// SMELL: Boolean Blindness. Two consecutive bools can be swapped without
// the compiler noticing.
func CreateAccount(username string, admin bool, verified bool) Account {
	return Account{Username: username, Admin: admin, Verified: verified}
}

// CanDelete returns true/false without explaining the reason for rejection.
// SMELL: the returned bool loses the information about why.
func CanDelete(a Account) bool { return a.Admin && a.Verified }

// Describe shows the state.
func Describe(a Account) string {
	return fmt.Sprintf("%s admin=%t verified=%t", a.Username, a.Admin, a.Verified)
}
