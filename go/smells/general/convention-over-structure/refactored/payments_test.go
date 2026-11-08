package refactored

import "testing"

func TestFee(t *testing.T) {
	cases := []struct {
		m     PaymentMethod
		fee   int64
		label string
	}{
		{Card{}, 200, "Card"},
		{Transfer{}, 50, "Bank transfer"},
		{PayPal{}, 335, "PayPal"},
	}
	for _, c := range cases {
		if c.m.Fee(10000) != c.fee || c.m.Label() != c.label {
			t.Errorf("%T: fee=%d label=%q", c.m, c.m.Fee(10000), c.m.Label())
		}
	}
}
