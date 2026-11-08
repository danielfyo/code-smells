// Package smelly uses the Get prefix on getters, a Java convention that is
// not idiomatic in Go.
package smelly

// Project is a project with an owner and a budget.
type Project struct {
	owner  string
	budget int64
}

// NewProject creates a project.
func NewProject(owner string, budget int64) *Project {
	return &Project{owner: owner, budget: budget}
}

// GetOwner SMELL: in Go the getter for owner is called Owner().
func (p *Project) GetOwner() string { return p.owner }

// GetBudget SMELL: "Get" noise on every read: p.GetBudget().
func (p *Project) GetBudget() int64 { return p.budget }

// SetOwner changes the owner (the Set prefix is idiomatic).
func (p *Project) SetOwner(owner string) { p.owner = owner }
