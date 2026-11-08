// Package smelly illustrates Incorrect Behavior at the Boundaries: the
// paging code works for "middle" pages but has an off-by-one in the page
// count, drops the last partial page and panics past the end.
package smelly

// TotalPages returns how many pages are needed.
// SMELL: integer division drops the last partial page (10 items / 3 = 3).
func TotalPages(total, size int) int {
	return total / size
}

// Page returns the items of a 1-based page.
// SMELL: no bounds checks: page 0, a page past the end or size 0 panic,
// and the last partial page slices beyond the length.
func Page(items []string, page, size int) []string {
	start := (page - 1) * size
	return items[start : start+size]
}
