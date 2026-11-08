package smelly

import "testing"

func TestConfigIsFrozenAtImport(t *testing.T) {
	t.Setenv("SHOP_CURRENCY", "USD")
	// Documents the problem: init already ran before the test; changing the
	// environment now has no effect and there is no function to reload.
	if Current.Currency == "USD" {
		t.Skip("the environment already had SHOP_CURRENCY=USD at startup")
	}
	if Current.Currency == "" || Current.MaxCartSize == 0 {
		t.Fatalf("Current = %+v", Current)
	}
}
