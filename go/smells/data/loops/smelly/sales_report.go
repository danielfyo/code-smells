// Package smelly illustrates Loops / Imperative Loops: a single manual loop
// filters, transforms, accumulates and sorts at once. You have to read all of
// it to discover the intent.
package smelly

import "sort"

// Rep is a sales representative.
type Rep struct {
	Name   string
	Region string
	Active bool
	Sales  []float64
}

// TopActiveInRegion returns the names of the active reps in a region whose
// total sales exceed threshold, sorted by sales descending, plus the sum of
// those sales.
// SMELL: Loops. Several responsibilities intertwined in nested loops.
func TopActiveInRegion(reps []Rep, region string, threshold float64) ([]string, float64) {
	type row struct {
		name  string
		total float64
	}
	var rows []row
	grand := 0.0
	for i := 0; i < len(reps); i++ {
		if reps[i].Active && reps[i].Region == region {
			t := 0.0
			for j := 0; j < len(reps[i].Sales); j++ {
				t += reps[i].Sales[j]
			}
			if t > threshold {
				rows = append(rows, row{reps[i].Name, t})
				grand += t
			}
		}
	}
	sort.Slice(rows, func(a, b int) bool { return rows[a].total > rows[b].total })
	names := []string{}
	for i := 0; i < len(rows); i++ {
		names = append(names, rows[i].name)
	}
	return names, grand
}
