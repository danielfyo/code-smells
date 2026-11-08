// Package refactored fixes Magic Numbers by naming every literal and typing
// the plan: the code reads like the business rule itself.
package refactored

import (
	"math"
	"time"
)

// Plan is the pass type. REFACTOR: Replace Magic String with Named Type.
type Plan string

// Available plans.
const (
	PlanVisitor  Plan = "V"
	PlanResident Plan = "R"
)

// REFACTOR: Replace Magic Number with Symbolic Constant.
const (
	gracePeriod      = 15 * time.Minute
	reducedRateHours = 3
	firstHoursRate   = 2.5
	extraHourRate    = 1.75
	dailyCap         = 20.0
)

// Fee computes the price of a stay.
func Fee(stay time.Duration, plan Plan) float64 {
	if plan == PlanResident || stay <= gracePeriod {
		return 0
	}
	hours := math.Ceil(stay.Hours())
	first := min(hours, reducedRateHours)
	extra := hours - first
	return min(first*firstHoursRate+extra*extraHourRate, dailyCap)
}
