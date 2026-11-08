// Package smelly illustrates Duplicate Code: the late fee calculation for
// books and movies is the same algorithm copy-pasted with two different
// numbers. Fixing a bug in one requires remembering the other.
package smelly

import "time"

// BookLateFee computes the late fee for a book.
// SMELL: Duplicate Code. Block identical to the one in DVDLateFee.
func BookLateFee(due, returned time.Time) float64 {
	if !returned.After(due) {
		return 0
	}
	days := int(returned.Sub(due).Hours() / 24)
	if days == 0 {
		days = 1
	}
	fee := float64(days) * 0.25
	if fee > 10 {
		fee = 10
	}
	return fee
}

// DVDLateFee computes the late fee for a movie.
// SMELL: a copy with other literals (rate 1.0, cap 20).
func DVDLateFee(due, returned time.Time) float64 {
	if !returned.After(due) {
		return 0
	}
	days := int(returned.Sub(due).Hours() / 24)
	if days == 0 {
		days = 1
	}
	fee := float64(days) * 1.0
	if fee > 20 {
		fee = 20
	}
	return fee
}
