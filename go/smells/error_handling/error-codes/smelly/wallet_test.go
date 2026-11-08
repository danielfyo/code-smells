package smelly

import "testing"

func TestWithdraw(t *testing.T) {
	tests := []struct {
		name   string
		w      Wallet
		amount int
		want   int
	}{
		{"ok", Wallet{Balance: 1000}, 300, 700},
		{"invalid", Wallet{Balance: 1000}, 0, ErrCodeInvalidAmount},
		{"insufficient", Wallet{Balance: 100}, 300, ErrCodeInsufficient},
		{"locked", Wallet{Balance: 1000, Locked: true}, 1, ErrCodeLocked},
	}
	for _, tt := range tests {
		w := tt.w
		if got := w.Withdraw(tt.amount); got != tt.want {
			t.Errorf("%s = %d", tt.name, got)
		}
	}
	// SMELL documented: code -2 can be added as if it were a balance.
	w := Wallet{Balance: 100}
	if total := 500 + w.Withdraw(300); total != 498 {
		t.Errorf("total = %d", total)
	}
}
