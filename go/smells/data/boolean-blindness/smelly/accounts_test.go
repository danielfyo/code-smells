package smelly

import "testing"

func TestAccounts(t *testing.T) {
	tests := []struct {
		admin, verified bool
		canDelete       bool
		desc            string
	}{
		{true, true, true, "ana admin=true verified=true"},
		{true, false, false, "ana admin=true verified=false"},
		{false, true, false, "ana admin=false verified=true"},
	}
	for _, tt := range tests {
		a := CreateAccount("ana", tt.admin, tt.verified)
		if CanDelete(a) != tt.canDelete || Describe(a) != tt.desc {
			t.Errorf("got %v %q", CanDelete(a), Describe(a))
		}
	}
}
