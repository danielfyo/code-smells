// Package smelly illustrates Data Class: BankAccount only has fields with
// getters and setters; the rules (non-negative balance, frozen accounts)
// live in an external service that manipulates its data.
package smelly

import "errors"

// BankAccount is a mere data container.
// SMELL: Data Class. Getters/setters without behavior; anyone can leave
// the account in an invalid state with SetBalance.
type BankAccount struct {
	iban    string
	balance int64
	frozen  bool
}

// NewBankAccount creates an account.
func NewBankAccount(iban string, balance int64) *BankAccount {
	return &BankAccount{iban: iban, balance: balance}
}

// IBAN returns the IBAN.
func (a *BankAccount) IBAN() string { return a.iban }

// Balance returns the balance in cents.
func (a *BankAccount) Balance() int64 { return a.balance }

// SetBalance changes the balance without any rule.
func (a *BankAccount) SetBalance(b int64) { a.balance = b }

// Frozen reports whether the account is locked.
func (a *BankAccount) Frozen() bool { return a.frozen }

// SetFrozen locks or unlocks.
func (a *BankAccount) SetFrozen(f bool) { a.frozen = f }

// TransferService holds the logic that should live in the account.
// SMELL: associated Feature Envy: it only works with BankAccount data.
type TransferService struct{}

// Transfer moves money between accounts.
func (TransferService) Transfer(from, to *BankAccount, amount int64) error {
	if amount <= 0 {
		return errors.New("amount must be positive")
	}
	if from.Frozen() || to.Frozen() {
		return errors.New("account frozen")
	}
	if from.Balance() < amount {
		return errors.New("insufficient funds")
	}
	from.SetBalance(from.Balance() - amount)
	to.SetBalance(to.Balance() + amount)
	return nil
}
