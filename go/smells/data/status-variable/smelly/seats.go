// Package smelly illustrates Status Variable: mutable flags (found, done)
// control nested loops instead of exiting directly once the result is
// known.
package smelly

// FirstFreePair finds the first pair of adjacent free seats in a theater.
// It returns row, seat and whether it found one.
// SMELL: Status Variable. found and done are read and updated in several
// places and force you to track the state in your head.
func FirstFreePair(rows [][]bool) (int, int, bool) {
	found := false
	done := false
	row, seat := -1, -1
	for r := 0; r < len(rows) && !done; r++ {
		for s := 0; s+1 < len(rows[r]) && !done; s++ {
			if !rows[r][s] && !rows[r][s+1] {
				found = true
				row, seat = r, s
				done = true
			}
		}
	}
	if !found {
		row, seat = -1, -1
	}
	return row, seat, found
}
