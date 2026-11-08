// Package smelly illustrates Returning Error Codes: Withdraw returns -1, -2
// or -3 to signal failures, mixed with the resulting balance. It is easy to
// ignore them and treat them as a valid balance.
package smelly

// Magic error codes.
// SMELL: Error Codes. The meaning lives in a comment, not in the type.
const (
	ErrCodeInvalidAmount = -1
	ErrCodeInsufficient  = -2
	ErrCodeLocked        = -3
)

// Wallet is a wallet in cents.
type Wallet struct {
	Balance int
	Locked  bool
}

// Withdraw takes money out and returns the remaining balance or a negative code.
func (w *Wallet) Withdraw(amount int) int {
	if w.Locked {
		return ErrCodeLocked
	}
	if amount <= 0 {
		return ErrCodeInvalidAmount
	}
	if amount > w.Balance {
		return ErrCodeInsufficient
	}
	w.Balance -= amount
	return w.Balance
}
