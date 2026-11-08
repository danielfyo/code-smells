package smelly

import "testing"

func TestEvaluate(t *testing.T) {
	ok := Applicant{Age: 30, Income: 3000, Debt: 600, CreditScore: 700}
	with := func(f func(*Applicant)) Applicant { a := ok; f(&a); return a }
	tests := []struct {
		name   string
		a      Applicant
		amount float64
		want   string
	}{
		{"approved", ok, 20000, "approved"},
		{"small loan low score", with(func(a *Applicant) { a.CreditScore = 500 }), 1000, "approved"},
		{"big loan low score", with(func(a *Applicant) { a.CreditScore = 500 }), 9000, "rejected: low credit score"},
		{"debt", with(func(a *Applicant) { a.Debt = 2000 }), 1000, "rejected: too much debt"},
		{"income", with(func(a *Applicant) { a.Income = 0 }), 1000, "rejected: no income"},
		{"blacklisted", with(func(a *Applicant) { a.Blacklisted = true }), 1000, "rejected: blacklisted"},
		{"underage", with(func(a *Applicant) { a.Age = 17 }), 1000, "rejected: underage"},
	}
	for _, tt := range tests {
		if got := Evaluate(tt.a, tt.amount); got != tt.want {
			t.Errorf("%s = %q", tt.name, got)
		}
	}
}
