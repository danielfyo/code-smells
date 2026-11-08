// Package smelly declares variables and functions far from where they are
// used; the reader must jump up and down to follow the flow.
package smelly

// SMELL: this constant is only used by overtimePay, at the end of the file.
const overtimeMultiplierPercent = 150

// SMELL: helper defined far away from its only use.
func round(cents int64) int64 { return (cents + 50) / 100 * 100 }

// Employee is an hourly employee.
type Employee struct {
	HourlyCents int64
	Hours       int
}

// MonthlyPay computes the monthly salary rounded to the euro.
func MonthlyPay(e Employee) int64 {
	// SMELL: variables declared at the top and used much further down.
	var regular, overtime int64
	regularHours := e.Hours
	extraHours := 0

	// ... imagine 40 lines of other stuff here ...

	if regularHours > 160 {
		extraHours = regularHours - 160
		regularHours = 160
	}
	regular = int64(regularHours) * e.HourlyCents
	overtime = overtimePay(e.HourlyCents, extraHours)
	return round(regular + overtime)
}

func overtimePay(hourly int64, hours int) int64 {
	return int64(hours) * hourly * overtimeMultiplierPercent / 100
}
