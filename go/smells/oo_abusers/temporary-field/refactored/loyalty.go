// Package refactored fixes Temporary Field by turning the temporary fields
// into local variables: the struct keeps only its real state and every
// calculation is independent.
package refactored

const (
	bonusThreshold = 100
	bonusPoints    = 50
)

// PointsCalculator computes loyalty points.
// REFACTOR: the struct only stores persistent configuration.
type PointsCalculator struct {
	Tier string
}

func (c PointsCalculator) multiplier() int {
	if c.Tier == "gold" {
		return 2
	}
	return 1
}

// Calculate returns the points for a list of purchases (in euros).
// REFACTOR: Replace Temporary Field with Local Variable; value receiver,
// no state shared between calls.
func (c PointsCalculator) Calculate(purchases []int) int {
	m := c.multiplier()
	total := 0
	for _, p := range purchases {
		total += p * m
	}
	if total >= bonusThreshold {
		total += bonusPoints
	}
	return total
}
