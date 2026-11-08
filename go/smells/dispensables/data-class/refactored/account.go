// Package refactored fixes Data Class by moving behavior to the data: the
// account protects its invariants with Withdraw/Deposit and no longer
// exposes setters.
package refactored

import "errors"

// Domain errors, checkable with errors.Is.
var (
	ErrInvalidAmount = errors.New("amount must be positive")
	ErrFrozen        = errors.New("account frozen")
	ErrInsufficient  = errors.New("insufficient funds")
)

// BankAccount encapsulates state and rules.
// REFACTOR: Move Function + Remove Setting Method + Encapsulate Record.
type BankAccount struct {
	iban    string
	balance int64
	frozen  bool
}

// NewBankAccount creates an account.
func NewBankAccount(iban string, balance int64) *BankAccount {
	return &BankAccount{iban: iban, balance: balance}
}

// Balance returns the balance in cents (read-only).
func (a *BankAccount) Balance() int64 { return a.balance }

// Freeze locks the account: an intention-revealing operation, not a setter.
func (a *BankAccount) Freeze() { a.frozen = true }

func (a *BankAccount) canOperate(amount int64) error {
	if amount <= 0 {
		return ErrInvalidAmount
	}
	if a.frozen {
		return ErrFrozen
	}
	return nil
}

// Withdraw takes money out respecting the rules.
func (a *BankAccount) Withdraw(amount int64) error {
	if err := a.canOperate(amount); err != nil {
		return err
	}
	if a.balance < amount {
		return ErrInsufficient
	}
	a.balance -= amount
	return nil
}

// Deposit puts money in.
func (a *BankAccount) Deposit(amount int64) error {
	if err := a.canOperate(amount); err != nil {
		return err
	}
	a.balance += amount
	return nil
}

// TransferTo moves money to another account atomically.
func (a *BankAccount) TransferTo(to *BankAccount, amount int64) error {
	if err := to.canOperate(amount); err != nil {
		return err
	}
	if err := a.Withdraw(amount); err != nil {
		return err
	}
	return to.Deposit(amount)
}
