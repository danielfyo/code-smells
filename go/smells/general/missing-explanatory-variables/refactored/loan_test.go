package refactored

import "testing"

func TestEligible(t *testing.T) {
	base := Applicant{Age: 30, MonthlyIncome: 300000, MonthlyDebt: 50000, YearsEmployed: 3}
	if !Eligible(base, 60000) {
		t.Fatal("base applicant should be eligible")
	}
	young := base
	young.Age = 17
	if Eligible(young, 60000) {
		t.Fatal("minor should not be eligible")
	}
	if Eligible(base, 80000) {
		t.Fatal("debt ratio above 40% should not be eligible")
	}
	newJobRich := base
	newJobRich.YearsEmployed, newJobRich.MonthlyIncome = 0, 600000
	if !Eligible(newJobRich, 60000) {
		t.Fatal("high income compensates short employment")
	}
}
