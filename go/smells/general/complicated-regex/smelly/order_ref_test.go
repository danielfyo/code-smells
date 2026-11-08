package smelly

import "testing"

func TestIsValidOrderRef(t *testing.T) {
	valid := []string{"ES-2024-000123-A", "FR-1999-999999-X7"}
	invalid := []string{"es-2024-000123-A", "ES-2124-000123-A", "ES-2024-00123-A", "ES-2024-000123-", "ES-2024-000123-XY"}
	for _, r := range valid {
		if !IsValidOrderRef(r) {
			t.Errorf("%q should be valid", r)
		}
	}
	for _, r := range invalid {
		if IsValidOrderRef(r) {
			t.Errorf("%q should be invalid", r)
		}
	}
}
