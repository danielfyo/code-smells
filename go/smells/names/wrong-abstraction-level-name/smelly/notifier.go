// Package smelly shows names that reveal the implementation (SMTP, slice)
// instead of the business concept.
package smelly

import "fmt"

// SMTPMailer accumulates the "sent" messages for the example.
type SMTPMailer struct {
	Outbox []string
}

// SendSMTPEmailToCustomer SMELL: the name ties callers to the SMTP protocol.
// If tomorrow we notify via SMS or push, the name lies or has to be renamed
// all over the code base.
func (m *SMTPMailer) SendSMTPEmailToCustomer(customer, orderID string) {
	m.Outbox = append(m.Outbox, fmt.Sprintf("%s: order %s shipped", customer, orderID))
}

// ShippedOrderIDsSlice SMELL: the data structure type in the name.
func ShippedOrderIDsSlice(m *SMTPMailer) int {
	return len(m.Outbox)
}
