package refactored

import "testing"

func TestTotalPayroll(t *testing.T) {
	staff := []Employee{
		Engineer{FullName: "Ana", Salary: 48000, OnCall: 2},
		Manager{FullName: "Luis", Salary: 60000, Reports: 4},
	}
	if got := TotalPayroll(staff); got != 4000+300+5000+200 {
		t.Errorf("total = %v", got)
	}
	if got := TotalPayroll(nil); got != 0 {
		t.Errorf("empty = %v", got)
	}
}
