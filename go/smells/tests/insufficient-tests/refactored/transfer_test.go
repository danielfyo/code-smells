package refactored

import (
	"errors"
	"testing"
)

// REFACTOR: a table of cases covering the happy path and every error branch,
// also checking that an error leaves the balances untouched. Run with
// `go test -cover` to keep an eye on coverage.
func TestTransfer(t *testing.T) {
	cases := []struct {
		name     string
		from, to string
		balance  int64
		amount   int64
		wantErr  error
		wantFrom int64
	}{
		{"happy path", "a", "b", 1000, 300, nil, 700},
		{"whole balance", "a", "b", 300, 300, nil, 0},
		{"zero amount", "a", "b", 1000, 0, ErrInvalidAmount, 1000},
		{"negative amount", "a", "b", 1000, -5, ErrInvalidAmount, 1000},
		{"same account", "a", "a", 1000, 100, ErrSameAccount, 1000},
		{"insufficient funds", "a", "b", 100, 101, ErrInsufficientFunds, 100},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			from := &Account{ID: tc.from, Balance: tc.balance}
			to := &Account{ID: tc.to}
			if tc.from == tc.to {
				to = from
			}
			err := Transfer(from, to, tc.amount)
			if !errors.Is(err, tc.wantErr) {
				t.Fatalf("err = %v, want %v", err, tc.wantErr)
			}
			if from.Balance != tc.wantFrom {
				t.Fatalf("from balance = %d, want %d", from.Balance, tc.wantFrom)
			}
		})
	}
}
