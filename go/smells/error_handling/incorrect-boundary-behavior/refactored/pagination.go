// Package refactored handles the boundaries explicitly: empty input, the
// last partial page, out-of-range pages and invalid sizes all have a
// defined, tested behavior.
package refactored

import "errors"

// ErrInvalidPageSize is returned for a non-positive page size.
var ErrInvalidPageSize = errors.New("page size must be positive")

// TotalPages returns how many pages are needed (ceiling division).
// REFACTOR: fix the off-by-one by rounding up.
func TotalPages(total, size int) int {
	if size <= 0 || total <= 0 {
		return 0
	}
	return (total + size - 1) / size
}

// Page returns the items of a 1-based page; out-of-range pages are empty.
// REFACTOR: guard clauses for every boundary and clamp the slice end.
func Page(items []string, page, size int) ([]string, error) {
	if size <= 0 {
		return nil, ErrInvalidPageSize
	}
	if page < 1 || page > TotalPages(len(items), size) {
		return []string{}, nil
	}
	start := (page - 1) * size
	end := min(start+size, len(items))
	return items[start:end], nil
}
