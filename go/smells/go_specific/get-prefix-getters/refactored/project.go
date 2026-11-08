// Package refactored names getters after the field, without the Get prefix,
// as Effective Go recommends.
package refactored

// Project is a project with an owner and a budget.
type Project struct {
	owner  string
	budget int64
}

// NewProject creates a project.
func NewProject(owner string, budget int64) *Project {
	return &Project{owner: owner, budget: budget}
}

// Owner returns the owner.
//
// REFACTOR: Rename Method (GetOwner → Owner).
func (p *Project) Owner() string { return p.owner }

// Budget returns the budget in cents.
func (p *Project) Budget() int64 { return p.budget }

// SetOwner changes the owner.
func (p *Project) SetOwner(owner string) { p.owner = owner }
