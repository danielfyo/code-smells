package smelly

import (
	"slices"
	"testing"
)

func TestTopActiveInRegion(t *testing.T) {
	reps := []Rep{
		{"Ana", "north", true, []float64{100, 250}},
		{"Ben", "north", true, []float64{500}},
		{"Cid", "north", false, []float64{900}},
		{"Dua", "south", true, []float64{800}},
		{"Eli", "north", true, []float64{50}},
	}
	names, total := TopActiveInRegion(reps, "north", 100)
	if !slices.Equal(names, []string{"Ben", "Ana"}) || total != 850 {
		t.Errorf("got %v %v", names, total)
	}
	names, total = TopActiveInRegion(reps, "west", 0)
	if len(names) != 0 || total != 0 {
		t.Errorf("empty got %v %v", names, total)
	}
}
