package refactored

import (
	"errors"
	"strconv"
	"testing"
)

func TestImportPrices(t *testing.T) {
	c := map[string]float64{}
	if err := ImportPrices(c, "TEA=2.5\nMUG=8"); err != nil {
		t.Fatal(err)
	}
	if c["TEA"] != 2.5 || c["MUG"] != 8 {
		t.Errorf("catalog = %v", c)
	}
}

func TestCorruptDataIsReported(t *testing.T) {
	c := map[string]float64{"MUG": 8}
	err := ImportPrices(c, "MUG=8,50\nbroken")
	if !errors.Is(err, ErrBadLine) || !errors.Is(err, strconv.ErrSyntax) {
		t.Errorf("err = %v", err)
	}
	if c["MUG"] != 8 {
		t.Errorf("catalog must stay untouched, MUG = %v", c["MUG"])
	}
}
