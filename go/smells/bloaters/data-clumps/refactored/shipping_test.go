package refactored

import "testing"

func TestShip(t *testing.T) {
	tests := []struct {
		name      string
		c         Customer
		wantLabel string
		wantCost  float64
		wantErr   bool
	}{
		{"mainland", Customer{"Ana", Address{"Gran Via 1", "Madrid", "28013"}}, "Ana\nGran Via 1\n28013 MADRID", 5, false},
		{"island", Customer{"Leo", Address{"Calle Mar 2", "Palma", "07001"}}, "Leo\nCalle Mar 2\n07001 PALMA", 15, false},
		{"invalid", Customer{"Eva", Address{"", "Bilbao", "48001"}}, "", 0, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			label, cost, err := Ship(tt.c)
			if (err != nil) != tt.wantErr || label != tt.wantLabel || cost != tt.wantCost {
				t.Errorf("got (%q, %v, %v)", label, cost, err)
			}
		})
	}
}
