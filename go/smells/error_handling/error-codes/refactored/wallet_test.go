package refactored

import (
	"errors"
	"testing"
)

func TestWithdraw(t *testing.T) {
	tests := []struct {
		name    string
		w       Wallet
		amount  int
		want    int
		wantErr error
	}{
		{"ok", Wallet{Balance: 1000}, 300, 700, nil},
		{"invalid", Wallet{Balance: 1000}, 0, 1000, ErrInvalidAmount},
		{"insufficient", Wallet{Balance: 100}, 300, 100, ErrInsufficient},
		{"locked", Wallet{Balance: 1000, Locked: true}, 1, 1000, ErrLocked},
	}
	for _, tt := range tests {
		w := tt.w
		got, err := w.Withdraw(tt.amount)
		if got != tt.want || !errors.Is(err, tt.wantErr) {
			t.Errorf("%s = %d, %v", tt.name, got, err)
		}
	}
}
