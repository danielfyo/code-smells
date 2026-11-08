// Package smelly chains a complex expression without intermediate variables
// explaining each part.
package smelly

// Applicant is a loan applicant.
type Applicant struct {
	Age              int
	MonthlyIncome    int64
	MonthlyDebt      int64
	YearsEmployed    int
	HasDefaultRecord bool
}

// Eligible decides whether the loan is approved.
//
// SMELL: a single huge condition. To understand it you must decode each
// subexpression in your head (what is that *40/100?).
func Eligible(a Applicant, monthlyPayment int64) bool {
	return a.Age >= 18 && a.Age <= 70 && !a.HasDefaultRecord &&
		(a.MonthlyDebt+monthlyPayment)*100/a.MonthlyIncome <= 40 &&
		(a.YearsEmployed >= 2 || a.MonthlyIncome > 500000)
}
