// Package smelly illustrates Deep Nesting / Arrow Code: five levels of
// nested ifs form an arrow and hide the main path (approve).
package smelly

// Applicant is a loan applicant.
type Applicant struct {
	Age         int
	Income      float64
	Debt        float64
	CreditScore int
	Blacklisted bool
}

// Evaluate returns the decision on a loan.
// SMELL: Deep Nesting. You have to keep track of five open conditions.
func Evaluate(a Applicant, amount float64) string {
	if a.Age >= 18 {
		if !a.Blacklisted {
			if a.Income > 0 {
				if a.Debt/a.Income < 0.4 {
					if a.CreditScore >= 650 || amount < 5000 {
						return "approved"
					} else {
						return "rejected: low credit score"
					}
				} else {
					return "rejected: too much debt"
				}
			} else {
				return "rejected: no income"
			}
		} else {
			return "rejected: blacklisted"
		}
	}
	return "rejected: underage"
}
