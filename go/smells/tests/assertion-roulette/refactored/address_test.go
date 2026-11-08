package refactored

import "testing"

// REFACTOR: the whole struct is compared and the message shows got and want;
// each behavior goes in its own named subtest.
func TestParseAddress(t *testing.T) {
	t.Run("valid address is trimmed and country upper-cased", func(t *testing.T) {
		got, err := ParseAddress(" Calle Mayor 1 ; Zaragoza ; 50001 ; es ")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		want := Address{Street: "Calle Mayor 1", City: "Zaragoza", PostalCode: "50001", Country: "ES"}
		if got != want {
			t.Errorf("ParseAddress() = %+v, want %+v", got, want)
		}
	})
	t.Run("wrong number of parts is an error", func(t *testing.T) {
		if _, err := ParseAddress("just one part"); err == nil {
			t.Error("ParseAddress(\"just one part\") error = nil, want non-nil")
		}
	})
}
