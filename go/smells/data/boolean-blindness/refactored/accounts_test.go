package refactored

import (
	"errors"
	"testing"
)

func TestAccounts(t *testing.T) {
	tests := []struct {
		role    Role
		v       Verification
		wantErr error
		desc    string
	}{
		{RoleAdmin, Verified, nil, "ana admin=true verified=true"},
		{RoleAdmin, Unverified, ErrUnverified, "ana admin=true verified=false"},
		{RoleMember, Verified, ErrNotAdmin, "ana admin=false verified=true"},
	}
	for _, tt := range tests {
		a := CreateAccount("ana", tt.role, tt.v)
		if err := AuthorizeDelete(a); !errors.Is(err, tt.wantErr) || Describe(a) != tt.desc {
			t.Errorf("got %v %q", err, Describe(a))
		}
	}
}
