// Package smelly illustrates Parallel Inheritance Hierarchies adapted to Go:
// there are two parallel type families (employees and payroll calculators).
// Every new kind of employee requires creating its twin calculator and
// registering it in the factory that pairs them.
package smelly

import "fmt"

// Employee is family #1.
type Employee interface{ Name() string }

// Engineer is an engineer.
type Engineer struct {
	FullName string
	Salary   float64
	OnCall   int // on-call shifts this month
}

// Name of the engineer.
func (e Engineer) Name() string { return e.FullName }

// Manager is a team lead.
type Manager struct {
	FullName string
	Salary   float64
	Reports  int
}

// Name of the manager.
func (m Manager) Name() string { return m.FullName }

// Payroll is family #2, parallel to Employee.
// SMELL: Parallel Inheritance Hierarchies.
type Payroll interface{ MonthlyPay(e Employee) float64 }

// EngineerPayroll is the twin of Engineer.
type EngineerPayroll struct{}

// MonthlyPay of the engineer (needs a type assertion).
func (EngineerPayroll) MonthlyPay(e Employee) float64 {
	en := e.(Engineer)
	return en.Salary/12 + float64(en.OnCall)*150
}

// ManagerPayroll is the twin of Manager.
type ManagerPayroll struct{}

// MonthlyPay of the manager.
func (ManagerPayroll) MonthlyPay(e Employee) float64 {
	m := e.(Manager)
	return m.Salary/12 + float64(m.Reports)*50
}

// PayrollFor pairs both hierarchies.
// SMELL: a third place to touch when adding a kind of employee.
func PayrollFor(e Employee) (Payroll, error) {
	switch e.(type) {
	case Engineer:
		return EngineerPayroll{}, nil
	case Manager:
		return ManagerPayroll{}, nil
	}
	return nil, fmt.Errorf("no payroll for %T", e)
}

// TotalPayroll sums the monthly payroll of the staff.
func TotalPayroll(staff []Employee) (float64, error) {
	total := 0.0
	for _, e := range staff {
		p, err := PayrollFor(e)
		if err != nil {
			return 0, err
		}
		total += p.MonthlyPay(e)
	}
	return total, nil
}
