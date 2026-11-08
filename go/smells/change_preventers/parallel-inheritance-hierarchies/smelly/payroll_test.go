package smelly

import "testing"

type intern struct{}

func (intern) Name() string { return "intern" }

func TestTotalPayroll(t *testing.T) {
	staff := []Employee{
		Engineer{FullName: "Ana", Salary: 48000, OnCall: 2},
		Manager{FullName: "Luis", Salary: 60000, Reports: 4},
	}
	got, err := TotalPayroll(staff)
	if err != nil || got != 4000+300+5000+200 {
		t.Errorf("total = %v, %v", got, err)
	}
	// SMELL documented: an employee without a twin only fails at runtime.
	if _, err := TotalPayroll([]Employee{intern{}}); err == nil {
		t.Error("expected missing payroll error")
	}
}
