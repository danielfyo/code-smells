// Package refactored fixes Imperative Loops by expressing the intent as a
// pipeline of named steps (filter, map, sort, sum). Go has no map/filter in
// the standard library, but a few small generics plus the slices package
// are enough for each step to say what it does.
package refactored

import (
	"cmp"
	"slices"
)

// Rep is a sales representative.
type Rep struct {
	Name   string
	Region string
	Active bool
	Sales  []float64
}

// REFACTOR: Replace Loop with Pipeline (reusable generic helpers).

// Filter returns the elements that satisfy keep.
func Filter[T any](xs []T, keep func(T) bool) []T {
	var out []T
	for _, x := range xs {
		if keep(x) {
			out = append(out, x)
		}
	}
	return out
}

// Map transforms each element.
func Map[T, U any](xs []T, f func(T) U) []U {
	out := make([]U, 0, len(xs))
	for _, x := range xs {
		out = append(out, f(x))
	}
	return out
}

// Sum adds numbers.
func Sum[N cmp.Ordered](xs []N) N {
	var s N
	for _, x := range xs {
		s += x
	}
	return s
}

type repTotal struct {
	name  string
	total float64
}

// TopActiveInRegion reads like the specification.
func TopActiveInRegion(reps []Rep, region string, threshold float64) ([]string, float64) {
	inRegion := Filter(reps, func(r Rep) bool { return r.Active && r.Region == region })
	totals := Map(inRegion, func(r Rep) repTotal { return repTotal{r.Name, Sum(r.Sales)} })
	top := Filter(totals, func(t repTotal) bool { return t.total > threshold })
	slices.SortFunc(top, func(a, b repTotal) int { return cmp.Compare(b.total, a.total) })
	names := Map(top, func(t repTotal) string { return t.name })
	return names, Sum(Map(top, func(t repTotal) float64 { return t.total }))
}
