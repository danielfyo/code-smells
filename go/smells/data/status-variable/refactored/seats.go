// Package refactored fixes Status Variable by returning as soon as the
// result is known: no flags and no extra loop conditions.
package refactored

// FirstFreePair finds the first pair of adjacent free seats (occupied seats
// are true). It returns row, seat and whether it found one.
// REFACTOR: Replace Control Flag with Break/Return.
func FirstFreePair(rows [][]bool) (row, seat int, ok bool) {
	for r, seats := range rows {
		for s := 0; s+1 < len(seats); s++ {
			if !seats[s] && !seats[s+1] {
				return r, s, true
			}
		}
	}
	return -1, -1, false
}
