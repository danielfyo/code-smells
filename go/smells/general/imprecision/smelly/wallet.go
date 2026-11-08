// Package smelly shows imprecision: float64 for money and the assumption that
// a lookup returns exactly one result.
package smelly

// Wallet is a wallet.
type Wallet struct {
	// SMELL: float64 for money; 0.1 + 0.2 is not 0.3 in binary.
	Balance float64
}

// Deposit adds balance.
func (w *Wallet) Deposit(amount float64) { w.Balance += amount }

// User is a user.
type User struct {
	Email string
	Name  string
}

// FindByEmail SMELL: assumes there is exactly one result; with none it
// silently returns an empty User, and with several, the first one.
func FindByEmail(users []User, email string) User {
	for _, u := range users {
		if u.Email == email {
			return u
		}
	}
	return User{}
}
