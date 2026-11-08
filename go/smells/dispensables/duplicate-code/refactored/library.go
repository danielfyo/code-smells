// Package refactored fixes Duplicate Code by extracting the common
// algorithm into a parameterized type: the differences (rate, cap) become data.
package refactored

import "time"

// FeePolicy describes the only things that vary between loan types.
// REFACTOR: Extract Function + Parameterize Function.
type FeePolicy struct {
	PerDay float64
	Cap    float64
}

var (
	bookPolicy = FeePolicy{PerDay: 0.25, Cap: 10}
	dvdPolicy  = FeePolicy{PerDay: 1.0, Cap: 20}
)

// LateFee is the single implementation of the algorithm.
func (p FeePolicy) LateFee(due, returned time.Time) float64 {
	if !returned.After(due) {
		return 0
	}
	days := max(int(returned.Sub(due).Hours()/24), 1)
	return min(float64(days)*p.PerDay, p.Cap)
}

// BookLateFee computes the late fee for a book.
func BookLateFee(due, returned time.Time) float64 { return bookPolicy.LateFee(due, returned) }

// DVDLateFee computes the late fee for a movie.
func DVDLateFee(due, returned time.Time) float64 { return dvdPolicy.LateFee(due, returned) }
