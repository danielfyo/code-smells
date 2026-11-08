package refactored

import "testing"

func env(m map[string]string) func(string) string {
	return func(k string) string { return m[k] }
}

func TestLoad(t *testing.T) {
	cfg, err := Load(env(nil))
	if err != nil || cfg != (Config{"EUR", 50}) {
		t.Fatalf("defaults = %+v, %v", cfg, err)
	}
	cfg, err = Load(env(map[string]string{"SHOP_CURRENCY": "USD", "SHOP_MAX_CART": "10"}))
	if err != nil || cfg != (Config{"USD", 10}) {
		t.Fatalf("custom = %+v, %v", cfg, err)
	}
	if _, err := Load(env(map[string]string{"SHOP_MAX_CART": "ten"})); err == nil {
		t.Fatal("expected error for invalid SHOP_MAX_CART")
	}
}
