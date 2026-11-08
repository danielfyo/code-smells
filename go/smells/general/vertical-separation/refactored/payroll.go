// Package refactored places each declaration next to its use and orders
// functions top-down (caller before callee).
package refactored

// Employee is an hourly employee.
type Employee struct {
	HourlyCents int64
	Hours       int
}

const regularHoursPerMonth = 160

// MonthlyPay computes the monthly salary rounded to the euro.
//
// REFACTOR: variables declared at their first use; helpers appear right
// below, in reading order (the "stepdown" rule).
func MonthlyPay(e Employee) int64 {
	regularHours := min(e.Hours, regularHoursPerMonth)
	extraHours := e.Hours - regularHours

	regular := int64(regularHours) * e.HourlyCents
	overtime := overtimePay(e.HourlyCents, extraHours)
	return roundToEuro(regular + overtime)
}

const overtimeMultiplierPercent = 150

func overtimePay(hourly int64, hours int) int64 {
	return int64(hours) * hourly * overtimeMultiplierPercent / 100
}

func roundToEuro(cents int64) int64 { return (cents + 50) / 100 * 100 }
