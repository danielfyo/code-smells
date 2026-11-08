package smelly

import (
	"io"
	"log"
	"testing"
)

func TestImportPrices(t *testing.T) {
	log.SetOutput(io.Discard)
	c := map[string]float64{}
	ImportPrices(c, "TEA=2.5\nMUG=8")
	if c["TEA"] != 2.5 || c["MUG"] != 8 {
		t.Errorf("catalog = %v", c)
	}
}

// Documents the bug: a corrupt price silently becomes 0.
func TestCorruptPriceBecomesZero(t *testing.T) {
	log.SetOutput(io.Discard)
	c := map[string]float64{"MUG": 8}
	ImportPrices(c, "MUG=8,50\nbroken")
	if v, ok := c["MUG"]; !ok || v != 0 {
		t.Errorf("MUG = %v; smelly import silently zeroes it", v)
	}
}
