// Package refactored breaks the condition into explanatory variables whose
// names tell each rule.
package refactored

// Applicant is a loan applicant.
type Applicant struct {
	Age              int
	MonthlyIncome    int64
	MonthlyDebt      int64
	YearsEmployed    int
	HasDefaultRecord bool
}

const (
	minAge                 = 18
	maxAge                 = 70
	maxDebtToIncomePercent = 40
	minYearsEmployed       = 2
	highIncomeMonthlyCents = 500000
)

// Eligible decides whether the loan is approved.
//
// REFACTOR: Extract Variable; each subexpression has a name that explains the
// business rule.
func Eligible(a Applicant, monthlyPayment int64) bool {
	ageInRange := a.Age >= minAge && a.Age <= maxAge
	cleanHistory := !a.HasDefaultRecord
	debtToIncomePercent := (a.MonthlyDebt + monthlyPayment) * 100 / a.MonthlyIncome
	affordable := debtToIncomePercent <= maxDebtToIncomePercent
	stableIncome := a.YearsEmployed >= minYearsEmployed || a.MonthlyIncome > highIncomeMonthlyCents

	return ageInRange && cleanHistory && affordable && stableIncome
}
