// Package refactored fixes Hidden Temporal Coupling by making the order
// explicit: a constructor requires all the needed data and validates it, so
// it is impossible to reach Send with a half-configured object.
package refactored

import (
	"errors"
	"strings"
)

// Campaign is a campaign ready to be sent.
// REFACTOR: Replace Setters with Constructor (valid state from the start).
type Campaign struct {
	template   string
	recipients []string
}

// NewCampaign receives everything it needs at once.
func NewCampaign(template string, recipients []string) (Campaign, error) {
	if template == "" {
		return Campaign{}, errors.New("template is required")
	}
	if len(recipients) == 0 {
		return Campaign{}, errors.New("at least one recipient is required")
	}
	return Campaign{template: template, recipients: recipients}, nil
}

// Send returns the generated messages without depending on previous calls.
// REFACTOR: the result is returned instead of accumulated in state.
func (c Campaign) Send() []string {
	out := make([]string, 0, len(c.recipients))
	for _, r := range c.recipients {
		name, _, _ := strings.Cut(r, "@")
		out = append(out, r+": "+strings.ReplaceAll(c.template, "{name}", name))
	}
	return out
}
