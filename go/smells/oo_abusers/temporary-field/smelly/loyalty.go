// Package smelly illustrates Temporary Field: the struct keeps fields that
// only make sense while Calculate runs; the rest of the time they are empty
// or, worse, hold leftovers from the previous call.
package smelly

// PointsCalculator computes loyalty points.
type PointsCalculator struct {
	Tier string // "gold" or "standard"

	// SMELL: Temporary Field. Only used inside Calculate.
	multiplier   int
	runningTotal int
	bonusApplied bool
}

// Calculate returns the points for a list of purchases (in euros).
func (c *PointsCalculator) Calculate(purchases []int) int {
	c.multiplier = 1
	if c.Tier == "gold" {
		c.multiplier = 2
	}
	// SMELL: it forgets to reset runningTotal and bonusApplied: the state of
	// one call leaks into the next.
	for _, p := range purchases {
		c.runningTotal += p * c.multiplier
	}
	if c.runningTotal >= 100 && !c.bonusApplied {
		c.runningTotal += 50
		c.bonusApplied = true
	}
	return c.runningTotal
}
