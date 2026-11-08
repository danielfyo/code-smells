// Package refactored fixes Deep Nesting with guard clauses: each rejection
// case exits early and the happy path stays at the end, without indentation.
package refactored

// Applicant is a loan applicant.
type Applicant struct {
	Age         int
	Income      float64
	Debt        float64
	CreditScore int
	Blacklisted bool
}

const (
	adultAge         = 18
	maxDebtRatio     = 0.4
	minCreditScore   = 650
	smallLoanCeiling = 5000
)

// Evaluate returns the decision on a loan.
// REFACTOR: Replace Nested Conditional with Guard Clauses.
func Evaluate(a Applicant, amount float64) string {
	if a.Age < adultAge {
		return "rejected: underage"
	}
	if a.Blacklisted {
		return "rejected: blacklisted"
	}
	if a.Income <= 0 {
		return "rejected: no income"
	}
	if a.Debt/a.Income >= maxDebtRatio {
		return "rejected: too much debt"
	}
	if a.CreditScore < minCreditScore && amount >= smallLoanCeiling {
		return "rejected: low credit score"
	}
	return "approved"
}
