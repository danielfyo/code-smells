// Package refactored fixes Parallel Inheritance Hierarchies by merging the
// two families: each employee knows how to compute its own payroll, so
// adding a new kind means creating a single type.
package refactored

// Employee now includes the payroll behavior.
// REFACTOR: Move Method + Collapse Hierarchy (the Payroll family is removed).
type Employee interface {
	Name() string
	MonthlyPay() float64
}

// Engineer is an engineer.
type Engineer struct {
	FullName string
	Salary   float64
	OnCall   int
}

// Name of the engineer.
func (e Engineer) Name() string { return e.FullName }

// MonthlyPay of the engineer.
func (e Engineer) MonthlyPay() float64 { return e.Salary/12 + float64(e.OnCall)*150 }

// Manager is a team lead.
type Manager struct {
	FullName string
	Salary   float64
	Reports  int
}

// Name of the manager.
func (m Manager) Name() string { return m.FullName }

// MonthlyPay of the manager.
func (m Manager) MonthlyPay() float64 { return m.Salary/12 + float64(m.Reports)*50 }

// TotalPayroll sums the monthly payroll: no factory, no type assertions.
func TotalPayroll(staff []Employee) float64 {
	total := 0.0
	for _, e := range staff {
		total += e.MonthlyPay()
	}
	return total
}
