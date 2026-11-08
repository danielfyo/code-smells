// Package smelly illustrates Hidden Temporal Coupling: Mailer requires
// calling SetTemplate and SetRecipients before Send, but nothing in the API
// says so or enforces it. Change the order and empty emails (or none) go out.
package smelly

import "strings"

// Mailer sends email campaigns.
type Mailer struct {
	template   string
	recipients []string
	Sent       []string
}

// SetTemplate sets the template (must be called first).
func (m *Mailer) SetTemplate(t string) { m.template = t }

// SetRecipients sets the recipients (must be called before Send).
func (m *Mailer) SetRecipients(r []string) { m.recipients = r }

// Send sends the campaign.
// SMELL: Hidden Temporal Coupling. It silently depends on the two previous
// calls; without them it "works" and sends nothing useful.
func (m *Mailer) Send() int {
	for _, r := range m.recipients {
		m.Sent = append(m.Sent, r+": "+strings.ReplaceAll(m.template, "{name}", strings.Split(r, "@")[0]))
	}
	return len(m.recipients)
}
