package refactored

import (
	"errors"
	"testing"
)

func TestTransfer(t *testing.T) {
	a, b := NewBankAccount("ES01", 1000), NewBankAccount("ES02", 0)
	if err := a.TransferTo(b, 300); err != nil || a.Balance() != 700 || b.Balance() != 300 {
		t.Fatalf("got %v %d %d", err, a.Balance(), b.Balance())
	}
	tests := []struct {
		amount int64
		want   error
	}{{0, ErrInvalidAmount}, {5000, ErrInsufficient}}
	for _, tt := range tests {
		if err := a.TransferTo(b, tt.amount); !errors.Is(err, tt.want) {
			t.Errorf("%d: err = %v", tt.amount, err)
		}
	}
	b.Freeze()
	if err := a.TransferTo(b, 10); !errors.Is(err, ErrFrozen) || a.Balance() != 700 {
		t.Errorf("frozen: err = %v balance = %d", err, a.Balance())
	}
}
